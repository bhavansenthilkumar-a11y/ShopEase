
const API_URL = "https://fakestoreapi.com/products";

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const products = await response.json();
        return products;

    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

// Display featured products
async function displayFeaturedProducts() {
    const container = document.getElementById("product-container");

    container.innerHTML = "<p>Loading products...</p>";

    const products = await fetchProducts();

    if (products.length === 0) {
        container.innerHTML = "<p>Unable to load products.</p>";
        return;
    }

    container.innerHTML = "";

    products.slice(0, 4).forEach(product => {
        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">

            <h3>${product.title}</h3>

            <p class="price">$${product.price}</p>

            <p>⭐ ${product.rating.rate}</p>

            <button class="product-btn"
                onclick="window.location.href='product-details.html?id=${product.id}'">
                View Product
            </button>
        `;

        container.appendChild(card);
    });
}
