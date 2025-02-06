function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 12 / 100;
    const loanTenure = parseFloat(document.getElementById('loanTenure').value);

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTenure)) {
        alert("Please enter valid values in all fields.");
        return;
    }

    const emi = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTenure)) /
                (Math.pow(1 + interestRate, loanTenure) - 1);

    document.getElementById('emiResult').innerText = emi.toFixed(2);
    generateSchedule(loanAmount, interestRate, loanTenure, emi);
}

function generateSchedule(loanAmount, interestRate, loanTenure, emi) {
    const scheduleTable = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
    scheduleTable.innerHTML = '';

    let outstandingBalance = loanAmount;
    let totalInterest = 0;
    let totalPrincipal = 0;

    for (let month = 1; month <= loanTenure; month++) {
        const interestForMonth = outstandingBalance * interestRate;
        const principalForMonth = emi - interestForMonth;
        outstandingBalance -= principalForMonth;

        totalInterest += interestForMonth;
        totalPrincipal += principalForMonth;

        if (outstandingBalance < 0) {
            outstandingBalance = 0;
        }

        const row = scheduleTable.insertRow();
        row.innerHTML = `
            <td>${month}</td>
            <td>${emi.toFixed(2)}</td>
            <td>${principalForMonth.toFixed(2)}</td>
            <td>${interestForMonth.toFixed(2)}</td>
            <td>${outstandingBalance.toFixed(2)}</td>
        `;
    }

    document.getElementById('totalInterest').innerText = totalInterest.toFixed(2);
    document.getElementById('totalRepayment').innerText = (totalPrincipal + totalInterest).toFixed(2);
}

// Function to Download the Schedule as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Repayment Schedule', 14, 22);
    doc.setFontSize(12);
    doc.text('Generated using EMI Calculator', 14, 30);

    const table = document.getElementById('scheduleTable');
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText);
    const data = Array.from(table.querySelectorAll('tbody tr')).map(tr => 
        Array.from(tr.querySelectorAll('td')).map(td => td.innerText)
    );

    // Generate PDF Table using autoTable
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save('Repayment_Schedule.pdf');
}
