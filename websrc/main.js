// import timely_tasks_artefacts from '../out/tasks.sol/Tasks.json'
import { notification, notificationOff, format_to_wei, convertIterableToMap, delay } from "./utils";
import { logout, isLoggedIn, generate_mnemonic } from "./user";
import { auth_modal, other_user_actions_modal } from "./components";
import { generate_auth_url, get_access_token, SCOPES } from "./fitbit";

console.log(generate_mnemonic())
const login = async (username) => {
    console.log(username, "login")
}

const signup = async (username) => {
    console.log(username, "signup")

}

const reassociate_user = async (username, new_address) => {
    console.log(username, new_address, "reassociate_user")
}   


const ethers = require("ethers")
import { MetaMaskSDK } from '@metamask/sdk';

import './styles.css';

console.log("I am not crazy")

const MMSDK = new MetaMaskSDK();
console.log(MMSDK)
await MMSDK.init()
ethereum = MMSDK.getProvider(); // You can also access via window.ethereum

console.log("Sdk issues?", ethereum)
let signer;
let provider;
let current_address;
let contract;

async function isAccountConnected() {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts, "accounts")
    if (accounts.length !== 0) {
        return true;
    }
    return false;
}


function toggleBanner() {
    document.getElementById('intro-banner').classList.toggle("hidden");
    document.getElementById('main-content').classList.toggle('hidden');
}

const connectMetaMaskWallet = async function () {
    if (ethereum.isMetaMask) {

        if (isAccountConnected()) {
            await notification(" Connected to Metamask...");
            toggleBanner()
        }
        
        else {
            await notification("⚠️ Please approve this DApp to use it.")
            try {
                let accounts = await ethereum.request({ method: 'eth_requestAccounts', params: [] });
                current_address = accounts[0];
                console.log(current_address);
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
    }
});

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

const enroll_buttons = document.querySelectorAll(".enroll-btn")
console.log(enroll_buttons, "enroll buttons")
enroll_buttons.forEach((button) => {
    button.addEventListener('click', function () {
        console.log("enroll button clicked")
        const userResponse = confirm("Would you like to join this guild");

        if (userResponse) {
            console.log("User clicked OK");
        } else {
            console.log("User clicked Cancel or closed the dialog");
        }

    })
})



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

function generateDateString() {
    const today = new Date();

    // Extract the day, month, and year
    const day = today.getDate();
    const month = today.getMonth() + 1;  // JavaScript months are 0-based
    const year = today.getFullYear();

    let _date = `${day}D${month}M${year}Y`;
    return _date
}

function getlastChallengeDate() {

    // fetch from the contract hardcoded for now
    
    return "18D10M2023Y";
}

document.getElementById('connect-metamask').addEventListener('click', connectMetaMaskWallet);

document.getElementById('fitbit-btn').addEventListener('click', async () => {

    let last_submitted = getlastChallengeDate()

    if (!dateIsToday(last_submitted)) {
        
        let scopes = getScopes()
        let { url, code_verifier, state } = await generate_auth_url(scopes);
        console.log("fitbit button clicked")
        console.log(url, "auth url")
        console.log("why twice")
        await notification("⌛ Loading Fitbit authorization page...");

        setTimeout(function () {
            window.location.href = url;
        }, 2000);

        storeFitbitCredentials(state, code_verifier, null, "")
        // read message and execute the actual function
    }
    else {
        await notification("You have already submitted your data for today.")
    }
    
});

function storeFitbitCredentials(state = null, code_verifier = null, access_token = null, method = "", last_submitted = null) {
    const storeddata = { state, code_verifier, access_token, method, last_submitted };
    localStorage.setItem("fitbit_info", JSON.stringify(storeddata));
}

function getFitbitCredentials() { 
    const storeddata = localStorage.getItem("fitbit_info");
    console.log(storeddata, "stored data")
    return JSON.parse(storeddata);
}

function getScopes() {  
    return SCOPES
}

async function sendTriggerToServerToStoreChallengesData(state, access_token, code_verifier) {
    console.log("sendTriggerToServerToStoreChallengesData")
    console.log(state, access_token, code_verifier)
    let scopes = getScopes()
    const data = { state, access_token, code_verifier, scopes };
    let response = fetch('/fitbit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    const response_json = await response.json();
    console.log(response_json)
}



// https://thompsonmina.github.io/VigourHall/?code=5cfc20ffaa7215d4e179d8a7a4335ac6699627f3&state=qByQ5R8CCmnNjTVZSDOg7Q#_=_

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

async function getAuthAndProceed() {
    const { state, code_verifier } = getFitbitCredentials();
    console.log("getAuthAndProceed");
    console.log(state, code_verifier);
    const { access_token, refresh_token, scope, user_id } = await get_access_token(window.location.href, code_verifier);
    console.log(access_token, refresh_token, scope, user_id);
    console.log("stored credentials");
    console.log("calling proceed");
    return access_token
    // await proceed();
}

function renderEarningsModal() {
    showModal('earningsModal');
    listen_for_close_modal()
}

function renderProfileModal() {
    showModal('profileModal');
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
            await login(username)
            hideModal('userModal')
        })

    }

    if (option === "signup") {
        const phrase = generate_mnemonic();

        const generatePhrase = () => {
            // Generate a mock phrase. You can replace this with actual logic.
        
            // Hide the generate button
            document.getElementById('generateBtn').classList.add('hidden');
        
            // Display the phrase and copy/download button
            document.getElementById('phrase').textContent = phrase;
            document.getElementById('phraseContainer').classList.remove('hidden');

            notification("Please copy your phrase and store it somewhere safe. You will need it to recover/reassociate your account.")
        }

        const copyPhrase = () =>  {
            // Get the generated phrase text
            const phraseText = document.getElementById('phrase').textContent;
        
            document.getElementById('submitContainer').classList.remove('hidden');
        
            // Hide the phrase and copy/download button
            document.getElementById('phraseContainer').classList.add('hidden');          
            navigator.clipboard.writeText(phrase);
        }

        
        let modal_body = auth_modal("signup")
        let modal = document.getElementById('userModalHolder');
        modal.innerHTML = modal_body;

        document.getElementById('switch-to-login-btn').addEventListener('click', async () => {
            renderUserModal("login");
        })

        document.getElementById('generateBtn').addEventListener('click', generatePhrase);
        document.getElementById('copyBtn').addEventListener('click', copyPhrase);

        document.getElementById('sign-up-btn').addEventListener('click', async (event) => {
            event.preventDefault();
            let username = document.getElementById('username-input').value;
            let phrasetext = document.getElementById('phraseInput').value;
            
            if (phrase != phrasetext) {
                console.log("phrase is not correct")
            }
            else {
                await signup(username)
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
    // await connectMetaMaskWallet();
    let isconnect = await isAccountConnected()
    console.log(window.location.href, "window location")
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    console.log(url.searchParams, params.get("cod"), "url")
    if (params.get("code")) {
        const code = params.get('code');
        const state = params.get('state');
        console.log(code, state)

        let auth = await getAuthAndProceed()
        console.log(auth, "auth")

        
    }
 
    await notification("Yeahh")

    let logged_in = await isLoggedIn(true)
    renderNavBar(logged_in)
    console.log(logged_in, "logged in") 
    if (!logged_in) {
        console.log("not logged in")
        toggleBanner()
    }
    else {
        toggleBanner()
        if (isAccountConnected()) {
            console.log("connected")
            toggleBanner()
        }    
    }

    

});


function hideModal(id) {
    const body = document.querySelector("body")
    body.classList.toggle("overflow-hidden");

    const modal = document.getElementById(id);
    if (! modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
    }
}
  
function showModal(id) {
    const body = document.querySelector("body")
    console.log(body)
    body.classList.toggle("overflow-hidden");

    const modal = document.getElementById(id);
    console.log(modal, "modal")
    modal.classList.remove('hidden');
    
}
