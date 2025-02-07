function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById("loanAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) / 100 / 12;
    const loanTenure = parseInt(document.getElementById("loanTenure").value);

    const emi = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanTenure));
    const totalRepayment = emi * loanTenure;
    const totalInterest = totalRepayment - loanAmount;
    const irr = calculateIRR(loanAmount, emi, loanTenure);

    document.getElementById("emiResult").textContent = emi.toFixed(2);
    document.getElementById("totalInterest").textContent = totalInterest.toFixed(2);
    document.getElementById("totalRepayment").textContent = totalRepayment.toFixed(2);
    document.getElementById("irrResult").textContent = irr.toFixed(2);

    createRepaymentSchedule(loanAmount, emi, interestRate, loanTenure);
}

function calculateIRR(principal, emi, months) {
    let low = 0.0001;
    let high = 1;
    let irr = (low + high) / 2;
    let npv = calculateNPV(principal, emi, irr, months);
    let tolerance = 0.0001;

    while (Math.abs(npv) > tolerance) {
        if (npv > 0) {
            low = irr;
        } else {
            high = irr;
        }
        irr = (low + high) / 2;
        npv = calculateNPV(principal, emi, irr, months);
    }

    return irr * 100;
}

function calculateNPV(principal, emi, irr, months) {
    let npv = -principal;
    const years = Math.floor(months / 12);
    for (let i = 1; i <= years; i++) {
        const yearlyEMI = emi * 12;
        npv += yearlyEMI / Math.pow(1 + irr, i);
    }
    return npv;
}

function createRepaymentSchedule(principal, emi, interestRate, months) {
    const scheduleTable = document.getElementById("scheduleTable").getElementsByTagName('tbody')[0];
    let outstandingBalance = principal;
    let totalInterestPaid = 0;
    const years = Math.floor(months / 12);

    // Clear previous schedule
    scheduleTable.innerHTML = '';

    for (let i = 1; i <= years; i++) {
        const interestPayment = outstandingBalance * interestRate * 12;
        const principalPayment = emi * 12 - interestPayment;
        outstandingBalance -= principalPayment;

        const row = scheduleTable.insertRow();
        row.insertCell(0).textContent = i; // Year
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
