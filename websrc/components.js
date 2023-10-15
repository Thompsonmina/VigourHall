


const auth_modal = (option) => {

    if (option === "login") {
        let body = `
        
        <form>
        <div class="mb-4">
        <label for="username" class="block text-[#8B4513] mb-2">Username</label>
        <input type="text" id="username-input" name="username" class="w-full max-w-lg p-2 rounded border border-[#8B4513]">
        </div>
        
        <button id="login-submit-btn" type="submit" class="bg-[#8B4513] text-white px-4 py-2 rounded hover:bg-[#FFD700]">
            Log in
        </button>
        
        </form>
        <div>
            Don't have an account?
            <button id="switch-to-signup-btn" type="submit" class="bg-[#8B4513] text-white px-4 py-2 rounded hover:bg-[#FFD700]">
                Sign up
            </button>
        </div>
        `
    }
    else if (option == 'signup') {
        let body = `
        <form>
        <div class="mb-4">
        <label for="username" class="block text-[#8B4513] mb-2">Username</label>
        <input type="text" id="username" name="username" class="w-full max-w-lg p-2 rounded border border-[#8B4513]">
        </div>
        <div class="mb-4">
        <label for="password" class="block text-[#8B4513] mb-2">Password</label>
        <input type="password" id="password" name="password" class="w-full max-w-lg p-2 rounded border border-[#8B4513]">
        </div>
        <button id="sign-up-btn" type="submit" class="bg-[#8B4513] text-white px-4 py-2 rounded hover:bg-[#FFD700]">
        Log in
        </button>
        
        </form>
        <div>
            Already have an account?
            <button id="switch-to-login-btn" type="submit" class="bg-[#8B4513] text-white px-4 py-2 rounded hover:bg-[#FFD700]">
                Log in
            </button>
        </div>
    }
    `

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
}