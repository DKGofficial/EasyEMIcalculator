function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 12 / 100;
    const loanTenure = parseFloat(document.getElementById('loanTenure').value);

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTenure)) {
        alert("Please enter valid values in all fields.");
        return;
    }

    // EMI Calculation Formula
    const emi = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTenure)) /
                (Math.pow(1 + interestRate, loanTenure) - 1);

    document.getElementById('emiResult').innerText = emi.toFixed(2);

    // Generate Repayment Schedule
    generateSchedule(loanAmount, interestRate, loanTenure, emi);
}

function generateSchedule(loanAmount, interestRate, loanTenure, emi) {
    const scheduleTable = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
    scheduleTable.innerHTML = '';  // Clear previous data

    let outstandingBalance = loanAmount;

    for (let month = 1; month <= loanTenure; month++) {
        const interestForMonth = outstandingBalance * interestRate;
        const principalForMonth = emi - interestForMonth;
        outstandingBalance -= principalForMonth;

        // Ensure balance doesn't go negative
        if (outstandingBalance < 0) {
            outstandingBalance = 0;
        }

        // Add row to the table
        const row = scheduleTable.insertRow();
        row.innerHTML = `
            <td>${month}</td>
            <td>${principalForMonth.toFixed(2)}</td>
            <td>${interestForMonth.toFixed(2)}</td>
            <td>${outstandingBalance.toFixed(2)}</td>
        `;
    }
}
