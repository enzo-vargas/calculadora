var currentDisplay = "0";
var resultDisplay = false;


function appendToDisplay(value) {
    if (currentDisplay === "0" || resultDisplay) {
        currentDisplay = value;
    } else {
        currentDisplay += value;
    }

    resultDisplay = false;
    
    updateDisplay();
}

function updateDisplay() {
    var displayElement = document.getElementById("display");
    displayElement.textContent = currentDisplay;
}


function clearLastEntry() {

    if (currentDisplay === ''){

        currentDisplay = currentDisplay.slice(0, -1);
    
    } else {
        currentDisplay = "0";
    }

    updateDisplay();
}


function clearDisplay(){
    var currentDisplay = "0";
    var resultDisplay = false;

    updateDisplay();
}

    
async function calculate() {
    var expression = currentDisplay;


    try {
        var response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "expression": expression })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        var data = await response.json();
        console.log(data);
        var result = data.usuario.result;
        
        console.log(result);
        currentDisplay = expression + "\n= " + result;
        console.log(currentDisplay);
    } catch (error) {
        console.error('Erro:', error);
    }

    updateDisplay();
    resultDisplay = true;
}
