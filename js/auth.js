
// REGISTER FUNCTIONALITY

const registerForm = document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            alert("Email already registered!");
            return;
        }

        users.push({
            name: name,
            email: email,
            password: password
        });

        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful!");

        window.location.href = "login.html";
    });
}


// LOGIN FUNCTIONALITY

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const validUser = users.find(user =>
            user.email === email && user.password === password
        );

        if (validUser) {

            localStorage.setItem("loggedInUser", JSON.stringify({
                name: validUser.name,
                email: validUser.email
            }));

            alert("Login successful!");

            window.location.href = "index.html";

        } else {

            alert("Invalid email or password!");
        }
    });
}

// PROFILE AND LOGOUT FUNCTIONALITY

document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelector(".nav-links");

    if (!navLinks) return;

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (loggedInUser) {

        // Hide Login link
        const loginLink = navLinks.querySelector('a[href="login.html"]');
        if (loginLink) loginLink.remove();

        // Hide Register link if available
        const registerLink = navLinks.querySelector('a[href="register.html"]');
        if (registerLink) registerLink.remove();

        // Create Profile dropdown
        const profileContainer = document.createElement("div");
        profileContainer.className = "profile-container";

      profileContainer.innerHTML = `
    <button id="profile-btn">
        Hi, ${loggedInUser.name} ▼
    </button>

    <div id="profile-menu" class="profile-menu">
        <p><strong>${loggedInUser.name}</strong></p>
        <p>${loggedInUser.email}</p>

        <a href="orders.html" class="profile-link">
            My Orders
        </a>

        <button id="logout-btn">Logout</button>
    </div>
`;

        navLinks.appendChild(profileContainer);

        // Show / hide profile menu
        document.getElementById("profile-btn")
            .addEventListener("click", function () {
                document.getElementById("profile-menu")
                    .classList.toggle("show");
            });

        // Logout
        document.getElementById("logout-btn")
            .addEventListener("click", function () {
                localStorage.removeItem("loggedInUser");
                alert("Logged out successfully!");
                window.location.href = "index.html";
            });

    }
});