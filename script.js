function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById("loanAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) / 100 / 12;
    const loanTenure = parseInt(document.getElementById("loanTenure").value);

    const emi = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanTenure));
    const totalRepayment = emi * loanTenure;
    const totalInterest = totalRepayment - loanAmount;

    document.getElementById("emiResult").textContent = emi.toFixed(2);
    document.getElementById("totalInterest").textContent = totalInterest.toFixed(2);
    document.getElementById("totalRepayment").textContent = totalRepayment.toFixed(2);

    createRepaymentSchedule(loanAmount, emi, interestRate, loanTenure);
}

function createRepaymentSchedule(principal, emi, interestRate, months) {
    const scheduleTable = document.getElementById("scheduleTable").getElementsByTagName('tbody')[0];
    let outstandingBalance = principal;
    let totalInterestPaid = 0;

    // Clear previous schedule
    scheduleTable.innerHTML = '';

    for (let i = 1; i <= months; i++) {
        const interestPayment = outstandingBalance * interestRate;
        const principalPayment = emi - interestPayment;
        outstandingBalance -= principalPayment;

        const row = scheduleTable.insertRow();
        row.insertCell(0).textContent = i; // Month
        row.insertCell(1).textContent = emi.toFixed(2);
        row.insertCell(2).textContent = principalPayment.toFixed(2);
        row.insertCell(3).textContent = interestPayment.toFixed(2);
        row.insertCell(4).textContent = outstandingBalance.toFixed(2);
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Repayment Schedule", 14, 10);
    doc.autoTable({ html: '#scheduleTable' });
    doc.save('repayment-schedule.pdf');
}
