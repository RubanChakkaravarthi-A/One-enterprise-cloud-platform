// ======================================================
// LOAD EMPLOYEE DATA
// ======================================================

const employees =
    JSON.parse(localStorage.getItem("employees")) || [];


// ======================================================
// LOAD ATTENDANCE DATA
// ======================================================

let attendanceData =
    JSON.parse(localStorage.getItem("attendance")) || [];


// ======================================================
// LOAD LEAVE REQUEST DATA
// ======================================================

let leaveRequests =
    JSON.parse(localStorage.getItem("leaveRequests")) || [];


// ======================================================
// HTML ELEMENTS
// ======================================================

const attendanceTableBody =
    document.getElementById("attendanceTableBody");

const searchAttendance =
    document.getElementById("searchAttendance");

const departmentFilter =
    document.getElementById("departmentFilter");

const statusFilter =
    document.getElementById("statusFilter");


// ======================================================
// CURRENT DATE
// ======================================================

const currentDate =
    document.getElementById("currentDate");

if (currentDate) {

    currentDate.textContent =
        new Date().toLocaleDateString();

}


// ======================================================
// APPROVED LEAVE CHECK
// ======================================================

function isEmployeeOnApprovedLeave(employeeId) {

    // Get latest leave data from LocalStorage
    leaveRequests =
        JSON.parse(
            localStorage.getItem("leaveRequests")
        ) || [];


    // Today's date
    const today = new Date();

    today.setHours(0, 0, 0, 0);


    // Find approved leave for this employee
    const approvedLeave =
        leaveRequests.find(leave => {

            // Employee ID match
            const employeeMatch =
                String(leave.employeeId) === String(employeeId);


            if (!employeeMatch) {
                return false;
            }


            // Only Approved leave
            if (leave.status !== "Approved") {
                return false;
            }


            // Leave dates
            const fromDate =
                new Date(leave.fromDate);

            const toDate =
                new Date(leave.toDate);


            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(0, 0, 0, 0);


            // Check whether today is inside leave period
            return (
                today >= fromDate &&
                today <= toDate
            );

        });


    return !!approvedLeave;

}


// ======================================================
// LOAD DEPARTMENT FILTER
// ======================================================

function loadDepartments() {

    if (!departmentFilter) {
        return;
    }


    let departments = [

        ...new Set(
            employees.map(
                emp => emp.department
            )
        )

    ];


    departments.forEach(dep => {

        departmentFilter.innerHTML += `

            <option value="${dep}">
                ${dep}
            </option>

        `;

    });

}


loadDepartments();


// ======================================================
// DISPLAY ATTENDANCE TABLE
// ======================================================

function displayAttendance(data) {

    attendanceTableBody.innerHTML = "";


    if (data.length === 0) {

        attendanceTableBody.innerHTML = `

            <tr>

                <td colspan="5">

                    No Employees Found

                </td>

            </tr>

        `;

        return;

    }


    data.forEach(employee => {


        // Existing attendance
        let existing =
            attendanceData.find(
                att =>
                    String(att.id) ===
                    String(employee.id)
            );


        let status =
            existing
                ? existing.status
                : "";


        // Check approved leave
        let onApprovedLeave =
            isEmployeeOnApprovedLeave(
                employee.id
            );


        // ==================================================
        // STATUS BADGE
        // ==================================================

        let statusBadge = "";


        if (onApprovedLeave) {

            statusBadge =
                `<span class="status absent">
                    On Leave
                </span>`;

        }

        else if (status === "Present") {

            statusBadge =
                `<span class="status present">
                    Present
                </span>`;

        }

        else if (status === "Absent") {

            statusBadge =
                `<span class="status absent">
                    Absent
                </span>`;

        }

        else if (status === "Half Day") {

            statusBadge =
                `<span class="status halfday">
                    Half Day
                </span>`;

        }

        else if (status === "Work From Home") {

            statusBadge =
                `<span class="status wfh">
                    WFH
                </span>`;

        }


        // ==================================================
        // ATTENDANCE CONTROL
        // ==================================================

        let attendanceControl = "";


        if (onApprovedLeave) {

            attendanceControl = `

                <span class="status absent">
                    Attendance Locked - On Leave
                </span>

            `;

        }

        else {

            attendanceControl = `

                <select
                    id="status-${employee.id}"
                    class="attendance-select">

                    <option value="">
                        Select Status
                    </option>


                    <option value="Present"
                        ${status === "Present"
                            ? "selected"
                            : ""}>

                        Present

                    </option>


                    <option value="Absent"
                        ${status === "Absent"
                            ? "selected"
                            : ""}>

                        Absent

                    </option>


                    <option value="Half Day"
                        ${status === "Half Day"
                            ? "selected"
                            : ""}>

                        Half Day

                    </option>


                    <option value="Work From Home"
                        ${status === "Work From Home"
                            ? "selected"
                            : ""}>

                        Work From Home

                    </option>

                </select>

            `;

        }


        // ==================================================
        // ACTION BUTTONS
        // ==================================================

        let actionButtons = "";


        if (onApprovedLeave) {

            actionButtons = `

                <span class="status absent">
                    Attendance Locked
                </span>

            `;

        }

        else {

            actionButtons = `

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

            `;

        }


        // ==================================================
        // TABLE ROW
        // ==================================================

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

                    ${attendanceControl}

                </td>


                <td>

                    ${actionButtons}

                </td>


            </tr>

        `;

    });

}


// ======================================================
// INITIAL DISPLAY
// ======================================================

displayAttendance(employees);


// ======================================================
// MARK ATTENDANCE
// ======================================================

function markAttendance(id) {


    // Check approved leave first
    if (isEmployeeOnApprovedLeave(id)) {

        alert(
            "This employee is on approved leave today. Attendance cannot be marked."
        );

        return;

    }


    const select =
        document.getElementById(
            `status-${id}`
        );


    if (!select) {
        return;
    }


    const status =
        select.value;


    if (status === "") {

        alert(
            "Please select attendance status"
        );

        return;

    }


    // Check duplicate
    const existing =
        attendanceData.find(
            att =>
                String(att.id) ===
                String(id)
        );


    if (existing) {

        alert(
            "Attendance already marked. Use Update."
        );

        return;

    }


    // Add attendance
    attendanceData.push({

        id: id,

        status: status,

        date:
            new Date().toLocaleDateString()

    });


    // Save
    localStorage.setItem(
        "attendance",
        JSON.stringify(attendanceData)
    );


    alert(
        "Attendance Marked Successfully"
    );


    displayAttendance(employees);

    updateStats();

}


// ======================================================
// UPDATE ATTENDANCE
// ======================================================

function updateAttendance(id) {


    // Check approved leave
    if (isEmployeeOnApprovedLeave(id)) {

        alert(
            "This employee is on approved leave today. Attendance cannot be updated."
        );

        return;

    }


    const select =
        document.getElementById(
            `status-${id}`
        );


    if (!select) {
        return;
    }


    const status =
        select.value;


    if (status === "") {

        alert(
            "Please select attendance status"
        );

        return;

    }


    const index =
        attendanceData.findIndex(
            att =>
                String(att.id) ===
                String(id)
        );


    if (index === -1) {

        alert(
            "Please mark attendance first"
        );

        return;

    }


    attendanceData[index].status =
        status;


    attendanceData[index].date =
        new Date().toLocaleDateString();


    // Save
    localStorage.setItem(
        "attendance",
        JSON.stringify(attendanceData)
    );


    alert(
        "Attendance Updated Successfully"
    );


    displayAttendance(employees);

    updateStats();

}


// ======================================================
// RESET ATTENDANCE
// ======================================================

function resetAttendance(id) {


    const index =
        attendanceData.findIndex(
            att =>
                String(att.id) ===
                String(id)
        );


    if (index !== -1) {

        attendanceData.splice(
            index,
            1
        );


        localStorage.setItem(
            "attendance",
            JSON.stringify(attendanceData)
        );


        alert(
            "Attendance Reset Successfully"
        );

    }

    else {

        alert(
            "No Attendance Found"
        );

    }


    displayAttendance(employees);

    updateStats();

}


// ======================================================
// ATTENDANCE STATISTICS
// ======================================================

function updateStats() {


    const total =
        employees.length;


    // Employees currently on approved leave
    const employeesOnLeave =
        employees.filter(
            employee =>
                isEmployeeOnApprovedLeave(
                    employee.id
                )
        );


    const onLeaveIds =
        employeesOnLeave.map(
            employee =>
                String(employee.id)
        );


    // Only count attendance for employees
    // who are NOT currently on approved leave
    const validAttendance =
        attendanceData.filter(
            att =>
                !onLeaveIds.includes(
                    String(att.id)
                )
        );


    const present =
        validAttendance.filter(
            att =>
                att.status === "Present"
        ).length;


    const absent =
        validAttendance.filter(
            att =>
                att.status === "Absent"
        ).length;


    const halfDay =
        validAttendance.filter(
            att =>
                att.status === "Half Day"
        ).length;


    const wfh =
        validAttendance.filter(
            att =>
                att.status === "Work From Home"
        ).length;


    // ==================================================
    // DASHBOARD ELEMENTS
    // ==================================================

    const totalEmployees =
        document.getElementById(
            "totalEmployees"
        );


    const presentEmployees =
        document.getElementById(
            "presentEmployees"
        );


    const absentEmployees =
        document.getElementById(
            "absentEmployees"
        );


    const halfDayEmployees =
        document.getElementById(
            "halfDayEmployees"
        );


    const wfhEmployees =
        document.getElementById(
            "wfhEmployees"
        );


    if (totalEmployees) {

        totalEmployees.textContent =
            total;

    }


    if (presentEmployees) {

        presentEmployees.textContent =
            present;

    }


    if (absentEmployees) {

        absentEmployees.textContent =
            absent;

    }


    if (halfDayEmployees) {

        halfDayEmployees.textContent =
            halfDay;

    }


    if (wfhEmployees) {

        wfhEmployees.textContent =
            wfh;

    }

}


// ======================================================
// INITIAL STATISTICS
// ======================================================

updateStats();


// ======================================================
// SEARCH ATTENDANCE
// ======================================================

if (searchAttendance) {

    searchAttendance.addEventListener(
        "keyup",
        function () {

            filterAttendance();

        }
    );

}


// ======================================================
// DEPARTMENT FILTER
// ======================================================

if (departmentFilter) {

    departmentFilter.addEventListener(
        "change",
        function () {

            filterAttendance();

        }
    );

}


// ======================================================
// STATUS FILTER
// ======================================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        function () {

            filterAttendance();

        }
    );

}


// ======================================================
// FILTER FUNCTION
// ======================================================

function filterAttendance() {


    let keyword = "";


    if (searchAttendance) {

        keyword =
            searchAttendance.value
                .toLowerCase();

    }


    let department =
        "All";


    if (departmentFilter) {

        department =
            departmentFilter.value;

    }


    let status =
        "All";


    if (statusFilter) {

        status =
            statusFilter.value;

    }


    let filtered =
        employees.filter(
            employee => {


                // Search
                let matchSearch =

                    employee.name
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    String(employee.id)
                        .toLowerCase()
                        .includes(keyword);


                // Department
                let matchDepartment =

                    department === "All"

                    ||

                    employee.department ===
                    department;


                // Attendance
                let attendance =
                    attendanceData.find(
                        att =>
                            String(att.id) ===
                            String(employee.id)
                    );


                let empStatus =
                    attendance
                        ? attendance.status
                        : "";


                // Approved leave
                let onApprovedLeave =
                    isEmployeeOnApprovedLeave(
                        employee.id
                    );


                // If employee is on approved leave,
                // status becomes On Leave
                if (onApprovedLeave) {

                    empStatus =
                        "On Leave";

                }


                // Status filter
                let matchStatus =

                    status === "All"

                    ||

                    empStatus === status;


                return (

                    matchSearch &&

                    matchDepartment &&

                    matchStatus

                );

            }
        );


    displayAttendance(filtered);

}


// ======================================================
// GENERATE REPORT
// ======================================================

const reportBtn =
    document.getElementById(
        "generateReportBtn"
    );


if (reportBtn) {

    reportBtn.addEventListener(
        "click",
        function () {

            alert(
                "Attendance Report Generated Successfully"
            );

        }
    );

}


// ======================================================
// EXPORT ATTENDANCE
// ======================================================

const exportBtn =
    document.getElementById(
        "exportBtn"
    );


if (exportBtn) {

    exportBtn.addEventListener(
        "click",
        function () {


            let report =
                JSON.stringify(
                    attendanceData,
                    null,
                    2
                );


            let blob =
                new Blob(
                    [report],
                    {
                        type:
                            "application/json"
                    }
                );


            let link =
                document.createElement(
                    "a"
                );


            link.href =
                URL.createObjectURL(
                    blob
                );


            link.download =
                "attendance-report.json";


            link.click();

        }
    );

}


// ======================================================
// SEND REPORT
// ======================================================

const sendReportBtn =
    document.getElementById(
        "sendReportBtn"
    );


if (sendReportBtn) {

    sendReportBtn.addEventListener(
        "click",
        function () {

            alert(
                "Attendance Report Sent Successfully"
            );

        }
    );

}


// ======================================================
// QUICK MARK BUTTON
// ======================================================

const quickMarkBtn =
    document.getElementById(
        "markAttendanceBtn"
    );


if (quickMarkBtn) {

    quickMarkBtn.addEventListener(
        "click",
        function () {

            alert(
                "Select employee and mark attendance"
            );

        }
    );

}