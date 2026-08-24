// ==========================================
// IVAN SMART CONNECT
// SUPABASE AUTH + USER PROFILES
// ==========================================

const SUPABASE_URL =
    "https://zzphccvryvjaonkoonil.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_BPZ5Cukc3D6ilo6e0_m1Aw_sN5FBK2D";


// ==========================================
// HTML ELEMENTS
// ==========================================

const debugConsole =
    document.getElementById("debugConsole");

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
// DEBUG
// ==========================================

function debug(message) {

    console.log(message);

    if (debugConsole) {

        const time =
            new Date().toLocaleTimeString();

        debugConsole.innerHTML +=
            `\n[${time}] ${message}`;

        debugConsole.scrollTop =
            debugConsole.scrollHeight;
    }
}


// ==========================================
// SUPABASE
// ==========================================

debug("Starting Ivan Smart Connect...");

let supabaseClient = null;

try {

    if (!window.supabase) {

        throw new Error(
            "Supabase library was not loaded."
        );
    }

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    debug(
        "Supabase client created successfully."
    );

    status.textContent =
        "Supabase connected.";

} catch (error) {

    debug(
        "SUPABASE ERROR: " +
        error.message
    );

    status.textContent =
        "Supabase connection failed.";
}


// ==========================================
// LOGIN
// ==========================================

loginBtn.addEventListener(
    "click",
    async function () {

        debug("Login button clicked.");

        loginMessage.textContent = "";

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email) {

            loginMessage.textContent =
                "Please enter your email.";

            return;
        }


        if (!password) {

            loginMessage.textContent =
                "Please enter your password.";

            return;
        }


        if (!supabaseClient) {

            debug(
                "Supabase client unavailable."
            );

            return;
        }


        loginBtn.disabled = true;

        loginBtn.textContent =
            "Logging in...";


        debug(
            "Attempting login for: " +
            email
        );


        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signInWithPassword({

                        email: email,

                        password: password

                    });


            if (error) {

                debug(
                    "LOGIN ERROR: " +
                    error.message
                );

                loginMessage.textContent =
                    error.message;

                return;
            }


            debug(
                "LOGIN SUCCESSFUL!"
            );


            if (data.user) {

                debug(
                    "Logged in as: " +
                    data.user.email
                );

                await loadUserProfile(
                    data.user
                );

            }


        } catch (error) {

            debug(
                "LOGIN EXCEPTION: " +
                error.message
            );

            loginMessage.textContent =
                error.message;

        } finally {

            loginBtn.disabled = false;

            loginBtn.textContent =
                "Login";
        }

    }
);


// ==========================================
// LOAD USER PROFILE
// ==========================================

async function loadUserProfile(user) {

    debug(
        "Loading user profile..."
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();


        if (error) {

            debug(
                "PROFILE ERROR: " +
                error.message
            );

            loginMessage.textContent =
                "Login successful, but profile could not be loaded.";

            return;
        }


        debug(
            "Profile loaded successfully."
        );

        debug(
            "Name: " +
            (data.full_name || "Not set")
        );

        debug(
            "Role: " +
            (data.role || "Not set")
        );


        showUserProfile(
            user,
            data
        );

    } catch (error) {

        debug(
            "PROFILE EXCEPTION: " +
            error.message
        );

    }

}


// ==========================================
// DISPLAY PROFILE
// ==========================================

function showUserProfile(user, profile) {

    loginSection.style.display =
        "none";

    userSection.style.display =
        "block";

    userEmail.textContent =
        profile.email || user.email;

    status.textContent =
        "Welcome, " +
        (profile.full_name || "User") +
        "!";

    // Add name and role to user section

    const existingProfile =
        document.getElementById(
            "profileInfo"
        );

    if (existingProfile) {

        existingProfile.remove();

    }


    const profileInfo =
        document.createElement("div");

    profileInfo.id =
        "profileInfo";

    profileInfo.innerHTML = `
        <p>
            <strong>Name:</strong>
            ${profile.full_name || "Not set"}
        </p>

        <p>
            <strong>Role:</strong>
            ${profile.role || "Not set"}
        </p>
    `;


    userSection.insertBefore(
        profileInfo,
        logoutBtn
    );


    debug(
        "User dashboard loaded."
    );

}


// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener(
    "click",
    async function () {

        debug(
            "Logout button clicked."
        );


        try {

            const { error } =
                await supabaseClient.auth
                    .signOut();


            if (error) {

                debug(
                    "LOGOUT ERROR: " +
                    error.message
                );

                return;
            }


            debug(
                "Logout successful."
            );

            showLoggedOutUser();

        } catch (error) {

            debug(
                "LOGOUT EXCEPTION: " +
                error.message
            );

        }

    }
);


// ==========================================
// LOGGED OUT STATE
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
// CHECK SESSION
// ==========================================

async function checkSession() {

    debug(
        "Checking existing session..."
    );


    if (!supabaseClient) {

        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .getSession();


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

            await loadUserProfile(
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
            "SESSION EXCEPTION: " +
            error.message
        );

    }

}


// ==========================================
// AUTH STATE
// ==========================================

if (supabaseClient) {

    supabaseClient.auth.onAuthStateChange(
        function (event, session) {

            debug(
                "Auth event: " +
                event
            );

        }
    );

}


// ==========================================
// CLEAR DEBUG CONSOLE
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
// START
// ==========================================

debug(
    "app.js loaded successfully."
);

checkSession();
