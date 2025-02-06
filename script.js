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

    // Generate Detailed Repayment Schedule and calculate totals
    generateSchedule(loanAmount, interestRate, loanTenure, emi);
}

function generateSchedule(loanAmount, interestRate, loanTenure, emi) {
    const scheduleTable = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
    scheduleTable.innerHTML = '';  // Clear previous data

    let outstandingBalance = loanAmount;
    let totalInterest = 0;
    let totalPrincipal = 0;

    for (let month = 1; month <= loanTenure; month++) {
        const interestForMonth = outstandingBalance * interestRate;
        const principalForMonth = emi - interestForMonth;
        outstandingBalance -= principalForMonth;

        // Accumulate totals
        totalInterest += interestForMonth;
        totalPrincipal += principalForMonth;

        // Ensure balance doesn't go negative
        if (outstandingBalance < 0) {
            outstandingBalance = 0;
        }

        // Add row to the table with detailed breakdown
        const row = scheduleTable.insertRow();
        row.innerHTML = `
            <td>${month}</td>
            <td>${emi.toFixed(2)}</td>
            <td>${principalForMonth.toFixed(2)}</td>
            <td>${interestForMonth.toFixed(2)}</td>
            <td>${outstandingBalance.toFixed(2)}</td>
        `;
    }

    // Display total interest and total repayment
    document.getElementById('totalInterest').innerText = totalInterest.toFixed(2);
    document.getElementById('totalRepayment').innerText = (totalPrincipal + totalInterest).toFixed(2);
}
