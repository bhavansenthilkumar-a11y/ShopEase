
function displayOrders() {

    const container = document.getElementById("orders-container");

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (!loggedInUser) {
        container.innerHTML = "<p>Please login to view your orders.</p>";
        return;
    }

    const allOrders = JSON.parse(
        localStorage.getItem("orders")
    ) || [];

    const userOrders = allOrders.filter(
        order => order.email === loggedInUser.email
    );

    if (userOrders.length === 0) {
        container.innerHTML = "<p>You haven't placed any orders yet.</p>";
        return;
    }

    container.innerHTML = "";

    // Display each order
    userOrders.forEach(order => {

        const card = document.createElement("div");
        card.className = "order-card";

        let productDetails = "";

        order.products.forEach(item => {

            productDetails += `
                <div class="order-product">

                    <img src="${item.image}" alt="${item.title}">

                    <div>
                        <h4>${item.title}</h4>
                        <p>Price: $${item.price.toFixed(2)}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                </div>
            `;
        });

        card.innerHTML = `
            <h3>Order ID: ${order.id}</h3>

            <p>Date: ${order.date}</p>

            <p>Status: ${order.status}</p>

            <hr>

            <h3>Ordered Products</h3>

            ${productDetails}

            <hr>

            <h3>Total: $${order.total.toFixed(2)}</h3>

            ${
                order.status !== "Cancelled"
                ? `<button class="cancel-order-btn" data-id="${order.id}">
                    Cancel Order
                   </button>`
                : `<p class="cancelled-message">This order has been cancelled.</p>`
            }
        `;

        container.appendChild(card);
    });
}

// Handle Cancel Order
document.getElementById("orders-container")
    .addEventListener("click", function(event) {

        if (!event.target.classList.contains("cancel-order-btn")) {
            return;
        }

        const orderId = event.target.dataset.id;

        const confirmCancel = confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmCancel) return;

        let allOrders = JSON.parse(
            localStorage.getItem("orders")
        ) || [];

        allOrders = allOrders.map(order => {

            if (order.id === orderId) {
                order.status = "Cancelled";
            }

            return order;
        });

        localStorage.setItem("orders", JSON.stringify(allOrders));

        alert("Order cancelled successfully!");

        displayOrders();
    });

document.addEventListener("DOMContentLoaded", displayOrders);
