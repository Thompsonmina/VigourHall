// import timely_tasks_artefacts from '../out/tasks.sol/Tasks.json'
import {
    notification, notificationOff, format_to_wei, delay, showModal, hideModal,
storeFitbitCredentials, getFitbitCredentials} from "./utils";
import { logout, isLoggedIn,  get_username, login, signup, reassociate_user } from "./user";
import { auth_modal, other_user_actions_modal } from "./components";
import { generate_auth_url, get_access_token, SCOPES } from "./fitbit";
import {vigour_hall_abi, vigour_hall_address, isEnrolledInChallenge, enrollInChallenge, getUsers, getUserDetails, createNewUser, getChallengeBalances, claimPayment } from "./contract";
import { sendFitnessData, getFitnessData, downloadFitnessData, saveNewFitnessData} from "./storage"
import { generate_mnemonic, deriveKeyFromMnemonic, generateUserSecureHash, encrypt, decrypt } from "./encrypt"


const ethers = require("ethers")
import { MetaMaskSDK } from '@metamask/sdk';

import './styles.css';

const MMSDK = new MetaMaskSDK();
console.log(MMSDK)
await MMSDK.init()
ethereum = MMSDK.getProvider(); // You can also access via window.ethereum

console.log("Sdk issues?", ethereum)
let signer;
let provider;
let current_address;
let contract;

const challengeMapping = {water: 1, sleep: 2, bodyfat: 3, steps: 4, activity: 5}

async function isAccountConnected() {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts, "accounts why no show?")
    current_address = accounts[0];
    if (accounts.length !== 0) {
        return true;
    }
    return false;
}


function toggleBanner() {
    document.getElementById('intro-banner').classList.toggle("hidden");
    document.getElementById('main-content').classList.toggle('hidden');
}

// handle metamask connection
const connectMetaMaskWallet = async function () {
    if (ethereum.isMetaMask) {

        // if (isAccountConnected()) {
        //     await notification(" Connected to Metamask...");
        //     toggleBanner()
        // }
        
            await notification("⚠️ Please approve this DApp to use it.")
            try {
                let accounts = await ethereum.request({ method: 'eth_requestAccounts', params: [] });
                current_address = accounts[0];
                console.log(current_address, accounts[0], "accounts") ;
            }
            catch (error) {
                console.error(error);
            }
            console.log("approved")

        try {
                
            provider = new ethers.BrowserProvider(
                ethereum,
                "any"
            );
            console.log("here?");
            
            signer = await provider.getSigner();
            console.log("passed finder")
        
        }
        catch (error) {
            await notification(`⚠️ ${error}.`)
            console.error(error);
        }
    }
    else {
        await notification("⚠️ Please install Metamask.")
        console.log("Please install Metamask.");
    }
}


// const getEthBalance = async function (address) {
//     let balance = await erc20_contract.balanceOf(address)
//     balance = ethers.utils.formatEther(balance);
//     return balance
// }



// Top level event listeners

 // MetaMask event listeners
//  ethereum.on("chainChanged", handleNewNetwork);
 ethereum.on("accountsChanged", () => {
     window.location.reload();
 });

// event listener for all the navbar clicks
document.getElementById('navbar').addEventListener('click', function(event) {
    // Check if the clicked element is a nav-item
    if (event.target.matches('.pri-nav-item')) {

        console.log("navbar clicked in pri")

        // Get the target modal ID from the data-modal-target attribute
        const modalId = event.target.getAttribute('data-modal-target');
        console.log(modalId, "Profile")

        if (modalId === "profileModal") {
            // Use this modal ID to toggle the corresponding modal
            renderProfileModal();
        }
        else if (modalId === "earningsModal") {
            renderEarningsModal();
        }
        else if (modalId === "userModal") {
            renderUserModal("login");
        }
    }

    if (event.target.matches('.sec-nav-item')) {
        // Get the target modal ID from the data-modal-target attribute
        // search for the reassocciate button attribute
        const modalId = event.target.getAttribute('data-modal-target');
        const userAction = event.target.getAttribute('data-user-action');
        
        console.log(modalId, "modalId")
        if (userAction === "reassociate") {
            console.log("reassociate")
            renderUserModal("reassociate");
        }

        if (userAction === "logout") {
            console.log("logout")
            logout();
        }
    }
});

// event listener for all the modal closes
function listen_for_close_modal() {
    const modal_close_buttons = document.querySelectorAll('.modal-close-btn ');

    modal_close_buttons.forEach((button) => {
        button.addEventListener('click', function() {
            // Your click event code here
            let id = button.parentElement.parentElement.id
            if (!id) {
                id = button.parentElement.parentElement.parentElement.id
            }
          console.log(id)
          hideModal(id);
        });
      });
}



function dateIsToday(customDateStr) {

    if (customDateStr == null) {
        console.log("No date stored.")
        return false
    }

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;  // JavaScript months are 0-based
    const currentYear = today.getFullYear();


    const storedDay = parseInt(customDateStr.match(/(\d+)D/)[1], 10);
    const storedMonth = parseInt(customDateStr.match(/(\d+)M/)[1], 10);
    const storedYear = parseInt(customDateStr.match(/(\d+)Y/)[1], 10);

    if (currentDay === storedDay && currentMonth === storedMonth && currentYear === storedYear) {
        console.log("Today's date matches the stored date!");
        return true
    } else {
        console.log("The dates do not match.");
        return false
    }
}

// generate date string from timestamp
function generateDateStringFromTimestamp(timestamp) {
    const today = new Date(timestamp);

    // Extract the day, month, and year
    const day = today.getDate();
    const month = today.getMonth() + 1;  // JavaScript months are 0-based
    const year = today.getFullYear();

    // padStart ensures that the month and day values are always two digits long
    // e.g. 1 becomes 01, 2 becomes 02, etc.

    let _date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    return _date
}

// get last challenge date from the contract, bypassed for now for demo purposes
function getlastChallengeDate(challenge_type) {

    // fetch from the contract hardcoded for now
    
    return "18D10M2023Y";
}

document.getElementById('connect-metamask').addEventListener('click', connectMetaMaskWallet);

// event listerner for challenge completion buttons
const challenge_completion_buttons = document.querySelectorAll(".challenge-completion-btn")
challenge_completion_buttons.forEach((button) => {
    button.addEventListener('click', async () => {
        
       
        let username = get_username()
        let challengetype = button.getAttribute('data-challenge-type')
        let last_submitted = getlastChallengeDate(challengetype)

        let isEnrolled = await isEnrolledInChallenge(provider, username, challengeMapping[challengetype])
        if (!isEnrolled) {
            
            notification("You can not submit to this challenge. You need to be enrolled  first!")
        }
        else if (dateIsToday(last_submitted)) {
            await notification("You have already submitted your data for today.")
            
        }
        else {

            renderSubmitChallengeModal(username, challengetype, last_submitted)

           
        }
    
    })
});

// event listerner for enroll buttons
const enroll_buttons = document.querySelectorAll(".enroll-btn")
enroll_buttons.forEach((button) => {
    button.addEventListener('click', async () => {

        let username = await get_username()
        console.log(username, "username")   
        let challengetype = button.getAttribute('data-challenge-type');
        console.log(challengetype, "challengetype")
        challengetype = challengeMapping[challengetype]
        console.log(challengetype, "challengetype")

        try {
            console.log(provider, "provider")
            let isEnrolled = await isEnrolledInChallenge(provider, username, challengetype)
            console.log(isEnrolled, "isEnrolled")
            if (isEnrolled) {
                await notification("You are already enrolled in this challenge.")
            }
            else {

                await enrollInChallenge(signer, username, challengetype)
                await notification("You have been enrolled in this challenge.")
            }
        }
        catch (error) {
            console.log(error)
        }
    })
})

function getScopes() {  
    return SCOPES
}

// handle the redirect when fitbit sends the user back to the app
async function onFitbitOAUTHRedirect(username, cid=null) {

    let auth = await getAuthToken()
    let state = getFitbitCredentials().state
    let challenge_type = getFitbitCredentials().challenge_type
    let store_data = getFitbitCredentials().store_data
    let mnemonic = getFitbitCredentials().mnemonic
    console.log(auth, "auth")
    // auth = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1I4WkwiLCJzdWIiOiJCUVZIWDMiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcndlaSBybnV0IHJwcm8gcnNsZSIsImV4cCI6MTY5Nzg3MjAyMSwiaWF0IjoxNjk3ODQzMjIxfQ.9PQk4mg2F1-O_n8jHQwa4xNWCdMT-hFfyGdqQcxmgiA"
    
    try {
        let fitness_data = await sendTriggerToServerToStoreChallengesData(state, auth, challenge_type)
        notification("Challenge data has been verified and submitted.", true, 5000)

    }
    catch (error) {
        console.log(error)
        notification("There was an error fetching your data from Fitbit. Please try again.", true, 5000)
    }


    if (store_data) {
        saveNewFitnessData(fitness_data, mnemonic, username, cid)
    }

}

// send the message to server to make it get, verify and save the challenge confirmation to the contract
async function sendTriggerToServerToStoreChallengesData(state, access_token, challenge_type) {
    console.log("sendTriggerToServerToStoreChallengesData")
    console.log(state, access_token, challenge_type)


    let scopes = getScopes()
    let username = await get_username()
    let user_data = await getUserDetails(provider, username)
    console.log(user_data, "user_data in send trigger")
    let contract_address = vigour_hall_address
    let abi = vigour_hall_abi

    let startdate
    let enddate

    let tier;
    for (let challenge of user_data.challenges) {
        if (challenge.challengeType === challengeMapping[challenge_type]) {
            tier = challenge.tier1 ? 1 : challenge.tier2 ? 2 : challenge.tier3 ? 3 : 0
            startdate = challenge.lastSubmissionDate

        }

    }

    console.log(startdate, "startdate")

    console.log(user_data.challenges, "challenges alright")

    if (startdate === 0){
        startdate = generateDateStringFromTimestamp(Date.now())
    } else {
        startdate = generateDateStringFromTimestamp(startdate)
    }

    enddate = generateDateStringFromTimestamp(Date.now())
    
    let enrolled_challenges = [{type:challenge_type, tier, start_duration:startdate, end_duration:enddate}]


    const data = { state, access_token, scopes, username, contract_address, abi, enrolled_challenges };
    console.log(access_token, "access_token")
    console.log(enrolled_challenges, "enrolled_challenges")

    let response = await fetch('http://localhost:5000/fetch_and_submit_to_contract', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })

    if (response.status != 200) {
        throw new Error("There was an error fetching your data from Fitbit. Please try again.")
    }

    const response_json = await response.json()
    console.log(response_json, "response_json")

    return response_json["fitness_data"];
}


// handle metamask connection
async function onClickConnect() {
    console.log("onClickConnect triggered.")
    // exit();
    try {
        let accounts = await ethereum.request({ method: 'eth_requestAccounts', params: [] });
        current_address = accounts[0];
        console.log(current_address);
    }
    catch (error) {
        console.error(error);
    }
  
    console.log("You are connected to MetaMask.");
    closeBanner()
      
    const chainId = await ethereum.request({
        method: "eth_chainId",
    });

    // else if (name === "rinkeby" && chainId === 4) { await notification("You are currently on the rinkeby test network", false) }
    // else {
    //     await notification("Currently not on the supported schain, Dapp functionality will not work as expected", false)
    // }
}

async function getAuthToken() {
    const { state, code_verifier } = getFitbitCredentials();
    console.log("getAuthAndProceed");
    console.log(state, code_verifier);
    const { access_token, refresh_token, scope, user_id } = await get_access_token(window.location.href, code_verifier);
    console.log(access_token, refresh_token, scope, user_id);
    console.log("stored credentials");
    console.log("calling proceed");
    return access_token
}

async function renderEarningsModal() {
    showModal('earningsModal');

    let username = await get_username()
    let balances = await getChallengeBalances(provider, username)
    console.log(balances, "balances")
    document.getElementById('tier-1-unclaimed').innerHTML = balances.tier1_unpayed
    document.getElementById('tier-2-unclaimed').innerHTML = balances.tier1_unpayed
    document.getElementById('tier-3-unclaimed').innerHTML = balances.tier1_unpayed
    document.getElementById("all-unclaimed").innerHTML = balances.tier1_unpayed + balances.tier2_unpayed + balances.tier3_unpayed;
    document.getElementById('historical-claimed').innerHTML = balances.total_payed_out

    document.getElementById("withdraw-earnings").addEventListener("click", async () => {
        await claimPayment(signer, username)
        notification("Payment Claimed!")
    })

    listen_for_close_modal()
}

function renderProfileModal() {
    // placeholder here at the moment. It should allow a user to download thier fitness data
    showModal('profileModal');
    
    document.querySelector("#profileModal > div.scroll-container.scroll-container--profile-modal > div.scroll-content > div.mt-8 > button").addEventListener('click', async () => {
        downloadFitnessData("bafkreibwvoyhpgja2cszgdhq2uf575lztf6rcponia3pzodmhowizygaem", "tom")
    })


    listen_for_close_modal()
}

// confirmation for render submit,
// if yes generates a redirect url and redirects to fitbit and then stores relevant information
function renderSubmitChallengeModal(username, challengetype, last_submitted) {
    showModal('submitChallengeModal');

        // Reference to elements
    const saveDataCheckbox = document.getElementById("saveData");
    const passphraseBox = document.getElementById("passphraseBox");

    // // Event listener for checkbox
    saveDataCheckbox.addEventListener("change", function (event) {
        event.preventDefault();
        if (this.checked) {
        passphraseBox.classList.remove("hidden");
        } else {
        passphraseBox.classList.add("hidden");
        }
    });



    
    const submitChallengeConfirmBtn = document.getElementById('submitChallengeConfirmBtn');
    submitChallengeConfirmBtn.addEventListener('click', async (event) => {
        console.log("come on")
        event.preventDefault();
        let scopes = getScopes()

        let user_details = await getUserDetails(provider, username)

        if (saveDataCheckbox.checked) {
            let mnemonic_phrase = document.getElementById('passphrase-submit').value
            console.log("checked right?", mnemonic_phrase)
            if (generateUserSecureHash(mnemonic_phrase) != user_details.secure_hash) {
                console.log("passphrase provided is not correct")
                console.log(user_details.secure_hash, generateUserSecureHash(mnemonic_phrase), "passphrase provided")

                await notification("The mnemonic phrase inputted is invalid", false, 5000)
            }
            else {
                console.log("passphrase provided")
                let { url, code_verifier, state } = await generate_auth_url(scopes);
                console.log("fitbit button clicked")
                console.log(url, "auth url")
                await notification("⌛ Loading Fitbit authorization page...");

                setTimeout(function () {
                    window.location.href = url;
                }, 1100);

                console.log(saveDataCheckbox.checked, "saveDataCheckbox.checked")
                storeFitbitCredentials(state, code_verifier, null, challengetype, saveDataCheckbox.checked, mnemonic_phrase);

            }
        
        }
        else {
            let { url, code_verifier, state } = await generate_auth_url(scopes);
            console.log("fitbit button clicked")
            console.log(url, "auth url")
            await notification("⌛ Loading Fitbit authorization page...");

            setTimeout(function () {
                window.location.href = url;
            }, 1100);

            console.log(saveDataCheckbox.checked, "saveDataCheckbox.checked")

            storeFitbitCredentials(state, code_verifier, null, challengetype, saveDataCheckbox.checked);
        }
        })
    
    listen_for_close_modal()
}


function renderUserModal(option) {
    if (option === "login") {
        let modal_body = auth_modal("login")
        let modal = document.getElementById('userModalHolder');
        modal.innerHTML = modal_body;

        document.getElementById('switch-to-signup-btn').addEventListener('click', async () => { 
            renderUserModal("signup");
        })

        document.getElementById('login-submit-btn').addEventListener('click', async (event) => {
            event.preventDefault();
            let username = document.getElementById('username-input').value;
            await login(provider, username, current_address)
            hideModal('userModal')
        })

    }

    if (option === "signup") {
        const phrase = generate_mnemonic();

        const generatePhrase = (event) => {
            // Generate a mock phrase. You can replace this with actual logic.
        
            // Hide the generate button
            event.preventDefault();
            document.getElementById('generateBtn').classList.add('hidden');
        
            // Display the phrase and copy/download button
            document.getElementById('phrase').textContent = phrase;
            document.getElementById('phraseContainer').classList.remove('hidden');

            notification("Please copy your phrase and store it somewhere safe. You will need it to recover/reassociate your account.")
        }

        const copyPhrase = (event) =>  {
            // Get the generated phrase text
            const phraseText = document.getElementById('phrase').textContent;
        
            document.getElementById('submitContainer').classList.remove('hidden');
        
            // Hide the phrase and copy/download button
            document.getElementById('phraseContainer').classList.add('hidden');          
            navigator.clipboard.writeText(phrase);
            notification("Make sure to store your passphrase somewhere safe. You will need it to recover/reassociate your account and store your submissions.", false)
        }

        
        let modal_body = auth_modal("signup")
        let modal = document.getElementById('userModalHolder');
        modal.innerHTML = modal_body;

        document.getElementById('switch-to-login-btn').addEventListener('click', async () => {
            renderUserModal("login");
        })

        document.getElementById('generateBtn').addEventListener('click', async (event) => generatePhrase(event));
        document.getElementById('copyBtn').addEventListener('click', async (event) => copyPhrase(event));

        document.getElementById('sign-up-btn').addEventListener('click', async (event) => {
            event.preventDefault();
            let username = document.getElementById('username-input').value;
            let phrasetext = document.getElementById('phraseInput').value;
            
            if (phrase != phrasetext) {
                console.log("phrase is not correct")
            }
            else {
                await signup(provider, signer, username)
                notificationOff()
                hideModal('userModal')
            }
        })
                    
    }

    if (option === "reassociate") {
        let modal_body = other_user_actions_modal("reassociate")
        let modal = document.getElementById('userModalHolder');
        console.log(modal_body, "reassociate")
        modal.innerHTML = modal_body;

        document.getElementById('reassociate-btn').addEventListener('click', async (event) => {
            event.preventDefault();
            let address = document.getElementById('new-address').value;
            let mnemonic = document.getElementById('mnemonic').value;

            reassociate_user(address, mnemonic)
            hideModal('userModal')
        })

    }
    showModal('userModal');
    listen_for_close_modal()
}

function renderNavBar(isLoggedIn) {
        
    let authnav =  document.getElementById('auth-nav')
    
    if (isLoggedIn) {

        let main_auth = `
        <img src="./assets/v_yes.png" alt="Settings" class="w-6 h-6">
        <span class="hidden group-hover:block absolute text-[#8B4513] bg-white rounded px-1 py-0.5 text-xs">Settings</span>
       `

        // Hide login button
        const useractions =`
        <div class="hidden group-hover:block absolute w-48 bg-white text-[#8B4513] rounded mt-1">
            <a href="#" id="reassociate" class="block px-4 py-2 sec-nav-item" data-user-action="reassociate" data-modal-target="userModal">Reassociate Address</a>
            <a href="#" id="logout" class="block px-4 py-2" data-user-action="logout">Logout</a>\
        </div>
        `
        authnav.innerHTML = main_auth + useractions;
        
    }
    else {
        // Hide the other nav items
        const other_navitems = document.querySelectorAll('.pri-nav-item ');
        other_navitems.forEach((navitem) => {
            navitem.classList.toggle("hidden")
        });


        let main_auth = `
        <a href="#" class="pri-nav-item group" data-modal-target="userModal">
        <img src="./assets/v_yes.png" alt="Login/Signup" class="w-6 h-6 pri-nav-item" data-user-action=auth data-modal-target="userModal">
        <span class="hidden group-hover:block absolute text-[#8B4513] bg-white rounded px-1 py-0.5 text-xs">Login / Sign up</span>
        </a>
        `
        authnav.innerHTML = main_auth;
        
    }
}

// function onLoadAuthEventHandlers(isLoggedIn) {
//     if (isLoggedIn) {
//         document.getElementById('reassociate').addEventListener('click', async () => {
//             console.log("reassociate")
//             renderUserModal("reassociate");
//         });
//         document.getElementById('logout').addEventListener('click', async () => {
//             console.log("logout")
//             logout();
//         });
//     }
//     else {
//         document.getElementById('auth-nav').addEventListener('click', async () => {
//             console.log("login")
//             renderUserModal("auth")
//         });
       
//     }
    
// }


window.addEventListener("load", async () => {
    // console.log("window loaded")
    console.log("window loaded")
    // await notification("⌛ Loading...");
    await connectMetaMaskWallet();
    console.log(provider, "provider")
    let isconnect = await isAccountConnected()


    let users = await getUsers(provider)
    console.log(current_address, "current address")
    console.log(users, "users")


    let username = get_username()
    let details = await getUserDetails(provider, username)
    console.log(details, "details")

    let cid = details.storage_cid
    console.log(cid, "cid")

    console.log("fitness data")

    // downloadFitnessData(cid, "tom")

    console.log(window.location.href, "window location")
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    console.log(url.searchParams, params.get("code"), "url")
    if (params.get("code")) {
        const code = params.get('code');
        const state = params.get('state');
        console.log(code, state)

        onFitbitOAUTHRedirect(username, cid=cid)

    }
 
    // await notification("Yeahh")

    let logged_in = await isLoggedIn(false)
    // logged_in = false
    renderNavBar(logged_in)
    console.log(logged_in, "logged in") 
    if (!logged_in) {
        console.log("not logged in")
        // toggleBanner()
    }
    else {
        toggleBanner()
        if (isAccountConnected()) {
            console.log("connected")
            toggleBanner()
        }    
    }

});


