
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart in localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Display cart items
function displayCart() {

    const container = document.getElementById("cart-container");

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    container.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        const subtotal = item.price * item.quantity;
        total += subtotal;

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">

            <h3>${item.title}</h3>

            <p class="price">$${item.price}</p>

            <div>
                <button data-action="decrease" data-id="${item.id}">−</button>

                <span>${item.quantity}</span>

                <button data-action="increase" data-id="${item.id}">+</button>
            </div>

            <p>Subtotal: $${subtotal.toFixed(2)}</p>

            <button data-action="remove" data-id="${item.id}">
                Remove
            </button>
        `;

        container.appendChild(card);
    });

    // Display total
    const totalElement = document.createElement("h2");
    totalElement.textContent = `Total: $${total.toFixed(2)}`;

    container.appendChild(totalElement);

    // Checkout button
    const checkoutButton = document.createElement("button");

    checkoutButton.textContent = "Proceed to Checkout";
    checkoutButton.id = "checkout-btn";

    container.appendChild(checkoutButton);

    // Checkout functionality
    checkoutButton.addEventListener("click", function () {

        const loggedInUser = JSON.parse(
            localStorage.getItem("loggedInUser")
        );

        if (!loggedInUser) {
            alert("Please login before placing an order!");
            window.location.href = "login.html";
            return;
        }

        // Generate unique order ID
        const orderId = "ORD" + Date.now();

        // Get existing orders
        let orders = JSON.parse(
            localStorage.getItem("orders")
        ) || [];

        // Create new order
        const newOrder = {
            id: orderId,
            name: loggedInUser.name,
            email: loggedInUser.email,

            products: cart.map(item => ({
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            })),

            total: cart.reduce(
                (sum, item) => sum + item.price * item.quantity, 0
            ),

            date: new Date().toLocaleString(),
            status: "Order Placed"
        };

        // Save order
        orders.push(newOrder);

        localStorage.setItem("orders", JSON.stringify(orders));

        // Clear cart
        cart = [];
        saveCart();
        displayCart();

        // Show confirmation
        alert(
            "Order placed successfully!\n\nYour Order ID: " + orderId
        );

    });

}

// Handle cart button clicks
document.getElementById("cart-container").addEventListener("click", function(event) {

    const action = event.target.dataset.action;
    const id = Number(event.target.dataset.id);

    if (!action) return;

    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") {
        item.quantity++;
    }

    else if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== id);
        }
    }

    else if (action === "remove") {
        cart = cart.filter(product => product.id !== id);
    }

    saveCart();
    displayCart();
});

// Load cart when page opens
document.addEventListener("DOMContentLoaded", () => {
    displayCart();
});
