function calculateEMI() {
    // Get the loan details from the user input
    const loanAmount = parseFloat(document.getElementById("loanAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) / 100 / 12; // Monthly rate
    const loanTenure = parseInt(document.getElementById("loanTenure").value);
    const cibilScore = parseInt(document.getElementById("cibilScore").value);

    // Check CIBIL score
    checkCIBILScore(cibilScore);

    // Calculate EMI using the formula
    const emi = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanTenure));
    
    // Calculate total repayment and interest
    const totalRepayment = emi * loanTenure;
    const totalInterest = totalRepayment - loanAmount;

    // Calculate IRR (approximate using yearly cash flow method)
    const irr = calculateIRR(loanAmount, emi, loanTenure);
    
    // Display results
    document.getElementById("emiResult").textContent = emi.toFixed(2);
    document.getElementById("totalInterest").textContent = totalInterest.toFixed(2);
    document.getElementById("totalRepayment").textContent = totalRepayment.toFixed(2);
    document.getElementById("irrResult").textContent = irr.toFixed(2);
    
    // Create repayment schedule
    createRepaymentSchedule(loanAmount, emi, interestRate, loanTenure);
}

// Function to check CIBIL Score and give advice
function checkCIBILScore(score) {
    let cibilMessage = '';
    let adjustedInterestRate = parseFloat(document.getElementById("interestRate").value);
    
    if (score >= 750) {
        cibilMessage = "Excellent CIBIL score! You are eligible for a loan with lower interest rates.";
        adjustedInterestRate -= 1; // Decrease interest rate if CIBIL score is high
    } else if (score >= 650 && score < 750) {
        cibilMessage = "Good CIBIL score! You have a fair chance of loan approval.";
        adjustedInterestRate = adjustedInterestRate; // Keep interest rate as is
    } else if (score >= 550 && score < 650) {
        cibilMessage = "Fair CIBIL score! You may face higher interest rates or more stringent loan conditions.";
        adjustedInterestRate += 1; // Increase interest rate if CIBIL score is low
    } else {
        cibilMessage = "Poor CIBIL score! You may face difficulties getting loan approval or may have to pay much higher interest rates.";
        adjustedInterestRate += 2; // Significantly higher interest rate if CIBIL is poor
    }

    // Display CIBIL score feedback
    document.getElementById("cibilFeedback").textContent = cibilMessage;

    // Update the interest rate based on CIBIL score
    document.getElementById("interestRate").value = adjustedInterestRate.toFixed(2);
    document.getElementById("adjustedInterestRate").textContent = `Adjusted Interest Rate: ${adjustedInterestRate.toFixed(2)}%`;
}

// Function to calculate IRR using yearly cash flow method (simplified approach)
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

    return irr * 100; // Return as percentage (annualized IRR)
}

// Function to calculate NPV (Net Present Value) using yearly cash flows
function calculateNPV(principal, emi, irr, months) {
    let npv = -principal; // Initial outflow is the loan amount
    const years = Math.floor(months / 12); // Number of years for the loan

    // Calculate annual NPV by summing up cash flows for each year
    for (let i = 1; i <= years; i++) {
        const yearlyEMI = emi * 12;  // Convert monthly EMI to yearly EMI
        npv += yearlyEMI / Math.pow(1 + irr, i); // Discount each annual EMI by the IRR
    }
    return npv;
}

// Function to generate the repayment schedule
function createRepaymentSchedule(principal, emi, interestRate, months) {
    const scheduleTable = document.getElementById("scheduleTable").getElementsByTagName('tbody')[0];
    let outstandingBalance = principal;
    let totalInterestPaid = 0;
    const years = Math.floor(months / 12); // Number of years for the loan

    for (let i = 1; i <= years; i++) {
        const interestPayment = outstandingBalance * interestRate * 12; // Yearly interest
        const principalPayment = emi * 12 - interestPayment; // Principal paid in a year
        outstandingBalance -= principalPayment;
        totalInterestPaid += interestPayment;

        const row = scheduleTable.insertRow();
        row.innerHTML = `
            <td>${i}</td>
            <td>${(emi * 12).toFixed(2)}</td> <!-- Yearly EMI -->
            <td>${principalPayment.toFixed(2)}</td>
            <td>${interestPayment.toFixed(2)}</td>
            <td>${outstandingBalance.toFixed(2)}</td>
        `;
    }
}

function downloadPDF() {
    // Code to generate PDF (you can use jsPDF for this)
}
