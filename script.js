function fetchCibilScore() {
    const panCardNumber = document.getElementById("panCardNumber").value;

    if (!panCardNumber) {
        alert("Please enter your PAN card number.");
        return;
    }

    // Simulate API call to fetch CIBIL score (this is just a mock function)
    // In reality, you'd send the PAN card number to an API like CIBIL/Experian/Equifax
    simulateCibilAPICall(panCardNumber)
        .then(cibilScore => {
            document.getElementById("cibilFeedback").textContent = `Your CIBIL Score: ${cibilScore}`;
            adjustInterestRateBasedOnCibil(cibilScore);
        })
        .catch(err => {
            console.error("Error fetching CIBIL score:", err);
            document.getElementById("cibilFeedback").textContent = "Error fetching CIBIL score. Please try again later.";
        });
}

function simulateCibilAPICall(panCardNumber) {
    // Simulating an API response after a delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Mock CIBIL score based on PAN card number
            // You can replace this with actual API logic
            const mockCibilScore = Math.floor(Math.random() * (900 - 300 + 1)) + 300; // Mock CIBIL score between 300 and 900
            resolve(mockCibilScore);
        }, 2000);
    });
}

function adjustInterestRateBasedOnCibil(cibilScore) {
    let adjustedInterestRate = parseFloat(document.getElementById("interestRate").value);
    
    if (cibilScore >= 750) {
        adjustedInterestRate -= 1; // Decrease interest rate if CIBIL score is high
    } else if (cibilScore >= 650 && cibilScore < 750) {
        adjustedInterestRate = adjustedInterestRate; // Keep interest rate as is
    } else if (cibilScore >= 550 && cibilScore < 650) {
        adjustedInterestRate += 1; // Increase interest rate if CIBIL score is low
    } else {
        adjustedInterestRate += 2; // Increase significantly if CIBIL score is very low
    }

    // Update the interest rate field and display adjusted interest rate
    document.getElementById("interestRate").value = adjustedInterestRate.toFixed(2);
    document.getElementById("adjustedInterestRate").textContent = `Adjusted Interest Rate: ${adjustedInterestRate.toFixed(2)}%`;
}

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
