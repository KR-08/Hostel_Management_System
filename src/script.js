// -------- STUDENT REGISTRATION --------
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  let name = document.getElementById('name').value;
  let roll = document.getElementById('roll').value;
  let course = document.getElementById('course').value;

  let students = JSON.parse(localStorage.getItem("students") || "[]");

  if (students.some(s => s.roll === roll)) {
    alert("Roll Number already registered!");
    return;
  }

  students.push({ name, roll, course });
  localStorage.setItem("students", JSON.stringify(students));
  alert("Student registered!");
  this.reset();
});

// -------- RENDER STUDENT TABLE --------
function renderStudents() {
  let students = JSON.parse(localStorage.getItem("students") || "[]");
  let table = document.querySelector("#studentTable tbody");
  if (!table) return;

  table.innerHTML = "";
  students.forEach((s, i) => {
    table.innerHTML += `
      <tr>
        <td contenteditable onblur="editStudent(${i}, 'name', this.textContent)">${s.name}</td>
        <td>${s.roll}</td>
        <td contenteditable onblur="editStudent(${i}, 'course', this.textContent)">${s.course}</td>
        <td><button onclick="deleteStudent(${i})">Delete</button></td>
      </tr>
    `;
  });
}
function editStudent(index, field, value) {
  let students = JSON.parse(localStorage.getItem("students"));
  students[index][field] = value;
  localStorage.setItem("students", JSON.stringify(students));
}
function deleteStudent(index) {
  let students = JSON.parse(localStorage.getItem("students"));
  if (confirm("Are you sure?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderStudents();
  }
}
function exportStudents() {
  let students = JSON.parse(localStorage.getItem("students") || "[]");
  let csv = "Name,Roll,Course\n";
  students.forEach(s => csv += `${s.name},${s.roll},${s.course}\n`);

  let blob = new Blob([csv], { type: 'text/csv' });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "students.csv";
  a.click();
}
document.getElementById("searchInput")?.addEventListener("input", function() {
  let value = this.value.toLowerCase();
  document.querySelectorAll("#studentTable tbody tr").forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
  });
});

// -------- ROOM ALLOCATION --------
document.getElementById('roomForm')?.addEventListener('submit', function(e){
  e.preventDefault();
  let roll = document.getElementById('rollRoom').value;
  let block = document.getElementById('blockSelect').value;
  let room = document.getElementById('roomNo').value;

  let rooms = JSON.parse(localStorage.getItem("rooms") || "[]");

  let existing = rooms.findIndex(r => r.roll === roll);
  if (existing >= 0) rooms.splice(existing, 1); // Replace if already exists

  rooms.push({ roll, block, room });
  localStorage.setItem("rooms", JSON.stringify(rooms));
  alert("Room allocated!");
  this.reset();
});

// -------- RENDER ROOM TABLE --------
function renderAllocations() {
  let rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
  let table = document.querySelector("#allocTable tbody");
  if (!table) return;

  table.innerHTML = "";
  rooms.forEach((r, i) => {
    table.innerHTML += `
      <tr>
        <td>${r.roll}</td>
        <td contenteditable onblur="editAllocation(${i}, 'block', this.textContent)">${r.block}</td>
        <td contenteditable onblur="editAllocation(${i}, 'room', this.textContent)">${r.room}</td>
        <td><button onclick="deleteAllocation(${i})">Delete</button></td>
      </tr>
    `;
  });
}
function editAllocation(index, field, value) {
  let rooms = JSON.parse(localStorage.getItem("rooms"));
  rooms[index][field] = value;
  localStorage.setItem("rooms", JSON.stringify(rooms));
}
function deleteAllocation(index) {
  let rooms = JSON.parse(localStorage.getItem("rooms"));
  if (confirm("Remove allocation?")) {
    rooms.splice(index, 1);
    localStorage.setItem("rooms", JSON.stringify(rooms));
    renderAllocations();
  }
}
document.getElementById("searchAllocInput")?.addEventListener("input", function() {
  let value = this.value.toLowerCase();
  document.querySelectorAll("#allocTable tbody tr").forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
  });
});

// -------- FEE PAYMENT --------
document.getElementById('feeForm')?.addEventListener('submit', function(e){
  e.preventDefault();
  let roll = document.getElementById('rollFee').value;
  let amount = document.getElementById('amount').value;
  let date = new Date().toLocaleDateString();

  let fees = JSON.parse(localStorage.getItem("fees") || "[]");
  fees.push({ roll, amount, date });
  localStorage.setItem("fees", JSON.stringify(fees));
  alert("Fee recorded!");
  this.reset();
});

// -------- RENDER FEES TABLE --------
function renderFees() {
  let fees = JSON.parse(localStorage.getItem("fees") || "[]");
  let table = document.querySelector("#feeTable tbody");
  if (!table) return;

  table.innerHTML = "";
  fees.forEach((f, i) => {
    table.innerHTML += `
      <tr>
        <td>${f.roll}</td>
        <td>₹${f.amount}</td>
        <td>${f.date}</td>
        <td>
          <button onclick="printReceipt('${f.roll}', '${f.amount}', '${f.date}')">Print</button>
          <button onclick="deleteFee(${i})">Delete</button>
        </td>
      </tr>
    `;
  });
}
function deleteFee(index) {
  let fees = JSON.parse(localStorage.getItem("fees"));
  if (confirm("Delete this payment?")) {
    fees.splice(index, 1);
    localStorage.setItem("fees", JSON.stringify(fees));
    renderFees();
  }
}
function printReceipt(roll, amount, date) {
  let receipt = `
    <h3>Hostel Fee Receipt</h3>
    <p><strong>Roll Number:</strong> ${roll}</p>
    <p><strong>Amount Paid:</strong> ₹${amount}</p>
    <p><strong>Date:</strong> ${date}</p>
  `;
  let win = window.open("", "Print Receipt", "width=400,height=400");
  win.document.write(receipt);
  win.print();
  win.close();
}
document.getElementById("searchFeeInput")?.addEventListener("input", function() {
  let value = this.value.toLowerCase();
  document.querySelectorAll("#feeTable tbody tr").forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
  });
});

// -------- LEAVE FORM --------
document.getElementById('leaveForm')?.addEventListener('submit', function(e){
  e.preventDefault();
  let roll = document.getElementById('rollLeave').value;
  let from = document.getElementById('fromDate').value;
  let to = document.getElementById('toDate').value;
  let reason = document.getElementById('reason').value;

  let leaves = JSON.parse(localStorage.getItem("leaves") || "[]");
  leaves.push({ roll, from, to, reason });
  localStorage.setItem("leaves", JSON.stringify(leaves));
  alert("Leave applied!");
  this.reset();
});

// -------- RENDER LEAVE TABLE --------
function renderLeaves() {
  let leaves = JSON.parse(localStorage.getItem("leaves") || "[]");
  let table = document.querySelector("#leaveTable tbody");
  if (!table) return;

  table.innerHTML = "";
  leaves.forEach((l, i) => {
    table.innerHTML += `
      <tr>
        <td>${l.roll}</td>
        <td>${l.from}</td>
        <td>${l.to}</td>
        <td>${l.reason}</td>
        <td><button onclick="deleteLeave(${i})">Delete</button></td>
      </tr>
    `;
  });
}
function deleteLeave(index) {
  let leaves = JSON.parse(localStorage.getItem("leaves"));
  if (confirm("Delete this leave request?")) {
    leaves.splice(index, 1);
    localStorage.setItem("leaves", JSON.stringify(leaves));
    renderLeaves();
  }
}
document.getElementById("searchLeaveInput")?.addEventListener("input", function() {
  let value = this.value.toLowerCase();
  document.querySelectorAll("#leaveTable tbody tr").forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
  });
});

// -------- AUTO LOAD RENDERING --------
window.addEventListener('DOMContentLoaded', function() {
  renderStudents();
  renderAllocations();
  renderFees();
  renderLeaves();
});
