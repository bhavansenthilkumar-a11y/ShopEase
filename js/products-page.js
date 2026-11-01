
// Store all products
let allProducts = [];

// Display products
function displayProducts(products) {
    const container = document.getElementById("all-products-container");

    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">

            <h3>${product.title}</h3>

            <p class="price">$${product.price}</p>

            <p>⭐ ${product.rating ? product.rating.rate : "N/A"}</p>

            <button class="product-btn"
                onclick="viewProduct(${product.id})">
                View Product
            </button>
        `;

        container.appendChild(card);
    });
}


// View Product Details
function viewProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}


// Apply Search, Category and Sorting
function applyFilters() {

    const searchInput = document.getElementById("search-input").value.toLowerCase();

    const selectedCategory = document.getElementById("category-filter").value;

    const selectedSort = document.getElementById("sort-filter").value;

    // Search filter
    let filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchInput)
    );

    // Category filter
    if (selectedCategory !== "all") {
        filteredProducts = filteredProducts.filter(product =>
            product.category === selectedCategory
        );
    }

    // Sorting
    if (selectedSort === "low-high") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }
    else if (selectedSort === "high-low") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Display final products
    displayProducts(filteredProducts);
}


// Load Products
async function displayAllProducts() {

    const container = document.getElementById("all-products-container");

    container.innerHTML = "<p>Loading products...</p>";

    // Fetch API products
    const apiProducts = await fetchProducts();

    // Get Admin products from localStorage
    const adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];

    // Convert Admin products into common format
    const formattedAdminProducts = adminProducts.map(product => ({
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: null
    }));

    // Combine both products
    allProducts = [...apiProducts, ...formattedAdminProducts];

    if (allProducts.length === 0) {
        container.innerHTML = "<p>Unable to load products.</p>";
        return;
    }

    // Get category from URL
    const params = new URLSearchParams(window.location.search);

    const selectedCategory = params.get("category");

    const categoryFilter = document.getElementById("category-filter");

    // Set category dropdown
    if (selectedCategory) {
        categoryFilter.value = selectedCategory;
    }

    // Apply all filters
    applyFilters();
}


// Event Listeners
document.getElementById("search-input").addEventListener("input", applyFilters);

document.getElementById("category-filter").addEventListener("change", applyFilters);

document.getElementById("sort-filter").addEventListener("change", applyFilters);


// Page Load
document.addEventListener("DOMContentLoaded", () => {
    displayAllProducts();
});
