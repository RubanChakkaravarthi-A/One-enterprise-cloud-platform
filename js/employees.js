const employees = [
{
id:101,
name:"Arun Kumar",
department:"Development",
designation:"Software Engineer",
status:"Active",
photo:"https://i.pravatar.cc/150?img=11"
},
{
id:102,
name:"Priya Sharma",
department:"HR",
designation:"HR Executive",
status:"Active",
photo:"https://i.pravatar.cc/150?img=32"
},
{
id:103,
name:"Rahul Verma",
department:"Finance",
designation:"Finance Manager",
status:"Inactive",
photo:"https://i.pravatar.cc/150?img=15"
},
{
id:104,
name:"Sneha Iyer",
department:"CRM",
designation:"CRM Executive",
status:"Active",
photo:"https://i.pravatar.cc/150?img=24"
},
{
id:105,
name:"Karthik Raj",
department:"Development",
designation:"Frontend Developer",
status:"Active",
photo:"https://i.pravatar.cc/150?img=18"
},
{
id:106,
name:"Divya Nair",
department:"HR",
designation:"Recruiter",
status:"Inactive",
photo:"https://i.pravatar.cc/150?img=41"
},
{
id:107,
name:"Vignesh Kumar",
department:"Finance",
designation:"Accountant",
status:"Active",
photo:"https://i.pravatar.cc/150?img=52"
},
{
id:108,
name:"Meena Joseph",
department:"CRM",
designation:"Customer Success",
status:"Active",
photo:"https://i.pravatar.cc/150?img=48"
},
{
id:109,
name:"Ajith Kumar",
department:"Development",
designation:"Backend Developer",
status:"Active",
photo:"https://i.pravatar.cc/150?img=66"
},
{
id:110,
name:"Anitha R",
department:"HR",
designation:"HR Manager",
status:"Active",
photo:"https://i.pravatar.cc/150?img=35"
}
];

const employeeGrid = document.getElementById("employeeGrid");
const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");

function displayEmployees(data){

employeeGrid.innerHTML = "";

data.forEach(employee=>{

employeeGrid.innerHTML += `

<div class="employee-card">

<img src="${employee.photo}" alt="${employee.name}">

<h3>${employee.name}</h3>

<p><strong>ID :</strong> ${employee.id}</p>

<p><strong>Department :</strong> ${employee.department}</p>

<p><strong>Designation :</strong> ${employee.designation}</p>

<span class="status ${employee.status.toLowerCase()}">
${employee.status}
</span>

</div>

`;

});

}

displayEmployees(employees);

function filterEmployees(){

const keyword = searchInput.value.toLowerCase();

const department = departmentFilter.value;

const filtered = employees.filter(employee=>{

const matchName =
employee.name.toLowerCase().includes(keyword);

const matchDepartment =
department==="All" ||
employee.department===department;

return matchName && matchDepartment;

});

displayEmployees(filtered);

}

searchInput.addEventListener("keyup",filterEmployees);

departmentFilter.addEventListener("change",filterEmployees);