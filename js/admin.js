
// Get custom products from localStorage
let adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];

// Save products
function saveProducts() {
    localStorage.setItem("adminProducts", JSON.stringify(adminProducts));
}

// Display products
function displayAdminProducts() {

    const container = document.getElementById("admin-products-container");

    if (adminProducts.length === 0) {
        container.innerHTML = "<p>No products added yet.</p>";
        return;
    }

    container.innerHTML = "";

    adminProducts.forEach(product => {

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p class="price">$${product.price.toFixed(2)}</p>

            <p>Category: ${product.category}</p>

            <p>${product.description}</p>

            <button class="product-btn"
                data-edit="${product.id}">
                Edit Product
            </button>

            <button class="product-btn"
                data-id="${product.id}">
                Delete Product
            </button>
        `;

        container.appendChild(card);
    });
}

// Add or Update Product
const adminForm = document.getElementById("admin-form");

adminForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("product-name").value.trim();
    const price = Number(document.getElementById("product-price").value);
    const category = document.getElementById("product-category").value;
    const image = document.getElementById("product-image").value.trim();
    const description = document.getElementById("product-description").value.trim();

    if (!Number.isFinite(price) || price <= 0) {
        alert("Please enter a valid price.");
        return;
    }

    // Check whether editing an existing product
    const editingId = Number(adminForm.dataset.editingId);

    if (editingId) {

        const product = adminProducts.find(
            item => item.id === editingId
        );

        if (product) {

            product.name = name;
            product.price = price;
            product.category = category;
            product.image = image;
            product.description = description;

        }

        delete adminForm.dataset.editingId;

        alert("Product updated successfully!");

    } else {

        // Create new product
        const newProduct = {
            id: Date.now(),
            name: name,
            price: price,
            category: category,
            image: image,
            description: description
        };

        adminProducts.push(newProduct);

        alert("Product added successfully!");
    }

    saveProducts();

    displayAdminProducts();

    adminForm.reset();

    document.querySelector("#admin-form button[type='submit']")
        .textContent = "Add Product";
});


// Handle Edit and Delete buttons
document.getElementById("admin-products-container")
    .addEventListener("click", function(event) {

        // Edit Product
        if (event.target.dataset.edit) {

            const productId = Number(event.target.dataset.edit);

            const product = adminProducts.find(
                item => item.id === productId
            );

            if (!product) return;

            document.getElementById("product-name").value = product.name;
            document.getElementById("product-price").value = product.price;
            document.getElementById("product-category").value = product.category;
            document.getElementById("product-image").value = product.image;
            document.getElementById("product-description").value = product.description;

            adminForm.dataset.editingId = productId;

            document.querySelector("#admin-form button[type='submit']")
                .textContent = "Update Product";

            adminForm.scrollIntoView({
                behavior: "smooth"
            });

            return;
        }

        // Delete Product
        const productId = Number(event.target.dataset.id);

        if (!productId) return;

        adminProducts = adminProducts.filter(
            product => product.id !== productId
        );

        saveProducts();

        displayAdminProducts();

        alert("Product deleted successfully!");
    });


// Load products when page opens
document.addEventListener("DOMContentLoaded", () => {
    displayAdminProducts();
});
