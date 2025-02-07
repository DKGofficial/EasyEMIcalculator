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

// Function to calculate IRR using cash flow method
function calculateIRR(principal, emi, months) {
    let irr = 0.1; // Start with an initial guess for IRR (10%)
    let tolerance = 0.0001; // Desired precision
    let maxIterations = 1000; // Max iterations to prevent infinite loops
    let npv, derivative;

    for (let i = 0; i < maxIterations; i++) {
        npv = calculateNPV(principal, emi, irr, months);
        if (Math.abs(npv) < tolerance) {
            return irr * 100; // Return as percentage
        }

        derivative = calculateNPVDerivative(principal, emi, irr, months);
        irr -= npv / derivative; // Newton-Raphson method to adjust IRR guess
    }

    return irr * 100; // Return as percentage if max iterations are reached
}

// Function to calculate NPV (Net Present Value)
function calculateNPV(principal, emi, irr, months) {
    let npv = -principal; // Initial outflow is the loan amount
    for (let i = 1; i <= months; i++) {
        npv += emi / Math.pow(1 + irr, i); // Discount each EMI
    }
    return npv;
}

// Function to calculate the derivative of NPV
function calculateNPVDerivative(principal, emi, irr, months) {
    let derivative = 0;
    for (let i = 1; i <= months; i++) {
        derivative -= i * emi / Math.pow(1 + irr, i + 1); // Derivative of the NPV
    }
    return derivative;
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
