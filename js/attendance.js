const employees = JSON.parse(localStorage.getItem("employees")) || [];

let attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];


const attendanceTableBody = document.getElementById("attendanceTableBody");

const searchAttendance = document.getElementById("searchAttendance");

const departmentFilter = document.getElementById("departmentFilter");

const statusFilter = document.getElementById("statusFilter");





// Current Date

const currentDate = document.getElementById("currentDate");


if(currentDate){

    currentDate.textContent = new Date().toLocaleDateString();

}







// Load Department Filter


function loadDepartments(){


    if(!departmentFilter) return;


    let departments = [

        ...new Set(
            employees.map(emp=>emp.department)
        )

    ];



    departments.forEach(dep=>{


        departmentFilter.innerHTML += `

        <option value="${dep}">
            ${dep}
        </option>

        `;


    });


}



loadDepartments();







// Display Attendance Table


function displayAttendance(data){


    attendanceTableBody.innerHTML = "";



    if(data.length === 0){


        attendanceTableBody.innerHTML = `

        <tr>

        <td colspan="5">

        No Employees Found

        </td>

        </tr>

        `;


        return;

    }





    data.forEach(employee=>{


        let existing = attendanceData.find(
            att => att.id === employee.id
        );



        let status = existing ? existing.status : "";



        let statusBadge = "";

if(status === "Present"){

statusBadge = `<span class="status present">Present</span>`;

}

else if(status === "Absent"){

statusBadge = `<span class="status absent">Absent</span>`;

}

else if(status === "Half Day"){

statusBadge = `<span class="status halfday">Half Day</span>`;

}

else if(status === "Work From Home"){

statusBadge = `<span class="status wfh">WFH</span>`;

}



        attendanceTableBody.innerHTML += `


        <tr>


        <td>
        ${employee.id}
        </td>



        <td>
        ${employee.name}
        </td>



        <td>
        ${employee.department}
        </td>



        <td>
          
        ${statusBadge}

<br><br>

        <select 
        id="status-${employee.id}"
        class="attendance-select">


        <option value="">
        Select Status
        </option>



        <option value="Present"
        ${status==="Present"?"selected":""}>

        Present

        </option>




        <option value="Absent"
        ${status==="Absent"?"selected":""}>

        Absent

        </option>




        <option value="Half Day"
        ${status==="Half Day"?"selected":""}>

        Half Day

        </option>





        <option value="Work From Home"
        ${status==="Work From Home"?"selected":""}>

        Work From Home

        </option>


        </select>


        </td>





        <td>


        <button 
        class="mark-btn"
        onclick="markAttendance('${employee.id}')">

        Mark

        </button>



        <button 
        class="update-btn"
        onclick="updateAttendance('${employee.id}')">

        Update

        </button>




        <button 
        class="reset-btn"
        onclick="resetAttendance('${employee.id}')">

        Reset

        </button>


        </td>



        </tr>


        `;



    });



}





displayAttendance(employees);

// Mark Attendance


function markAttendance(id){


    const select = document.getElementById(`status-${id}`);


    const status = select.value;



    if(status === ""){


        alert("Please select attendance status");

        return;

    }





    const existing = attendanceData.find(
        att => att.id === id
    );



    if(existing){


        alert("Attendance already marked. Use Update.");

        return;

    }





    attendanceData.push({


        id:id,

        status:status,

        date:new Date().toLocaleDateString()


    });





    localStorage.setItem(
        "attendance",
        JSON.stringify(attendanceData)
    );




    alert("Attendance Marked Successfully");

    displayAttendance(employees);

    updateStats();

}








// Update Attendance


function updateAttendance(id){



    const select = document.getElementById(`status-${id}`);


    const status = select.value;




    if(status === ""){


        alert("Please select attendance status");

        return;

    }





    const index = attendanceData.findIndex(

        att => att.id === id

    );





    if(index === -1){


        alert("Please mark attendance first");

        return;


    }





    attendanceData[index].status = status;



    localStorage.setItem(

        "attendance",

        JSON.stringify(attendanceData)

    );





    alert("Attendance Updated Successfully");

    displayAttendance(employees);

    updateStats();



}








// Reset Attendance


function resetAttendance(id){



    const index = attendanceData.findIndex(

        att => att.id === id

    );





    if(index !== -1){


        attendanceData.splice(index,1);



        localStorage.setItem(

            "attendance",

            JSON.stringify(attendanceData)

        );



        alert("Attendance Reset Successfully");


    }



    else{


        alert("No Attendance Found");


    }





    displayAttendance(employees);


    updateStats();


}










// Attendance Statistics


function updateStats(){



    const total = employees.length;



    const present = attendanceData.filter(

        att => att.status === "Present"

    ).length;




    const absent = attendanceData.filter(

        att => att.status === "Absent"

    ).length;





    const halfDay = attendanceData.filter(

        att => att.status === "Half Day"

    ).length;





    const wfh = attendanceData.filter(

        att => att.status === "Work From Home"

    ).length;






    const totalEmployees = document.getElementById(
        "totalEmployees"
    );



    const presentEmployees = document.getElementById(
        "presentEmployees"
    );



    const absentEmployees = document.getElementById(
        "absentEmployees"
    );



    const halfDayEmployees = document.getElementById(
        "halfDayEmployees"
    );



    const wfhEmployees = document.getElementById(
        "wfhEmployees"
    );





    if(totalEmployees)
        totalEmployees.textContent = total;



    if(presentEmployees)
        presentEmployees.textContent = present;



    if(absentEmployees)
        absentEmployees.textContent = absent;



    if(halfDayEmployees)
        halfDayEmployees.textContent = halfDay;



    if(wfhEmployees)
        wfhEmployees.textContent = wfh;



}





updateStats();

// Search Attendance


if(searchAttendance){


searchAttendance.addEventListener(
"keyup",
function(){


    filterAttendance();


});


}








// Department Filter


if(departmentFilter){


departmentFilter.addEventListener(
"change",
function(){


    filterAttendance();


});


}








// Status Filter


if(statusFilter){


statusFilter.addEventListener(
"change",
function(){


    filterAttendance();


});


}








// Filter Function


function filterAttendance(){



    let keyword = "";



    if(searchAttendance){

        keyword = searchAttendance.value.toLowerCase();

    }




    let department = "All";



    if(departmentFilter){

        department = departmentFilter.value;

    }





    let status = "All";



    if(statusFilter){

        status = statusFilter.value;

    }






    let filtered = employees.filter(employee=>{


        let matchSearch =


        employee.name.toLowerCase()
        .includes(keyword)

        ||

        employee.id.toLowerCase()
        .includes(keyword);







        let matchDepartment =

        department === "All"

        ||

        employee.department === department;






        let attendance = attendanceData.find(

            att=>att.id===employee.id

        );



        let empStatus = attendance ?
        attendance.status : "";







        let matchStatus =


        status === "All"

        ||

        empStatus === status;






        return (

            matchSearch &&

            matchDepartment &&

            matchStatus

        );




    });







    displayAttendance(filtered);



}









// Generate Report


const reportBtn = document.getElementById(
"generateReportBtn"
);



if(reportBtn){


reportBtn.addEventListener(
"click",
function(){


alert(
"Attendance Report Generated Successfully"
);



});


}









// Export Attendance


const exportBtn = document.getElementById(
"exportBtn"
);



if(exportBtn){


exportBtn.addEventListener(
"click",
function(){



let report = JSON.stringify(
attendanceData,
null,
2
);




let blob = new Blob(

[report],

{
type:"application/json"
}

);




let link = document.createElement("a");



link.href =
URL.createObjectURL(blob);



link.download =
"attendance-report.json";



link.click();




});


}









// Send Report


const sendReportBtn = document.getElementById(
"sendReportBtn"
);



if(sendReportBtn){


sendReportBtn.addEventListener(
"click",
function(){


alert(
"Attendance Report Sent Successfully"
);



});


}









// Quick Mark Button


const quickMarkBtn = document.getElementById(
"markAttendanceBtn"
);



if(quickMarkBtn){


quickMarkBtn.addEventListener(
"click",
function(){


alert(
"Select employee and mark attendance"
);



});


}





