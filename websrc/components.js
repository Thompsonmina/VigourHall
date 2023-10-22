const auth_modal = (option) => {
    var body = "empty";
    console.log(option);
  
    if (option === "login") {
      console.log("login, yeah");
  
      body = `
            
            <form>
            <div class="mb-4">
            <label for="username" class="block text-[#8B4513] mb-2">Username</label>
            <input type="text" id="username-input" name="username" class="w-full max-w-lg p-2 border-b-2 border-[#8B4513] bg-transparent">
            </div>
            
            <button
                  id="login-submit-btn"
                  type="button"
                  class="bg-[#b57445] hover:bg-[#a56537] text-white px-4 py-2 rounded duration-300 mt-6 font-medium"
              >
              Log in
              </button>
            
            </form>
  
            <div class="mt-4">
                Don't have an account?
                <a id="switch-to-signup-btn" class="py-2 underline cursor-pointer hover:text-bold">
                    Sign up
                </a>
            </div>
            `;
    }
  
    if (option == "signup") {
      body = `
            <form>
            <div class="mb-4">
            <label for="username" class="block text-[#8B4513] mb-2">Username</label>
            <input type="text" id="username-input" name="username-input" class="w-full max-w-lg p-2 border-b-2 border-[#8B4513] bg-transparent">
            </div>
              <button
                  id="generateBtn"
                  type="button"
                  class="bg-[#b57445] hover:bg-[#a56537] text-white px-4 py-2 rounded duration-300 mt-6 font-medium"
              >
              Generate Phrase
              </button>
    
        <!-- Display Phrase & Copy/Download Button -->
        <div id="phraseContainer" class="hidden mt-5">
            <p id="phrase" class="mb-4"></p>
            <button
            id="copyBtn"
            type="button"
            class="bg-[#b57445] hover:bg-[#a56537] text-white px-4 py-2 rounded duration-300 mt-6 font-medium"
        >   
            Copy/Download Phrase
            </button>
        </div>
    
        <!-- Textarea & Submit Phrase Button -->
            <div id="submitContainer" class="hidden mt-5">
                <label for="phrase" class="block text-[#8B4513] mb-2">PassPhrase</label>
                <textarea id="phraseInput" class="w-full p-3 border-b-2 border-[#8B4513] bg-transparent"></textarea>
                <button
                id="sign-up-btn"
                type="button"
                class="bg-[#b57445] hover:bg-[#a56537] text-white px-4 py-2 rounded duration-300 mt-6 font-medium"
            >  
                Create Account
                </button>
            </div>
            
            </form>
            <div class="mt-4">
                Already have an account?
                <a id="switch-to-login-btn" class="py-2 rounded !text-red-100 underline cursor-pointer hover:text-bold">
                    Log in
                </a>
            </div>
            `;
    }
  
    return `
        <div class="absolute flex hidden justify-center items-center z-10 w-screen top-0 bottom-0 left-0 right-0" id="userModal" >
            <div class="bg-black opacity-50 h-full w-full absolute"></div>
    
            <div class="scroll-container">
              <div class="scroll-bar">
                  <div class="scroll-bar--rect-short"></div>
                  <div class="scroll-bar--rect-long"></div>
              </div>
      
              <div class="scroll-content">
                  <h2 class="text-2xl font-semibold mb-4 text-[#8B4513]">User Management</h2>
                  <button class="text-3xl font-bold modal-close-btn text-[#8B4513]">&times;</button>
          
                  ${body}
              </div>
              
              <div class="scroll-bar">
                  <div class="scroll-bar--rect-short"></div>
                  <div class="scroll-bar--rect-long"></div>
              </div>  
            </div>
        </div>`;
  };
  
  const other_user_actions_modal = (option) => {
    let body = "empty";
    let header = "empty";
    if (option === "reassociate") {
      body = `
            <form>
            <div class="mb-4">
            <label class="block text-[#8B4513] mb-2">New Address</label>
            <input type="text" id="new-address" name="new-address" class="w-full max-w-lg p-2 border-b-2 border-[#8B4513] bg-transparent">
            </div>
            <div class="mb-4">
            <label for="recovery phrase" class="block text-[#8B4513] mb-2">12 word recovery phrase</label>
            <textarea type="textarea" id="mnemonic" name="mnemonic" class="w-full max-w-lg p-2 border-b-2 border-[#8B4513] bg-transparent"></textarea>
            </div>
  
          <button
              id="reassociate-btn" 
              type="button"
              class="bg-[#b57445] hover:bg-[#a56537] text-white px-4 py-2 rounded duration-300 mt-6 font-medium"
          >
            Reassociate address
          </button>
            
            </form>        `;
  
      header = "Reassociate with a different address";
    }
  
    console.log(body, "body");
    return `
        <div class="absolute flex hidden justify-center items-center z-10 w-screen top-0 bottom-0 left-0 right-0" id="userModal" >
            <div class="bg-black opacity-50 h-full w-full absolute"></div>
    
            <div class="scroll-container">
              <div class="scroll-bar">
                  <div class="scroll-bar--rect-short"></div>
                  <div class="scroll-bar--rect-long"></div>
              </div>
      
              <div class="scroll-content">
                  <h2 class="text-2xl font-semibold mb-4 text-[#8B4513]">${header}</h2>
                  <button class="text-3xl font-bold modal-close-btn text-[#8B4513]">&times;</button>
          
                  ${body}
              </div>
              
              <div class="scroll-bar">
                  <div class="scroll-bar--rect-short"></div>
                  <div class="scroll-bar--rect-long"></div>
              </div>  
            </div>
        </div>`;
  };
  
  export { auth_modal, other_user_actions_modal };
  