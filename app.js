const supabaseUrl = "https://zzphccvryvjaonkoonil.supabase.co";

const supabaseKey =
    "sb_publishable_BPZ5Cukc3D6ilo6e0_m1Aw_sN5FBK2D";

const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);


// SIGN UP
async function signup() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    if (!email || !password) {
        message.innerText = "Please enter your email and password.";
        return;
    }

    if (password.length < 6) {
        message.innerText =
            "Password must be at least 6 characters.";
        return;
    }

    message.innerText = "Creating your account...";

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        message.innerText = error.message;
        return;
    }

    if (data.user) {
        message.innerText =
            "Account created successfully! Check your email for confirmation.";
    }
}


// LOGIN
async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    if (!email || !password) {
        message.innerText = "Please enter your email and password.";
        return;
    }

    message.innerText = "Logging in...";

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        message.innerText = error.message;
        return;
    }

    if (data.user) {
        message.innerText =
            "Login successful! Welcome to Ivan Smart Connect.";

        console.log("Logged in user:", data.user);
    }
}


// CHECK CURRENT USER
async function checkUser() {

    const { data, error } =
        await supabase.auth.getUser();

    if (error) {
        console.log("No user logged in.");
        return;
    }

    if (data.user) {
        console.log("Current user:", data.user);
    }
}


// RUN WHEN PAGE LOADS
checkUser();
