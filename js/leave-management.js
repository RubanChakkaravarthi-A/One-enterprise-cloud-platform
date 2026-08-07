let employees = JSON.parse(localStorage.getItem("employees")) || [];

let leaveRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];



const employeeId = document.getElementById("employeeId");

const employeeName = document.getElementById("employeeName");

const department = document.getElementById("department");

const fromDate = document.getElementById("fromDate");

const toDate = document.getElementById("toDate");

const totalDays = document.getElementById("totalDays");

const leaveForm = document.getElementById("leaveForm");

const leaveTableBody = document.getElementById("leaveTableBody");





// Load Employees


function loadEmployees(){


    if(!employeeId) return;


    employees.forEach(emp=>{


        employeeId.innerHTML += `

        <option value="${emp.id}">

        ${emp.id}

        </option>

        `;


    });


}



loadEmployees();






// Employee Selection


if(employeeId){


employeeId.addEventListener("change",function(){


    let emp = employees.find(

        e=>e.id == this.value

    );


    if(emp){


        employeeName.value = emp.name;


        department.value = emp.department;


    }

    else{


        employeeName.value="";

        department.value="";

    }


});


}









// Calculate Days


function calculateDays(){


    if(fromDate.value && toDate.value){


        let start = new Date(fromDate.value);

        let end = new Date(toDate.value);



        if(end < start){


            alert(
            "To Date cannot be before From Date"
            );


            toDate.value="";

            totalDays.value="";


            return;


        }



        let difference =

        end - start;



        let days =

        Math.floor(

        difference/(1000*60*60*24)

        ) + 1;



        totalDays.value = days;



    }



}






fromDate.addEventListener(
"change",
calculateDays
);


toDate.addEventListener(
"change",
calculateDays
);









// Submit Leave Request


leaveForm.addEventListener(
"submit",
function(e){


e.preventDefault();



let leaveType =
document.getElementById("leaveType").value;


let reason =
document.getElementById("reason").value;





if(
employeeId.value==="" ||
leaveType==="" ||
fromDate.value==="" ||
toDate.value==="" ||
reason.trim()===""
){


alert(
"Please fill all required fields"
);


return;


}







let request = {


id:Date.now(),


employeeId:employeeId.value,


employeeName:employeeName.value,


department:department.value,


leaveType:leaveType,


fromDate:fromDate.value,


toDate:toDate.value,


days:totalDays.value,


reason:reason,


status:"Pending"


};







leaveRequests.push(request);




localStorage.setItem(

"leaveRequests",

JSON.stringify(leaveRequests)

);





alert(
"Leave Request Submitted Successfully"
);





leaveForm.reset();


employeeName.value="";

department.value="";

totalDays.value="";



displayLeaves();


updateStats();



});









// Display Leave Requests


function displayLeaves(){



if(!leaveTableBody)
return;



leaveTableBody.innerHTML="";




if(leaveRequests.length===0){


leaveTableBody.innerHTML=`

<tr>

<td colspan="10">

No Leave Requests Found

</td>

</tr>

`;


return;


}







leaveRequests.forEach(leave=>{



leaveTableBody.innerHTML += `


<tr>


<td>
${leave.employeeId}
</td>


<td>
${leave.employeeName}
</td>


<td>
${leave.department}
</td>


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
${leave.reason}
</td>


<td>

<span class="${leave.status.toLowerCase()}">

${leave.status}

</span>

</td>

<td>

<button 
class="approve-btn"
onclick="approveLeave(${leave.id})">

Approve

</button>


<button 
class="reject-btn"
onclick="rejectLeave(${leave.id})">

Reject

</button>

</td>


</tr>


`;



});



}







displayLeaves();









// Update Statistics


function updateStats(){


let pending =
leaveRequests.filter(
l=>l.status==="Pending"
).length;



let approved =
leaveRequests.filter(
l=>l.status==="Approved"
).length;



let rejected =
leaveRequests.filter(
l=>l.status==="Rejected"
).length;



let total =
leaveRequests.length;




if(document.getElementById("pendingLeaves"))

document.getElementById("pendingLeaves").textContent=pending;



if(document.getElementById("approvedLeaves"))

document.getElementById("approvedLeaves").textContent=approved;



if(document.getElementById("rejectedLeaves"))

document.getElementById("rejectedLeaves").textContent=rejected;



if(document.getElementById("totalLeaves"))

document.getElementById("totalLeaves").textContent=total;



}



updateStats();

// Approve Leave

function approveLeave(id){


let leave = leaveRequests.find(
l=>l.id===id
);


if(leave){


leave.status="Approved";


localStorage.setItem(
"leaveRequests",
JSON.stringify(leaveRequests)
);


displayLeaves();

updateStats();


alert("Leave Approved Successfully");


}


}






// Reject Leave


function rejectLeave(id){


let leave = leaveRequests.find(
l=>l.id===id
);


if(leave){


leave.status="Rejected";


localStorage.setItem(
"leaveRequests",
JSON.stringify(leaveRequests)
);


displayLeaves();

updateStats();


alert("Leave Rejected Successfully");


}


}