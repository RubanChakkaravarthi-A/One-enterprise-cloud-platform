// Get Existing Data From LocalStorage

let employees = JSON.parse(
    localStorage.getItem("employees")
) || [];


let attendance = JSON.parse(
    localStorage.getItem("attendance")
) || [];


let leaveRequests = JSON.parse(
    localStorage.getItem("leaveRequests")
) || [];




// Total Employees

document.getElementById("totalEmployees").innerText =
employees.length;




// Present Today Count

let presentCount = attendance.filter(
    item => item.status === "Present"
).length;


document.getElementById("presentToday").innerText =
presentCount;





// Employees On Leave

let onLeave = leaveRequests.filter(
    leave => leave.status === "Approved"
).length;


document.getElementById("employeesLeave").innerText =
onLeave;






// Pending Leave Requests

let pendingLeave = leaveRequests.filter(
    leave => leave.status === "Pending"
).length;


document.getElementById("pendingLeaves").innerText =
pendingLeave;






// Department Count

let departments = [
    ...new Set(
        employees.map(emp=>emp.department)
    )
];


document.getElementById("totalDepartments").innerText =
departments.length;






// Active Employees

let activeEmployees = employees.filter(
    emp=>emp.status==="Active"
).length;


document.getElementById("activeEmployees").innerText =
activeEmployees;







// Recent Activities Table


let activityTable =
document.getElementById("activityTable");



function loadActivities(){


    activityTable.innerHTML="";


    // Latest Employees

    employees.slice(-3).reverse().forEach(emp=>{


        let row=document.createElement("tr");


        row.innerHTML=`

        <td>Employee Added</td>

        <td>
        ${emp.name}
        (${emp.id})
        </td>

        <td>
        Recent
        </td>

        `;


        activityTable.appendChild(row);


    });





    // Latest Leave Requests


    leaveRequests.slice(-3).reverse().forEach(leave=>{


        let row=document.createElement("tr");


        row.innerHTML=`

        <td>Leave Request</td>

        <td>
        ${leave.employeeName}
        - ${leave.leaveType}
        </td>

        <td>
${leave.fromDate}
</td>

        `;


        activityTable.appendChild(row);



    });

    // Latest Attendance Updates

attendance.slice(-3).reverse().forEach(att=>{


    let employee = employees.find(
        emp => emp.id === att.id
    );


    if(employee){


        let row = document.createElement("tr");


        row.innerHTML = `

        <td>
        Attendance
        </td>


        <td>
        ${employee.name} - ${att.status}
        </td>


        <td>
        ${att.date}
        </td>


        `;


        activityTable.appendChild(row);


    }


});



}



loadActivities();