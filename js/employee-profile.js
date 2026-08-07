// Load Existing Data

let employees = JSON.parse(
    localStorage.getItem("employees")
) || [];


let attendance = JSON.parse(
    localStorage.getItem("attendance")
) || [];


let leaveRequests = JSON.parse(
    localStorage.getItem("leaveRequests")
) || [];




// Elements

const employeeSelect =
document.getElementById("employeeSelect");


const employeeName =
document.getElementById("employeeName");


const employeeId =
document.getElementById("profileId");


const employeeDepartment =
document.getElementById("profileDepartment");


const employeeDesignation =
document.getElementById("employeeDesignation");


const employeeEmail =
document.getElementById("profileEmail");


const employeePhoto =
document.getElementById("employeePhoto");


const employeePhone =
document.getElementById("profilePhone");


const joiningDate =
document.getElementById("profileJoiningDate");



const workingDays =
document.getElementById("workingDays");


const presentDays =
document.getElementById("presentDays");


const leaveDays =
document.getElementById("leaveDays");


const attendancePercentage =
document.getElementById("attendancePercentage");


const leaveHistory =
document.getElementById("leaveHistory");


const casualLeave =
document.getElementById("casualLeave");

const sickLeave =
document.getElementById("sickLeave");

const earnedLeave =
document.getElementById("earnedLeave");

const optionalLeave =
document.getElementById("optionalLeave");

const maternityLeave =
document.getElementById("maternityLeave");




// Load Employees Dropdown


employees.forEach(emp=>{


    let option=document.createElement("option");


    option.value=emp.id;


    option.textContent=
    emp.name + " - " + emp.id;


    employeeSelect.appendChild(option);


});








// Employee Selection


employeeSelect.addEventListener(
"change",
function(){


    let id=this.value;


    if(id===""){

        return;

    }

localStorage.setItem(
    "selectedEmployee",
     id
    );

    loadProfile(id);


});








function loadProfile(id){

   // Refresh latest leave data from localStorage

    leaveRequests = JSON.parse(
        localStorage.getItem("leaveRequests")
    ) || [];

    let employee =
    employees.find(
        emp=>emp.id===id
    );



    if(!employee){

        return;

    }





    // Profile Details


    employeeName.textContent =
    employee.name;


    employeeId.textContent =
    employee.id;


    employeeDepartment.textContent =
    employee.department;


    employeeDesignation.textContent =
    employee.designation;


    employeeEmail.textContent =
    employee.email;



    employeePhone.textContent =
    employee.phone || "Not Available";


    joiningDate.textContent =
    employee.joiningDate || "Not Available";



    employeePhoto.src =
employee.photo || "imgs/default-profile.png";







    // Attendance Report


    let empAttendance =
    attendance.filter(
        att=>att.id===id
    );



    let present =
    empAttendance.filter(
        att=>att.status==="Present"
    ).length;



    let total =
    empAttendance.length;



    let percentage = 0;


    if(total>0){

        percentage =
        ((present/total)*100).toFixed(2);

    }



    workingDays.textContent =
    total;


    presentDays.textContent =
    present;


    attendancePercentage.textContent =
    percentage+"%";








    // Leave History


    let empLeaves =
    leaveRequests.filter(
        leave=>leave.employeeId==id
    );



    leaveHistory.innerHTML="";



    let totalLeaveDays=0;



    empLeaves.forEach(leave=>{


        totalLeaveDays +=
        Number(leave.days);



        leaveHistory.innerHTML += `


        <tr>


        <td>
        ${leave.leaveType}
        </td>


        <td>
        ${leave.fromDate}
        </td>


        <td>
        ${leave.toDate}
        </td>


        <td>
        ${leave.days}
        </td>


        <td>
        ${leave.status}
        </td>


        </tr>


        `;



    });



    leaveDays.textContent =
    totalLeaveDays;


    // Leave Balance


let approvedLeaves =
empLeaves.filter(
    leave=>leave.status==="Approved"
);



let balance = {

    casual:5,
    sick:3,
    earned:7,
    optional:2,
    maternity:0

};



approvedLeaves.forEach(leave=>{


    if(leave.leaveType==="Casual Leave"){

        balance.casual -= Number(leave.days);

    }


    if(leave.leaveType==="Sick Leave"){

        balance.sick -= Number(leave.days);

    }


    if(leave.leaveType==="Earned Leave"){

        balance.earned -= Number(leave.days);

    }


    if(leave.leaveType==="Optional Leave"){

        balance.optional -= Number(leave.days);

    }


    if(leave.leaveType==="Maternity Leave"){

        balance.maternity -= Number(leave.days);

    }


});



casualLeave.textContent =
balance.casual;


sickLeave.textContent =
balance.sick;


earnedLeave.textContent =
balance.earned;


optionalLeave.textContent =
balance.optional;


maternityLeave.textContent =
balance.maternity;

}







// Print Profile


function printProfile(){

    window.print();

}

// Load Previously Selected Employee

let savedEmployee =
localStorage.getItem("selectedEmployee");


if(savedEmployee){

    employeeSelect.value = savedEmployee;

    loadProfile(savedEmployee);

}

const downloadBtn = document.getElementById("downloadBtn");


if(downloadBtn){

downloadBtn.addEventListener("click", function(){


let selectedId = employeeSelect.value;


let employee = employees.find(
emp => emp.id === selectedId
);



if(!employee){

alert("Please select employee");

return;

}



let data = `

Employee Profile

ID: ${employee.id}

Name: ${employee.name}

Department: ${employee.department}

Designation: ${employee.designation}

Email: ${employee.email}

Phone: ${employee.phone || "N/A"}

Joining Date: ${employee.joiningDate || "N/A"}

Status: ${employee.status}

`;



let blob = new Blob(
[data],
{
type:"text/plain"
}
);



let link=document.createElement("a");


link.href=URL.createObjectURL(blob);


link.download=
employee.name+"-profile.txt";


link.click();



});

}