// import timely_tasks_artefacts from '../out/tasks.sol/Tasks.json'
import { notification, notificationOff, format_to_wei, convertIterableToMap, delay } from "./utils";
import { logout, isLoggedIn, generate_mnemonic} from "./user";
import { auth_modal } from "./components";
import { generate_auth_url, get_access_token, SCOPES } from "./fitbit";

console.log(generate_mnemonic())
const login = async (username) => {
    console.log("login")
}

const signup = async (username) => {
    console.log("signup")
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
        console.log(modalId, "modalId")
        if (modalId === "userModal") {
            console.log("userModal?")
            renderUserModal();
        }
    }
});

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

document.getElementById('connect-metamask').addEventListener('click', connectMetaMaskWallet);
// document.getElementById('fitbit-btn').addEventListener('click', async () => {

//     let { url, code_verifier, state } = await generate_auth_url(SCOPES);
//     console.log("fitbit button clicked")
//     console.log(url, "auth url")
//     console.log("why twice")
//     await notification("⌛ Loading Fitbit authorization page...");

//     setTimeout(function() {
//         window.location.href = url;
//     }, 2000);

//     storeFitbitCredentials(state, code_verifier, null, "")
//     // read message and execute the actual function

// }
// );

function storeFitbitCredentials(state = null, code_verifier = null, access_token = null, method = "") {

    const storeddata = { state, code_verifier, access_token, method };
    localStorage.setItem("fitbit_info", JSON.stringify(storeddata));
}

function getFitbitCredentials() { 
    const storeddata = localStorage.getItem("fitbit_info");
    return JSON.parse(storeddata);
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
    console.log("getAuthAndProceed")
    console.log(state, code_verifier)
    const { access_token, refresh_token, scope, user_id } = await get_access_token(window.location.href, code_verifier);
    console.log(access_token, refresh_token, scope, user_id)
    storeFitbitCredentials(state, code_verifier, access_token, "fitbit");
    console.log("stored credentials")
    console.log("calling proceed")
    await proceed();


}

function renderEarningsModal() {
    showModal('earningsModal');
}

function renderProfileModal() {
    showModal('profileModal');
}

function renderUserModal(option) {
    if (option === "login") {
        let modal_body = auth_modal("login")
        let modal = document.getElementById('userModalHolder');
        modal.innerHTML = modal_body;

        document.getElementById('switch-to-signup-btn').addEventListener('click', async () => { 
            renderUserModal("signup");
        })

        document.getElementById('login-submit-btn').addEventListener('click', async () => {
            
            let username = document.getElementById('username-input').value;
            await login(username)
        })


    
    }

    if (option === "signup") {
        let modal_body = auth_modal("signup")
        let modal = document.getElementById('userModalHolder');
        modal.innerHTML = modal_body;

        document.getElementById('switch-to-login-btn').addEventListener('click', async () => {
            renderUserModal("login");
        })

        document.getElementById('sign-up-btn').addEventListener('click', async () => {
            let username = document.getElementById('username-input').value;
            await signup(username)
        })
            
    }
    showModal('userModal');
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

function onLoadAuthEventHandlers(isLoggedIn) {
    if (isLoggedIn) {
        document.getElementById('reassociate').addEventListener('click', async () => {
            console.log("reassociate")
            renderUserModal("reassociate");
        });
        document.getElementById('logout').addEventListener('click', async () => {
            console.log("logout")
            logout();
        });
    }
    else {
        document.getElementById('auth-nav').addEventListener('click', async () => {
            console.log("login")
            renderUserModal("auth")
        });
       
    }
    
}

function onSigninModalEventHandlers() {
    document.getElementById()
}

window.addEventListener("load", async () => {
    // console.log("window loaded")
    console.log("window loaded")
    // await notification("⌛ Loading...");
    // await connectMetaMaskWallet();
    let isconnect = await isAccountConnected()
    const url = new URL(window.location.href);

    if ("code" in url.searchParams) {
        const params = new URLSearchParams(url.search);
        const code = params.get('code');
        const state = params.get('state');
        console.log(code, state)


    }
    await notification("Yeahh")

    let logged_in = await isLoggedIn(false)
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
