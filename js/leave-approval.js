// Get leave requests from localStorage

let leaveRequests = JSON.parse(
    localStorage.getItem("leaveRequests")
) || [];



const tableBody = document.getElementById("leaveTableBody");



// Render Leave Table

function displayLeaves(){

    tableBody.innerHTML = "";


    leaveRequests.forEach((leave,index)=>{


        let row = document.createElement("tr");


        row.innerHTML = `

        <td>${leave.employeeId}</td>

        <td>${leave.employeeName}</td>

        <td>${leave.department}</td>

        <td>${leave.leaveType}</td>

        <td>${leave.totalDays}</td>


        <td>
            <span class="status ${leave.status.toLowerCase()}">
                ${leave.status}
            </span>
        </td>


        <td>

            <button 
            class="approve"
            onclick="updateStatus(${index},'Approved')">
            Approve
            </button>


            <button 
            class="reject"
            onclick="updateStatus(${index},'Rejected')">
            Reject
            </button>


            <button 
            class="cancel"
            onclick="updateStatus(${index},'Cancelled')">
            Cancel
            </button>

        </td>

        `;


        tableBody.appendChild(row);


    });


    updateCounts();

}




// Update Status Function

function updateStatus(index,status){


    leaveRequests[index].status = status;


    localStorage.setItem(
        "leaveRequests",
        JSON.stringify(leaveRequests)
    );


    displayLeaves();

}





// Dashboard Count

function updateCounts(){


    let pending = leaveRequests.filter(
        leave=>leave.status==="Pending"
    ).length;


    let approved = leaveRequests.filter(
        leave=>leave.status==="Approved"
    ).length;



    let rejected = leaveRequests.filter(
        leave=>leave.status==="Rejected"
    ).length;



    document.getElementById("pendingCount").innerText = pending;


    document.getElementById("approvedCount").innerText = approved;


    document.getElementById("rejectedCount").innerText = rejected;


}





// Initial Load

displayLeaves();