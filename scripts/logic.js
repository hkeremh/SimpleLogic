let inputList = [];
let outputList = [];

let SOMList = []; //sum of minterms list
let truthTable = [];
let boolEquation;

const inputText = document.querySelector(".input-field");
const inputButton = document.querySelector(".input-button");

const outputText = document.querySelector(".output-field");
const outputButton = document.querySelector(".output-button");

let sumOfMintermElements = document.getElementsByClassName("som-field");

let liElement; //list element to add to truth table
let node; //text node to edd to liElement
let truthTableElement = document.querySelector(".truth-table-list");

//---------Logic Equation---------

//checks if given string is a valid boolean equation
function validBoolEq(equation) {
    let operands = "&|^";
}

function updateLogicEq() {
    let divLogicEq = document.querySelector(".logic-eq");

    //remove previous contents
    while(divLogicEq.hasChildNodes()) {
        divLogicEq.removeChild(divLogicEq.firstChild);
    }

    for (let i = 0; i < outputList.length; i++) {
        let hElement = document.createElement("h2");
        let nodeSigma = document.createTextNode(outputList[i] + " = ");
        
        let inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.className = "text-field logic-eq-field-" + outputList[i];
        

        hElement.appendChild(nodeSigma);
        hElement.appendChild(inputElement);
        divLogicEq.appendChild(hElement);
    }

}

//---------Sum of Minterms---------


function updateSOM(){
    let divSOM = document.querySelector(".sum-of-minterms");

    //remove previous contents
    while(divSOM.hasChildNodes()) {
        divSOM.removeChild(divSOM.firstChild);
    }
    
    for (let i = 0; i < outputList.length; i++) {
        let hElement = document.createElement("h2");
        let nodeSigma = document.createTextNode(outputList[i] + " = Σ(");
        
        let inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.className = "text-field som-field som-field-" + outputList[i];
        
        let close = document.createTextNode(")");

        hElement.appendChild(nodeSigma);
        hElement.appendChild(inputElement);
        hElement.appendChild(close);
        divSOM.appendChild(hElement);
    }
    sumOfMintermElements = document.getElementsByClassName("som-field");
    for (let i = 0; i < sumOfMintermElements.length; i++) {
        sumOfMintermElements[i].addEventListener("keypress", function(event) { setTimeout(() => {
            
        
            let minterms = sumOfMintermElements[i].value.split(",");
            let valid = true;
            for (let j = 0; j < minterms.length; j++) {
                console.log(Number(minterms[j]));
                if(isNaN(minterms[j])) { //check if minterm is not a number
                    //todo
                    console.log("NaN");
                    valid = false;
                    break;
                } else if(0 > Number(minterms[j]) || 2**inputList.length <= Number(minterms[j])) {
                    //todo
                    console.log("Out of Bounds");
                    valid = false;
                    break;
                }
            }
            console.log(minterms);
            console.log(valid);
            if (valid) {
                //change logic eq (todo)

                //change truth table
                setAllZero();
                for (let j = 0; j < minterms.length; j++) {
                    if(minterms[j] == "") continue;
                    
                    let element = document.querySelector(".truth-table-" + outputList[i] + minterms[j]);
                    console.log(element);
                    element.replaceChild(document.createTextNode("1"), element.firstChild);
                }
            }
        }, 0.1);
        });
    }
}

//---------Truth Table-----------

//sets all outputs to 0
function setAllZero() {
    let height = 2**inputList.length;
    for (let i = 0; i < outputList.length; i++) {
        for (let j = 0; j < height; j++) {
            let element = document.querySelector(".truth-table-" + outputList[i] + j);
            element.replaceChild(document.createTextNode("0"), element.firstChild);
        }
        
    }
}

//adds element to truth table
function addTableElement(value, name = "", height = 0) {
    liElement = document.createElement("li");
    liElement.className = "truth-table-" + name + height;//todo
    node = document.createTextNode(value);
    liElement.appendChild(node);
    truthTableElement.appendChild(liElement);
}
//adds new line t truth table
function newLine() {
    liElement = document.createElement("li");
    liElement.className = "newline";
    truthTableElement.appendChild(liElement);
}
function updateTruthTable() {
    let height = 2**inputList.length;
    
    //remove previous content of the table
    while(truthTableElement.hasChildNodes()) {
        truthTableElement.removeChild(truthTableElement.firstChild);
    }

    //first row
    for (let i = 0; i < inputList.length; i++) {
        addTableElement(inputList[i]);
    }
    for (let i = 0; i < outputList.length; i++) {
        addTableElement(outputList[i]);
    }
    newLine();

    //filling up table
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < inputList.length; j++) {
            let exponent = 2**(inputList.length - j);
            let tableValue = (i % exponent) >= exponent / 2;
            if(tableValue) {
                addTableElement("1", inputList[j], i);
            }
            else {
                addTableElement("0", inputList[j], i);
            }
            
        }
        for (let j = 0; j < outputList.length; j++) {
            addTableElement("0", outputList[j], i);
        }
        newLine();
    }
}

//--------Inputs/Outputs----------------
function addInput() {
    inputList.push(inputText.value);
    inputText.value = "";
    console.log(inputList);
    updateTruthTable();

}
function addOutput() {
    outputList.push(outputText.value);
    outputText.value = "";
    console.log(outputList);
    updateTruthTable();
    updateSOM();
    updateLogicEq();

    //update text field event listeners
    let textFields = document.querySelectorAll(".text-field");
    for (let i = 0; i < textFields.length; i++) {
        let textFieldElement = textFields[i];
        textFieldElement.addEventListener("keydown",function(event) {
            //setting width of text field
            setTimeout(() => {
                const fontSize = getTextWidth(textFieldElement.value, getCanvasFont(textFieldElement));
                textFieldElement.style.width = Math.max(50, fontSize) + "px";
            }, 0.1);
            
        });
    }
}
inputButton.addEventListener("click",addInput);
inputText.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        addInput();
    }
});
outputButton.addEventListener("click",addOutput);
outputText.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        addOutput();
    }
});

//--------------Helper Functions----------------

/**
  * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
  * 
  * @param {String} text The text to be rendered.
  * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
  * 
  * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
  */
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}
function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}
function getCanvasFont(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';
    
    return `${fontWeight} ${fontSize} ${fontFamily}`;
}

