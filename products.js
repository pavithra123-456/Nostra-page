// ---- Product data ----
// Base products (always present)
const baseProducts = [
  { id: 1, name: "Classic Tote Bag", category: "bags", price: 2499, img: "./image/image7.jpg" },
  { id: 2, name: "Leather Sneakers", category: "footwear", price: 3299, img: "./image/image14.jpg" },
  { id: 3, name: "Minimal Wrist Watch", category: "accessories", price: 4599, img: "./image/image4.jpg" },
  { id: 4, name: "Oversized Hoodie", category: "apparel", price: 1899, img: "./image/image9.jpg" },
  { id: 5, name: "Canvas Backpack", category: "bags", price: 2899, img: "./image/image10.jpg" },
  { id: 6, name: "Suede Loafers", category: "footwear", price: 3799, img: "./image/image.jpg" },
  { id: 7, name: "Silk Scarf", category: "accessories", price: 1299, img: "./image/image11.jpg" },
  { id: 8, name: "Denim Jacket", category: "apparel", price: 3499, img: "./image/image12.jpg" },
  { id: 9, name: "Mini Crossbody Bag", category: "bags", price: 1999, img: "./image/image13.jpg" },
];

// Products added via admin.html live here (localStorage)
const STORAGE_KEY = "nostra_extra_products";

function getExtraProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// Final list shown on the shop page = base + admin-added
const products = [...baseProducts, ...getExtraProducts()];

let activeCategory = "all";
let activeSort = "default";
let cartCount = 0;

const productGrid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const cartCountEl = document.getElementById("cartCount");
const sortSelect = document.getElementById("sortSelect");
const filterButtons = document.querySelectorAll(".filter-btn");

function renderProducts() {
  let filtered = activeCategory === "all"
    ? [...products]
    : products.filter(p => p.category === activeCategory);

  if (activeSort === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (activeSort === "high-low") filtered.sort((a, b) => b.price - a.price);

  productGrid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    resultCount.textContent = "0 products found";
    return;
  }

  emptyState.classList.add("hidden");
  resultCount.textContent = `Showing ${filtered.length} product${filtered.length > 1 ? "s" : ""}`;

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "group cursor-pointer";
    card.innerHTML = `
      <div class="relative overflow-hidden rounded-sm bg-black/5 ">
        <img src="${product.img}" alt="${product.name}" loading="lazy"
             onerror="this.onerror=null;this.src='https://picsum.photos/seed/${product.id}/500/650'"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <button data-id="${product.id}"
                class="add-to-cart absolute bottom-2 right-2 bg-[#F3EFE7] text-black text-xs font-medium px-3 py-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
          Add +
        </button>
      </div>
      <div class="mt-3">
        <h3 class="text-sm font-medium">${product.name}</h3>
        <p class="text-sm text-[#8A8578] mt-0.5">₹${product.price.toLocaleString("en-IN")}</p>
      </div>
    `;
    productGrid.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      cartCount++;
      cartCountEl.textContent = cartCount;
    });
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("bg-black", "text-white"));
    btn.classList.add("bg-black", "text-white");
    activeCategory = btn.dataset.category;
    renderProducts();
  });
});

sortSelect.addEventListener("change", (e) => {
  activeSort = e.target.value;
  renderProducts();
});

function clearFilters() {
  activeCategory = "all";
  activeSort = "default";
  sortSelect.value = "default";
  filterButtons.forEach(b => b.classList.remove("bg-black", "text-white"));
  filterButtons[0].classList.add("bg-black", "text-white");
  renderProducts();
}
document.getElementById("clearFilters").addEventListener("click", clearFilters);
document.getElementById("clearFiltersDesktop").addEventListener("click", clearFilters);

filterButtons[0].classList.add("bg-black", "text-white");
renderProducts();