function calculateEMI() {
    // Get the loan details from the user input
    const loanAmount = parseFloat(document.getElementById("loanAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) / 100 / 12; // Monthly rate
    const loanTenure = parseInt(document.getElementById("loanTenure").value);

    // Calculate EMI using the formula
    const emi = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanTenure));
    
    // Calculate total repayment and interest
    const totalRepayment = emi * loanTenure;
    const totalInterest = totalRepayment - loanAmount;

    // Calculate IRR (approximate using cash flow method)
    const irr = calculateIRR(loanAmount, emi, loanTenure);
    
    // Display results
    document.getElementById("emiResult").textContent = emi.toFixed(2);
    document.getElementById("totalInterest").textContent = totalInterest.toFixed(2);
    document.getElementById("totalRepayment").textContent = totalRepayment.toFixed(2);
    document.getElementById("irrResult").textContent = irr.toFixed(2);
    
    // Create repayment schedule
    createRepaymentSchedule(loanAmount, emi, interestRate, loanTenure);
}

// Function to calculate IRR using cash flow method (simplified approach)
function calculateIRR(principal, emi, months) {
    let low = 0.0001;  // Lower bound for IRR
    let high = 1;      // Upper bound for IRR
    let irr = (low + high) / 2; // Initial guess for IRR
    let npv = calculateNPV(principal, emi, irr, months);
    let tolerance = 0.0001; // Desired precision

    while (Math.abs(npv) > tolerance) {
        if (npv > 0) {
            low = irr;  // Increase the guess if npv > 0
        } else {
            high = irr; // Decrease the guess if npv < 0
        }

        irr = (low + high) / 2; // Update the guess
        npv = calculateNPV(principal, emi, irr, months); // Calculate new NPV
    }

    return irr * 100; // Return as percentage
}

// Function to calculate NPV (Net Present Value)
function calculateNPV(principal, emi, irr, months) {
    let npv = -principal; // Initial outflow is the loan amount
    for (let i = 1; i <= months; i++) {
        npv += emi / Math.pow(1 + irr, i); // Discount each EMI
    }
    return npv;
}

// Function to generate the repayment schedule
function createRepaymentSchedule(principal, emi, interestRate, months) {
    const scheduleTable = document.getElementById("scheduleTable").getElementsByTagName('tbody')[0];
    let outstandingBalance = principal;
    let totalInterestPaid = 0;

    for (let i = 1; i <= months; i++) {
        const interestPayment = outstandingBalance * interestRate;
        const principalPayment = emi - interestPayment;
        outstandingBalance -= principalPayment;
        totalInterestPaid += interestPayment;

        const row = scheduleTable.insertRow();
        row.innerHTML = `
            <td>${i}</td>
            <td>${emi.toFixed(2)}</td>
            <td>${principalPayment.toFixed(2)}</td>
            <td>${interestPayment.toFixed(2)}</td>
            <td>${outstandingBalance.toFixed(2)}</td>
        `;
    }
}

function downloadPDF() {
    // Code to generate PDF (you can use jsPDF for this)
}
