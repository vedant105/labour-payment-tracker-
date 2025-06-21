let payments = JSON.parse(localStorage.getItem("labourPayments")) || [];

const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const advanceInput = document.getElementById("advance");
const dateInput = document.getElementById("date");
const tableBody = document.getElementById("paymentBody");
const searchInput = document.getElementById("search");

function savePayments() {
  localStorage.setItem("labourPayments", JSON.stringify(payments));
}

function clearForm() {
  nameInput.value = "";
  amountInput.value = "";
  advanceInput.value = "";
  dateInput.value = "";
}

function addPayment() {
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const advance = parseFloat(advanceInput.value) || 0;
  const date = dateInput.value;

  if (!name || isNaN(amount) || !date) {
    alert("Please enter all required fields correctly.");
    return;
  }

  payments.push({ name, amount, advance, date });
  savePayments();
  clearForm();
  updateAll();
}

function deletePayment(index) {
  payments.splice(index, 1);
  savePayments();
  updateAll();
}

function showPayments(data = payments) {
  tableBody.innerHTML = "";
  data.forEach((p, index) => {
    const row = `
      <tr>
        <td>${p.name}</td>
        <td>₹${p.amount.toFixed(2)}</td>
        <td>₹${p.advance.toFixed(2)}</td>
        <td>${p.date}</td>
        <td><button onclick="deletePayment(${index})">Delete</button></td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

function showSummary() {
  let totalPaid = 0, totalAdvance = 0;

  payments.forEach(p => {
    totalPaid += p.amount;
    totalAdvance += p.advance;
  });

  document.getElementById("totalPaid").textContent = `₹${totalPaid.toFixed(2)}`;
  document.getElementById("totalAdvance").textContent = `₹${totalAdvance.toFixed(2)}`;
  document.getElementById("totalEntries").textContent = payments.length;
}

function updateSummaryTable() {
  const map = {};
  payments.forEach(p => {
    if (!map[p.name]) {
      map[p.name] = { total: 0, advance: 0 };
    }
    map[p.name].total += p.amount;
    map[p.name].advance += p.advance;
  });

  const tbody = document.getElementById("summaryTableBody");
  tbody.innerHTML = "";

  for (let name in map) {
    tbody.innerHTML += `
      <tr>
        <td>${name}</td>
        <td>₹${map[name].total.toFixed(2)}</td>
        <td>₹${map[name].advance.toFixed(2)}</td>
      </tr>
    `;
  }
}

function searchPayments() {
  const query = searchInput.value.toLowerCase();
  const filtered = payments.filter(p => p.name.toLowerCase().includes(query));
  showPayments(filtered);
}

function updateAll() {
  showPayments();
  showSummary();
  updateSummaryTable();
}

window.onload = updateAll;
