// ===============================
// LOAD DATA FROM LOCAL STORAGE
// ===============================

let employees =
    JSON.parse(localStorage.getItem("employees")) || [];

let attendance =
    JSON.parse(localStorage.getItem("attendance")) || [];

let leaveRequests =
    JSON.parse(localStorage.getItem("leaveRequests")) || [];


// ===============================
// ELEMENTS
// ===============================

const employeeSelect =
    document.getElementById("employeeSelect");

const employeeName =
    document.getElementById("employeeName");

const employeeProfileName =
    document.getElementById("profileName");

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


// ===============================
// LOAD EMPLOYEES INTO DROPDOWN
// ===============================

employeeSelect.innerHTML = `
    <option value="">
        Select Employee
    </option>
`;

employees.forEach(employee => {

    const option =
        document.createElement("option");

    option.value = employee.id;

    option.textContent =
        employee.name + " - " + employee.id;

    employeeSelect.appendChild(option);

});


// ===============================
// DATE HELPER
// ===============================

function parseDate(dateString) {

    if (!dateString) {
        return null;
    }

    const date =
        new Date(dateString);

    if (isNaN(date.getTime())) {
        return null;
    }

    date.setHours(0, 0, 0, 0);

    return date;
}


// ===============================
// CHECK WHETHER ATTENDANCE DATE
// IS INSIDE APPROVED LEAVE
// ===============================

function isDateOnApprovedLeave(
    attendanceDate,
    approvedLeaves
) {

    const date =
        parseDate(attendanceDate);

    if (!date) {
        return false;
    }

    return approvedLeaves.some(leave => {

        const from =
            parseDate(leave.fromDate);

        const to =
            parseDate(leave.toDate);

        if (!from || !to) {
            return false;
        }

        return date >= from && date <= to;

    });

}


// ===============================
// EMPLOYEE SELECTION
// ===============================

employeeSelect.addEventListener(
    "change",
    function () {

        const id = this.value;

        if (id === "") {

            localStorage.removeItem(
                "selectedEmployee"
            );

            return;
        }

        localStorage.setItem(
            "selectedEmployee",
            id
        );

        loadProfile(id);

    }
);


// ===============================
// LOAD EMPLOYEE PROFILE
// ===============================

function loadProfile(id) {

    // Always get latest data
    // from localStorage

    employees =
        JSON.parse(
            localStorage.getItem("employees")
        ) || [];

    attendance =
        JSON.parse(
            localStorage.getItem("attendance")
        ) || [];

    leaveRequests =
        JSON.parse(
            localStorage.getItem("leaveRequests")
        ) || [];


    const employee =
        employees.find(
            emp => String(emp.id) === String(id)
        );


    if (!employee) {
        return;
    }


    // ===========================
    // PROFILE DETAILS
    // ===========================

    employeeName.textContent =
        employee.name || "Not Available";

    if (employeeProfileName) {

        employeeProfileName.textContent =
            employee.name || "Not Available";

    }

    employeeId.textContent =
        employee.id || "Not Available";

    employeeDepartment.textContent =
        employee.department || "Not Available";

    employeeDesignation.textContent =
        employee.designation || "Not Available";

    employeeEmail.textContent =
        employee.email || "Not Available";

    employeePhone.textContent =
        employee.phone || "Not Available";

    joiningDate.textContent =
        employee.joiningDate || "Not Available";


    if (employee.photo && employee.photo.trim() !== "") {

    employeePhoto.src = employee.photo;

    employeePhoto.onerror = function () {
        this.src = "images/default-profile.png";
    };

} else {

    employeePhoto.src = "imgs/default-profile.png";

}


// ===============================
// EMPLOYEE LEAVE DATA
// ===============================

    const empLeaves =
        leaveRequests.filter(
            leave =>
                String(leave.employeeId) ===
                String(id)
        );


    // ONLY APPROVED LEAVES
    // affect attendance and balance

    const approvedLeaves =
        empLeaves.filter(
            leave =>
                String(leave.status)
                    .toLowerCase() ===
                "approved"
        );


// ===============================
// ATTENDANCE REPORT
// ===============================

    const empAttendance =
        attendance.filter(
            att =>
                String(
                    att.id ?? att.employeeId
                ) === String(id)
        );


    // Remove attendance records
    // that fall inside approved leave

    const validAttendance =
        empAttendance.filter(
            att =>
                !isDateOnApprovedLeave(
                    att.date ||
                    att.attendanceDate,
                    approvedLeaves
                )
        );


    const present =
        validAttendance.filter(
            att =>
                String(att.status)
                    .toLowerCase() ===
                "present"
        ).length;


    const total =
        validAttendance.length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            ((present / total) * 100)
                .toFixed(2);

    }


    workingDays.textContent =
        total;

    presentDays.textContent =
        present;

    attendancePercentage.textContent =
        percentage + "%";


// ===============================
// APPROVED LEAVE DAYS
// ===============================

    let approvedLeaveDays = 0;


    approvedLeaves.forEach(leave => {

        approvedLeaveDays +=
            Number(leave.days) || 0;

    });


    leaveDays.textContent =
        approvedLeaveDays;


// ===============================
// LEAVE HISTORY
// ===============================

    leaveHistory.innerHTML = "";


    if (empLeaves.length === 0) {

        leaveHistory.innerHTML = `
            <tr>
                <td colspan="5">
                    No Leave Records
                </td>
            </tr>
        `;

    } else {

        empLeaves.forEach(leave => {

            leaveHistory.innerHTML += `

                <tr>

                    <td>
                        ${leave.leaveType || "N/A"}
                    </td>

                    <td>
                        ${leave.fromDate || "N/A"}
                    </td>

                    <td>
                        ${leave.toDate || "N/A"}
                    </td>

                    <td>
                        ${leave.days || 0}
                    </td>

                    <td>
                        ${leave.status || "Pending"}
                    </td>

                </tr>

            `;

        });

    }


// ===============================
// LEAVE BALANCE
// ===============================

    let balance = {

        casual: 5,

        sick: 3,

        earned: 7,

        optional: 2,

        maternity: 0

    };


    // ONLY APPROVED LEAVES
    // are deducted

    approvedLeaves.forEach(leave => {

        const days =
            Number(leave.days) || 0;


        if (
            leave.leaveType ===
            "Casual Leave"
        ) {

            balance.casual -= days;

        }


        if (
            leave.leaveType ===
            "Sick Leave"
        ) {

            balance.sick -= days;

        }


        if (
            leave.leaveType ===
            "Earned Leave"
        ) {

            balance.earned -= days;

        }


        if (
            leave.leaveType ===
            "Optional Leave"
        ) {

            balance.optional -= days;

        }


        if (
            leave.leaveType ===
            "Maternity Leave"
        ) {

            balance.maternity -= days;

        }

    });


    // Prevent negative balance display

    balance.casual =
        Math.max(0, balance.casual);

    balance.sick =
        Math.max(0, balance.sick);

    balance.earned =
        Math.max(0, balance.earned);

    balance.optional =
        Math.max(0, balance.optional);

    balance.maternity =
        Math.max(0, balance.maternity);


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


// ===============================
// PRINT PROFILE
// ===============================

function printProfile() {

    window.print();

}


// ===============================
// LOAD PREVIOUSLY SELECTED
// EMPLOYEE
// ===============================

const savedEmployee =
    localStorage.getItem(
        "selectedEmployee"
    );


if (savedEmployee) {

    const employeeExists =
        employees.some(
            emp =>
                String(emp.id) ===
                String(savedEmployee)
        );


    if (employeeExists) {

        employeeSelect.value =
            savedEmployee;

        loadProfile(savedEmployee);

    } else {

        localStorage.removeItem(
            "selectedEmployee"
        );

    }

}


// ===============================
// DOWNLOAD PROFILE
// ===============================

const downloadBtn =
    document.getElementById(
        "downloadBtn"
    );


if (downloadBtn) {

    downloadBtn.addEventListener(
        "click",
        function () {

            const selectedId =
                employeeSelect.value;


            const employee =
                employees.find(
                    emp =>
                        String(emp.id) ===
                        String(selectedId)
                );


            if (!employee) {

                alert(
                    "Please select employee"
                );

                return;

            }


            const data = `

Employee Profile

ID: ${employee.id}

Name: ${employee.name}

Department: ${employee.department}

Designation: ${employee.designation}

Email: ${employee.email}

Phone: ${employee.phone || "N/A"}

Joining Date: ${employee.joiningDate || "N/A"}

Status: ${employee.status || "N/A"}

`;


            const blob =
                new Blob(
                    [data],
                    {
                        type:
                            "text/plain"
                    }
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                URL.createObjectURL(blob);


            link.download =
                employee.name +
                "-profile.txt";


            link.click();


            URL.revokeObjectURL(
                link.href
            );

        }
    );

}