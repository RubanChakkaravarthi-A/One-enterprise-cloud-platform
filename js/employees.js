const employees = JSON.parse(localStorage.getItem("employees")) || [];

const employeeGrid = document.getElementById("employeeGrid");
const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const designationFilter = document.getElementById("designationFilter");
const statusFilter = document.getElementById("statusFilter");
const sortFilter = document.getElementById("sortFilter");
const resetBtn = document.getElementById("resetBtn");

function displayEmployees(data){

employeeGrid.innerHTML = "";

if(data.length === 0){

    employeeGrid.innerHTML = `

    <div class="no-data">

        <h2>No Employees Found</h2>

        <p>
        Try changing your search or filters
        </p>

    </div>

    `;

    return;

}

data.forEach(employee=>{

employeeGrid.innerHTML += `

<div class="employee-card">

<img src="${employee.photo || 'https://i.pravatar.cc/150'}" 
alt="${employee.name}">

<h3>${employee.name}</h3>

<p><strong>ID :</strong> ${employee.id}</p>

<p><strong>Department :</strong> ${employee.department}</p>

<p><strong>Designation :</strong> ${employee.designation}</p>

<p><strong>Email :</strong> ${employee.email}</p>

<span class="status ${employee.status === 'Active' ? 'active' : 'inactive'}">
${employee.status || 'Inactive'}
</span>

</div>

`;

});

}



displayEmployees(employees);

function filterEmployees(){

const keyword = searchInput.value.toLowerCase();

const department = departmentFilter.value;

const designation = designationFilter.value;

const status = statusFilter.value;


const filtered = employees.filter(employee=>{


const matchSearch =

employee.name.toLowerCase().includes(keyword) ||

employee.id.toString().includes(keyword);



const matchDepartment =

department==="All" ||

employee.department===department;



const matchDesignation =

designation==="All" ||

employee.designation===designation;



const matchStatus =

status==="All" ||

employee.status===status;



return matchSearch &&
matchDepartment &&
matchDesignation &&
matchStatus;


});

const sort = sortFilter.value;


if(sort==="nameAsc"){

    filtered.sort((a,b)=>
        a.name.localeCompare(b.name)
    );

}


if(sort==="nameDesc"){

    filtered.sort((a,b)=>
        b.name.localeCompare(a.name)
    );

}


if(sort==="idAsc"){

    filtered.sort((a,b)=>
        Number(a.id)-Number(b.id)
    );

}


if(sort==="idDesc"){

    filtered.sort((a,b)=>
        Number(b.id)-Number(a.id)
    );

}

displayEmployees(filtered);

}

searchInput.addEventListener("keyup",filterEmployees);

departmentFilter.addEventListener("change",filterEmployees);

designationFilter.addEventListener("change",filterEmployees);

statusFilter.addEventListener("change",filterEmployees);

sortFilter.addEventListener("change",filterEmployees);

resetBtn.addEventListener("click",function(){

    searchInput.value = "";

    departmentFilter.value = "All";

    designationFilter.value = "All";

    statusFilter.value = "All";

    sortFilter.value = "default";


    displayEmployees(employees);

});