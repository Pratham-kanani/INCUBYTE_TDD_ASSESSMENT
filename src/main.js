import { SweetShop } from './sweetShop.js';

const shop = new SweetShop();

// Default sweets
const defaultSweets = [
  { id: 1001, name: "Kaju Katli", category: "Nut-Based", price: 50, quantity: 20 },
  { id: 1002, name: "Gajar Halwa", category: "Vegetable-Based", price: 30, quantity: 15 },
  { id: 1003, name: "Gulab Jamun", category: "Milk-Based", price: 10, quantity: 50 }
];

// Load from localStorage, or insert defaults
const saved = JSON.parse(localStorage.getItem('sweets') || 'null');
if (saved && Array.isArray(saved)) {
  for (const sweet of saved) {
    try { shop.addSweet(sweet); } catch {}
  }
} else {
  for (const sweet of defaultSweets) {
    shop.addSweet(sweet);
  }
  saveToStorage();
}

// Save to localStorage
function saveToStorage() {
  localStorage.setItem('sweets', JSON.stringify(shop.getAllSweets()));
}

// Expose for browser event handlers
// Add sweet from form
window.addSweet = function () {
  const id = +document.getElementById('id').value;
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const price = +document.getElementById('price').value;
  const quantity = +document.getElementById('quantity').value;

  try {
    shop.addSweet({ id, name, category, price, quantity });
    clearInputs();
    renderSweets();
  } catch (err) {
    alert(err.message);
  }
};

// Delete sweet
window.deleteSweet = function (id) {
  try {
    shop.deleteSweet(id);
    renderSweets();
  } catch (err) {
    alert(err.message);
  }
};

// Purchase sweet
window.purchaseSweet = function (id) {
  const qty = prompt('Enter quantity to purchase:');
  try {
    shop.purchaseSweet(id, +qty);
    renderSweets();
  } catch (err) {
    alert(err.message);
  }
};

// Restock sweet
window.restockSweet = function (id) {
  const qty = prompt('Enter quantity to restock:');
  try {
    shop.restockSweet(id, +qty);
    renderSweets();
  } catch (err) {
    alert(err.message);
  }
};

//Reset the stock
window.resetShop = function () {
  if (confirm("Reset shop data to default sweets? This will erase all current data.")) {
    localStorage.setItem('sweets', JSON.stringify(defaultSweets));
    window.location.reload();
  }
};

// Clear input fields
function clearInputs() {
  ['id', 'name', 'category', 'price', 'quantity'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// Render sweets to table
window.renderSweets = function () {
  const search = document.getElementById('search').value.toLowerCase();
  const sortBy = document.getElementById('sort').value;

  let sweets = shop.getAllSweets();

  // Filter by name
  if (search) {
    sweets = sweets.filter(s => s.name.toLowerCase().includes(search));
  }

  // Sort
  if (sortBy === 'price') {
    sweets = [...sweets].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'name') {
    sweets = [...sweets].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Populate table
  const tbody = document.querySelector('#sweet-table tbody');
  tbody.innerHTML = '';

  for (const s of sweets) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.category}</td>
      <td>${s.price}</td>
      <td>${s.quantity}</td>
      <td class="action-btns">
        <button class="btn btn-delete" onclick="deleteSweet(${s.id})">Delete</button>
        <button class="btn btn-buy" onclick="purchaseSweet(${s.id})">Buy</button>
        <button class="btn btn-restock" onclick="restockSweet(${s.id})">Restock</button>
      </td>
    `;
    tbody.appendChild(row);
  }
};

//Initial render
renderSweets();
