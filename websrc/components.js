


const auth_modal = (option) => {
    var body = "empty"
    console.log(option)

    if (option === "login") {
        console.log("login, yeah")

        body = `
        
        <form>
        <div class="mb-4">
        <label for="username" class="block text-[#8B4513] mb-2">Username</label>
        <input type="text" id="username-input" name="username" class="w-full max-w-lg p-2 rounded border text-black border-[#8B4513]">
        </div>
        
        <button id="login-submit-btn"  class="bg-[#8B4513] text-white px-4 py-2 rounded hover:bg-[#FFD700]">
            Log in
        </button>
        
        </form>
        <div>
            Don't have an account?
            <a id="switch-to-signup-btn" class=" text-white px-4 py-2 rounded hover:bg-[#FFD700]" style="text-decoration: underline;">
                Sign up
            </a>
        </div>
        `
    }

    if (option == 'signup') {
        body = `
        <form>
        <div class="mb-4">
        <label for="username" class="block text-[#8B4513] mb-2">Username</label>
        <input type="text" id="username-input"  class="w-full max-w-lg p-2 rounded border text-black border-[#8B4513]">
        </div>
        <button id="generateBtn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Generate Phrase
    </button>

    <!-- Display Phrase & Copy/Download Button -->
    <div id="phraseContainer" class="hidden mt-5">
        <p id="phrase" class="mb-4"></p>
        <button id="copyBtn" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Copy Phrase
        </button>
    </div>

    <!-- Textarea & Submit Phrase Button -->
        <div id="submitContainer" class="hidden mt-5">
            <label for="phrase" class="block text-[#8B4513] mb-2">Mnemonic Phrase</label>
            <textarea id="phraseInput" class="w-full p-3 border rounded text-black"></textarea>
            <button id="sign-up-btn" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
                Create Account
            </button>
        </div>
        
        </form>
        <div>
            Already have an account?
            <a id="switch-to-login-btn"  class="text-white px-4 py-2 rounded hover:bg-[#FFD700]" style="text-decoration: underline;">
                Log in
            </a>
        </div>
        `
    }

    console.log(body, "body")
    return `
    
    <div class="absolute flex hidden justify-center items-center z-10 w-screen top-0 bottom-0 left-0 right-0" id="userModal" >
    <div class="bg-black opacity-50 h-full w-full" ></div>


    <div class="bg-[#D2B48C] scroll-container rounded-lg h-min w-1/2 p-8 absolute" >
    <div class="scroll-rod top-rod"></div>
    <h2 class="text-2xl font-semibold mb-4">User Management</h2>
    <button class="text-2xl font-bold modal-close-btn">&times;</button>

    ${body}
    
    <div class="scroll-rod bottom-rod"></div>
    </div>
    `
}

const other_user_actions_modal = (option) => {
    let body = "empty"
    let header = "empty"
    if (option === "reassociate") {
        body = `
        <form>
        <div class="mb-4">
        <label class="block text-[#8B4513] mb-2">New Address</label>
        <input type="text" id="new-address" name="new-address" class="w-full max-w-lg text-black p-2 rounded border border-[#8B4513]">
        </div>
        <div class="mb-4">
        <label for="recovery phrase" class="block text-[#8B4513] mb-2">12 word recovery phrase</label>
        <textarea type="textarea" id="mnemonic" name="mnemonic" class="w-full max-w-lg p-2 text-black rounded border border-[#8B4513]"></textarea>
        </div>
        <button id="reassociate-btn" class="bg-[#8B4513] text-white px-4 py-2 rounded hover:bg-[#FFD700]">
        Reassociate Address
        </button>
        
        </form>        `

        header = "Reassociate with a different address"
    } 

    console.log(body, "body")
    return `
    
    <div class="absolute flex hidden justify-center items-center z-10 w-screen top-0 bottom-0 left-0 right-0" id="userModal" >
    <div class="bg-black opacity-50 h-full w-full" ></div>


    <div class="bg-[#D2B48C] scroll-container rounded-lg h-min w-1/2 p-8 absolute" >
    <div class="scroll-rod top-rod"></div>
    <h2 class="text-2xl font-semibold mb-4">${header}</h2>
    <button class="text-2xl font-bold modal-close-btn">&times;</button>

    ${body}
    
    <div class="scroll-rod bottom-rod"></div>
    </div>
    `
}

export {auth_modal, other_user_actions_modal}