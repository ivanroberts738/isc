
// ==========================================
// IVAN SMART CONNECT
// Supabase Authentication
// ==========================================


// ==========================================
// 1. SUPABASE CONFIGURATION
// ==========================================

const supabaseUrl = "https://zzphccvryvjaonkoonil.supabase.co";

const supabaseKey ="sb_publishable_BPZ5Cukc3D6ilo6e0_m1Aw_sN5FBK2D";


// ==========================================
// 2. DEBUG CONSOLE
// ==========================================

const debugConsole = document.getElementById("debugConsole");

function debug(message) {

    console.log(message);

    if (debugConsole) {

        const time = new Date().toLocaleTimeString();

        debugConsole.innerHTML +=
            `\n[${time}] ${message}`;

        debugConsole.scrollTop =
            debugConsole.scrollHeight;
    }
}


// ==========================================
// 3. GET HTML ELEMENTS
// ==========================================

const loginBtn =
    document.getElementById("loginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginMessage =
    document.getElementById("loginMessage");

const status =
    document.getElementById("status");

const loginSection =
    document.getElementById("loginSection");

const userSection =
    document.getElementById("userSection");

const userEmail =
    document.getElementById("userEmail");

const clearDebugBtn =
    document.getElementById("clearDebugBtn");


// ==========================================
// 4. CHECK SUPABASE LIBRARY
// ==========================================

debug("Starting Ivan Smart Connect...");

if (!window.supabase) {

    debug("ERROR: Supabase library was not loaded.");

    status.textContent =
        "Supabase library failed to load.";

} else {

    debug("Supabase library loaded successfully.");

}


// ==========================================
// 5. CREATE SUPABASE CLIENT
// ==========================================

let supabaseClient = null;

try {

    if (
        SUPABASE_URL === "YOUR_SUPABASE_URL" ||
        SUPABASE_KEY === "YOUR_SUPABASE_PUBLISHABLE_KEY"
    ) {

        debug("WARNING: Supabase credentials have not been added.");

    } else {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

        debug("Supabase client created successfully.");

        status.textContent =
            "Supabase connected.";

    }

} catch (error) {

    debug(
        "Supabase initialization error: " +
        error.message
    );

}


// ==========================================
// 6. LOGIN
// ==========================================

loginBtn.addEventListener("click", async function () {

    debug("Login button clicked.");

    loginMessage.textContent = "";

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    // Check email
    if (!email) {

        loginMessage.textContent =
            "Please enter your email.";

        debug("Login stopped: email is empty.");

        return;
    }


    // Check password
    if (!password) {

        loginMessage.textContent =
            "Please enter your password.";

        debug("Login stopped: password is empty.");

        return;
    }


    // Check Supabase
    if (!supabaseClient) {

        loginMessage.textContent =
            "Supabase is not connected.";

        debug(
            "Login stopped: Supabase client unavailable."
        );

        return;
    }


    // Loading state
    loginBtn.disabled = true;

    loginBtn.textContent =
        "Logging in...";

    debug(
        "Attempting login for: " + email
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        // Error
        if (error) {

            debug(
                "LOGIN ERROR: " +
                error.message
            );

            loginMessage.textContent =
                error.message;

            loginBtn.disabled = false;

            loginBtn.textContent =
                "Login";

            return;
        }


        // Success
        debug("Login successful.");

        if (data.user) {

            debug(
                "User ID: " +
                data.user.id
            );

            showLoggedInUser(data.user);

        }

    } catch (error) {

        debug(
            "Unexpected login error: " +
            error.message
        );

        loginMessage.textContent =
            "Something went wrong.";

    }


    loginBtn.disabled = false;

    loginBtn.textContent =
        "Login";

});


// ==========================================
// 7. SHOW LOGGED-IN USER
// ==========================================

function showLoggedInUser(user) {

    loginSection.style.display =
        "none";

    userSection.style.display =
        "block";

    userEmail.textContent =
        user.email || "User";

    status.textContent =
        "You are logged in.";

    debug(
        "Displaying logged-in user."
    );

}


// ==========================================
// 8. LOGOUT
// ==========================================

logoutBtn.addEventListener("click", async function () {

    debug("Logout button clicked.");

    if (!supabaseClient) {

        debug(
            "Logout failed: Supabase client unavailable."
        );

        return;
    }


    try {

        const { error } =
            await supabaseClient.auth.signOut();


        if (error) {

            debug(
                "LOGOUT ERROR: " +
                error.message
            );

            return;
        }


        debug("Logout successful.");

        showLoggedOutUser();

    } catch (error) {

        debug(
            "Unexpected logout error: " +
            error.message
        );

    }

});


// ==========================================
// 9. SHOW LOGGED-OUT STATE
// ==========================================

function showLoggedOutUser() {

    loginSection.style.display =
        "block";

    userSection.style.display =
        "none";

    userEmail.textContent =
        "";

    status.textContent =
        "You are logged out.";

    loginMessage.textContent =
        "";

    passwordInput.value =
        "";

}


// ==========================================
// 10. CHECK EXISTING SESSION
// ==========================================

async function checkSession() {

    debug("Checking existing session...");

    if (!supabaseClient) {

        debug(
            "Session check skipped: Supabase unavailable."
        );

        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            debug(
                "SESSION ERROR: " +
                error.message
            );

            return;
        }


        if (data.session) {

            debug(
                "Existing session found."
            );

            showLoggedInUser(
                data.session.user
            );

        } else {

            debug(
                "No active session found."
            );

            showLoggedOutUser();

        }

    } catch (error) {

        debug(
            "Session check error: " +
            error.message
        );

    }

}


// ==========================================
// 11. LISTEN FOR AUTH CHANGES
// ==========================================

if (supabaseClient) {

    supabaseClient.auth.onAuthStateChange(
        function (event, session) {

            debug(
                "Auth event: " + event
            );


            if (session) {

                showLoggedInUser(
                    session.user
                );

            } else {

                showLoggedOutUser();

            }

        }
    );

}


// ==========================================
// 12. CLEAR DEBUG CONSOLE
// ==========================================

clearDebugBtn.addEventListener(
    "click",
    function () {

        debugConsole.innerHTML =
            "Console cleared.";

        console.clear();

    }
);


// ==========================================
// 13. START APPLICATION
// ==========================================

debug("app.js loaded successfully.");

checkSession();
