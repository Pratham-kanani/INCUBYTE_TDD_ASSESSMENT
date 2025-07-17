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
    saveToStorage();
  } catch (err) {
    alert(err.message);
  }
};

window.deleteSweet = function (id) {
  try {
    shop.deleteSweet(id);
    renderSweets();
    saveToStorage();
  } catch (err) {
    alert(err.message);
  }
};

window.purchaseSweet = function (id) {
  const qty = prompt('Enter quantity to purchase:');
  try {
    shop.purchaseSweet(id, +qty);
    renderSweets();
    saveToStorage();
  } catch (err) {
    alert(err.message);
  }
};

window.restockSweet = function (id) {
  const qty = prompt('Enter quantity to restock:');
  try {
    shop.restockSweet(id, +qty);
    renderSweets();
    saveToStorage();
  } catch (err) {
    alert(err.message);
  }
};

window.resetShop = function () {
  if (confirm("Reset shop data to default sweets? This will erase all current data.")) {
    localStorage.setItem('sweets', JSON.stringify(defaultSweets));
    window.location.reload();
  }
};

function clearInputs() {
  ['id', 'name', 'category', 'price', 'quantity'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function getStatusBadge(quantity) {
  if (quantity === 0) {
    return '<span class="status-badge status-out-of-stock">Out of Stock</span>';
  } else if (quantity < 10) {
    return '<span class="status-badge status-low-stock">Low Stock</span>';
  } else {
    return '<span class="status-badge status-in-stock">In Stock</span>';
  }
}

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
  } else if (sortBy === '-price') {
    sweets = [...sweets].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    sweets = [...sweets].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === '-name') {
    sweets = [...sweets].sort((a, b) => b.name.localeCompare(a.name));
  }

  // Calculate totals
  const totalItems = sweets.reduce((sum, sweet) => sum + sweet.quantity, 0);
  const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
  
  document.getElementById('total-items').textContent = `${totalItems} items`;
  document.getElementById('total-value').textContent = `${totalValue.toFixed(2)} total value`;

  // Populate table
  const tbody = document.querySelector('#sweet-table tbody');
  tbody.innerHTML = '';

  for (const s of sweets) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.category}</td>
      <td>${s.price.toFixed(2)}</td>
      <td>${s.quantity}</td>
      <td>${getStatusBadge(s.quantity)}</td>
      <td class="action-btns">
        <button class="btn btn-delete" onclick="deleteSweet(${s.id})">
          <i class="fas fa-trash-alt"></i> Delete
        </button>
        <button class="btn btn-buy" onclick="purchaseSweet(${s.id})">
          <i class="fas fa-shopping-cart"></i> Buy
        </button>
        <button class="btn btn-restock" onclick="restockSweet(${s.id})">
          <i class="fas fa-boxes"></i> Restock
        </button>
      </td>
    `;
    tbody.appendChild(row);
  }
};

// Initial render
renderSweets();