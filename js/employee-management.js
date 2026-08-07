let employees = JSON.parse(localStorage.getItem("employees")) || [];

let editIndex = -1;

const employeeForm = document.getElementById("employeeForm");
const tableBody = document.querySelector("#employeeTable tbody");
const totalEmployees = document.getElementById("totalEmployees");
const submitBtn = document.getElementById("submitBtn");

function renderTable() {

    tableBody.innerHTML = "";

    employees.forEach((employee, index) => {

        tableBody.innerHTML += `

        <tr>

            <td>${employee.id}</td>

            <td>${employee.name}</td>

            <td>${employee.department}</td>

            <td>${employee.designation}</td>

            <td>${employee.email}</td>

            <td>

    <div class="action-buttons">

        <button class="edit-btn" onclick="editEmployee(${index})">
             Edit
        </button>

        <button class="delete-btn" onclick="deleteEmployee(${index})">
             Delete
        </button>

    </div>
</td>

        </tr>

        `;

    });

    totalEmployees.textContent = employees.length;

}

employeeForm.addEventListener("submit", function(e){

    e.preventDefault();

    const employee = {

    id: document.getElementById("empId").value,

    name: document.getElementById("empName").value,

    department: document.getElementById("department").value,

    designation: document.getElementById("designation").value,

    email: document.getElementById("email").value,

    phone: document.getElementById("phone").value,

   joiningDate: document.getElementById("joiningDate").value,

    photo: document.getElementById("photo").value,

    status: document.getElementById("status").value

};

    if(editIndex === -1){

        employees.push(employee);

    }else{

        employees[editIndex] = employee;

        editIndex = -1;

        submitBtn.textContent = "Add Employee";

    }
    
    localStorage.setItem("employees", JSON.stringify(employees));

    renderTable();

    employeeForm.reset();

});

function editEmployee(index){

    editIndex = index;

    document.getElementById("empId").value = employees[index].id;
    document.getElementById("empName").value = employees[index].name;
    document.getElementById("department").value = employees[index].department;
    document.getElementById("designation").value = employees[index].designation;
    document.getElementById("email").value = employees[index].email;
    document.getElementById("phone").value = employees[index].phone || "";
    document.getElementById("joiningDate").value = employees[index].joiningDate || "";
    document.getElementById("photo").value = employees[index].photo;
    document.getElementById("status").value = employees[index].status;

    submitBtn.textContent = "Update Employee";

}

function deleteEmployee(index){

    const confirmDelete = confirm("Are you sure you want to delete this employee?");

    if(confirmDelete){

        employees.splice(index, 1);

        localStorage.setItem("employees", JSON.stringify(employees));

        renderTable();

        if(editIndex === index){

            employeeForm.reset();

            submitBtn.textContent = "Add Employee";

            editIndex = -1;

        }

    }

}
renderTable();