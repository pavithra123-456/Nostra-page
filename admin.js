const STORAGE_KEY = "nostra_extra_products";
const VALID_CATEGORIES = ["bags", "footwear", "accessories", "apparel"];

const jsonInput = document.getElementById("jsonInput");
const addAllBtn = document.getElementById("addAllBtn");
const clearStorageBtn = document.getElementById("clearStorageBtn");
const loadSample = document.getElementById("loadSample");
const statusMsg = document.getElementById("statusMsg");
const storedCount = document.getElementById("storedCount");
const previewList = document.getElementById("previewList");
const previewItems = document.getElementById("previewItems");

function getExtraProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveExtraProducts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function showStatus(message, type) {
  statusMsg.textContent = message;
  statusMsg.className = "mt-4 text-sm " + (type === "error" ? "text-red-600" : "text-[#6E7B5C]");
  statusMsg.classList.remove("hidden");
}

function updateStoredCount() {
  const list = getExtraProducts();
  storedCount.textContent = list.length;

  if (list.length > 0) {
    previewList.classList.remove("hidden");
    previewItems.innerHTML = list.slice(-5).reverse().map(p =>
      `<li class="flex justify-between border-b border-black/10 pb-1.5">
         <span>${p.name}</span>
         <span class="text-[#8A8578]">₹${Number(p.price).toLocaleString("en-IN")}</span>
       </li>`
    ).join("");
  } else {
    previewList.classList.add("hidden");
  }
}

function validateProduct(p, index) {
  if (!p.name || typeof p.name !== "string") return `Item ${index + 1}: missing "name"`;
  if (!VALID_CATEGORIES.includes(p.category)) return `Item ${index + 1}: "category" must be one of ${VALID_CATEGORIES.join(", ")}`;
  if (typeof p.price !== "number" || p.price <= 0) return `Item ${index + 1}: "price" must be a positive number`;
  if (!p.img || typeof p.img !== "string") return `Item ${index + 1}: missing "img" URL`;
  return null;
}

addAllBtn.addEventListener("click", () => {
  const raw = jsonInput.value.trim();
  if (!raw) {
    showStatus("Please paste a JSON array of products first.", "error");
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    showStatus("Invalid JSON — check for missing commas or brackets.", "error");
    return;
  }

  if (!Array.isArray(parsed)) {
    showStatus("JSON must be an array, e.g. [ {...}, {...} ]", "error");
    return;
  }

  for (let i = 0; i < parsed.length; i++) {
    const err = validateProduct(parsed[i], i);
    if (err) {
      showStatus(err, "error");
      return;
    }
  }

  const existing = getExtraProducts();
  let nextId = 1000 + existing.length;
  const withIds = parsed.map(p => ({ ...p, id: nextId++ }));
  const updated = [...existing, ...withIds];
  saveExtraProducts(updated);

  showStatus(`✓ Added ${parsed.length} product${parsed.length > 1 ? "s" : ""} to the shop.`, "success");
  jsonInput.value = "";
  updateStoredCount();
});

clearStorageBtn.addEventListener("click", () => {
  if (confirm("Remove all admin-added products? Base products stay untouched.")) {
    localStorage.removeItem(STORAGE_KEY);
    showStatus("Cleared all admin-added products.", "success");
    updateStoredCount();
  }
});

loadSample.addEventListener("click", () => {
  const sample = [
    { name: "Woven Card Holder", category: "accessories", price: 999, img: "./image/image1.ipg" },
    { name: "Chukka Boots", category: "footwear", price: 4199, img: "https://picsum.photos/seed/chukkaboots/500/650" },
    { name: "Linen Overshirt", category: "apparel", price: 2199, img: "https://picsum.photos/seed/overshirt/500/650" },
    { name: "Weekender Duffel", category: "bags", price: 3899, img: "https://picsum.photos/seed/duffelbag/500/650" }
  ];
  jsonInput.value = JSON.stringify(sample, null, 2);
});

updateStoredCount();