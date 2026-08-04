const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const storedUsername = localStorage.getItem("username");
const storedPassword = localStorage.getItem("password");
    console.log("Stored Username:", storedUsername);
    console.log("Stored Password:", storedPassword);

if (username === storedUsername && password === storedPassword) {
        message.style.color = "#16a34a";
        message.innerHTML = "✅ Login Successful... Redirecting";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);

    } else {

        message.style.color = "#dc2626";
        message.innerHTML = "❌ Invalid Employee ID or Password";

        document.getElementById("password").value = "";
        document.getElementById("password").focus();
    }

});