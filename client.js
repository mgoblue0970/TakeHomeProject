
let googleToken = null;
// State variable to track if the user is logged in
// problem statement says text should not be written to table w/o login first.
let isLoggedIn = false;

// ###
window.onload = function () {
    google.accounts.id.initialize({
        client_id: '775910835163-2ntugeshn01f14ap7gi9lumasl8o6r4t.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById('loginButton'),
        {
            theme: 'outline',
            size: 'large',
            width: 230
        }
    );

    // Optional: auto prompt for returning users
    google.accounts.id.prompt();
};


async function submitTextbox() {
    if (!isLoggedIn) {
        alert('You must be logged in first!');
        return; // exit if not logged in
    }

    const d = new Date().toLocaleString();
    const r = document.getElementById("textbox").value;
    const s = sanitizeInput(r);

    const row = document.createElement("tr");
    const text = document.createElement("td");
        const date = document.createElement("td");
    date.textContent = d;
    text.textContent = s;

    row.appendChild(text);
    row.appendChild(date);

    // Check the input for a potential token.  Assuming header dot payload dot signature format
    if (s.split('.').length === 3) {
        try {
            //const response = await fetch('http://localhost:3000/verify-jwt', {
            const response = await fetch('http://34.221.120.74:3000/verify-jwt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: s })
            });

            const result = await response.json();
            console.log('JWT verification result:', result);
            if (result.valid) {
                row.classList.add('red-background');
            }
        } catch (err) {
            console.error('Error verifying JWT:', err);
        }
    }

    document.querySelector("#table tbody").appendChild(row);
}

//function googleLogin() {
//    google.accounts.id.initialize({
//        client_id: '775910835163-2ntugeshn01f14ap7gi9lumasl8o6r4t.apps.googleusercontent.com',
//        callback: handleCredentialResponse
//    });
//
//    google.accounts.id.prompt(); // Prompt the login flow
//}

function handleCredentialResponse(response) {
    googleToken = response.credential;

    console.log("Google token received:");

    // Set the state to true since the user has logged in
    isLoggedIn = true;
}

// help prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input; //escapes markup
    return div.innerHTML;
}
