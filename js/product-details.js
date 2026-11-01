
// Display selected product details
async function displayProductDetails() {

    const container = document.getElementById("product-details-container");

    // Get product ID from URL
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));

    if (!productId) {
        container.innerHTML = "<p>Product not found.</p>";
        return;
    }

    // Get Admin products from localStorage
    const adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];

    // Check whether the product belongs to Admin
    let product = adminProducts.find(item => item.id === productId);

    // If not an Admin product, fetch from API
    if (!product) {
        try {
            const response = await fetch(
                `https://fakestoreapi.com/products/${productId}`
            );

            if (!response.ok) {
                throw new Error("Product not found");
            }

            product = await response.json();

        } catch (error) {
            container.innerHTML = "<p>Unable to load product details.</p>";
            console.error(error);
            return;
        }
    }

    // Display product details
    container.innerHTML = `
        <div class="product-detail-card">

            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.title || product.name}">
            </div>

            <div class="product-detail-info">

                <h2>${product.title || product.name}</h2>

                <p class="price">$${product.price}</p>

                <p>⭐ ${product.rating ? product.rating.rate : "N/A"}</p>

                <p class="product-description">
                    ${product.description || "No description available."}
                </p>

                <button class="product-btn" id="add-to-cart-btn">
                    Add to Cart
                </button>

            </div>

        </div>
    `;

    // Add to Cart
    document.getElementById("add-to-cart-btn")
        .addEventListener("click", () => {
            addToCart(product);
        });
}


// Add product to cart
function addToCart(product) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productTitle = product.title || product.name;

    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            id: product.id,
            title: productTitle,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart!");
}


// Load product details
document.addEventListener("DOMContentLoaded", () => {
    displayProductDetails();
});
