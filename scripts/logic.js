let inputList = [];
let outputList = [];

let SOMMap = new Map(); //sum of minterms list

const inputText = document.querySelector(".input-field");
const inputButton = document.querySelector(".input-button");

const outputText = document.querySelector(".output-field");
const outputButton = document.querySelector(".output-button");

let sumOfMintermElements = document.getElementsByClassName("som-field");

let liElement; //list element to add to truth table
let node; //text node to edd to liElement
let truthTableElement = document.querySelector(".truth-table-list");

function updateFromSOM() {
    //bool eq
    let height = 2** inputList.length;

    for (let i = 0; i < outputList.length; i++) {
        
        let minterms = SOMMap.get(outputList[i]);

        let equationField = document.querySelector(".logic-eq-field-" + outputList[i]);
        equationField.value = "";

        if(minterms.length == height) {
            equationField.value = "1";
            continue;
        } else if(minterms.length == 0) {
            equationField.value = "0";
            continue;
        }

        let currentBlock = [];  //the current block of inputs that can be written together as one prime implicant

        let nonDepend = [];     //stores the digits (inputs) that the current block does not dependant on
                                //(e.g. s1s2 is dependant on s1 and s2)
        
        let tempBlock = [];     //stores the element indicies that are going to be added to the current block if
                                //it is possible to

        let blocked = [];       //stores the input combinations that are already accounted for
                                //if the input combination truthTable[i] is accounted for or the output is 0, blocked[i]=0 
        let blockAmount = 0;
        console.log(minterms);
        for (let j = 0; j < minterms.length; j++) {
            if(blocked.includes(minterms[j])) continue;
            currentBlock = [];
            nonDepend = [];

            blocked.push(minterms[j]);
            currentBlock.push(minterms[j]);
            blockAmount++;

            for (let k = 0; k < inputList.length; k++) {
                includeK = true; //determines if block is dependant on k'th digit
                tempBlock = [];
                for (let m = 0; m < minterms.length; m++) {
                    if(currentBlock.includes(minterms[m])) {//TODO can get rid of this
                        let switchIndex;//the index obtained by switching the k'th digit of the base-2 number 
                                        //therefore finding the neighbor of minterms[m] by the k'th digit
                        let tableValue = document.querySelector(".truth-table-" + inputList[k] + minterms[m]).textContent;
                        console.log(document.querySelector(".truth-table-" + inputList[k] + minterms[m]));
                        if(tableValue == "0") {
                            switchIndex = minterms[m] + 2**(inputList.length - 1 - k);
                        } else {
                            switchIndex = minterms[m] - 2**(inputList.length - 1 - k);
                        }
                        console.log(switchIndex);
                        console.log(minterms.includes(switchIndex));
                        if(!minterms.includes(switchIndex)) {
                            
                            includeK = false;
                            console.log(includeK);
                            break;
                        }
                        tempBlock.push(switchIndex);
                    }
                    
                    
                } 
                console.log(includeK);
                if(includeK) {
                    console.log(k);
                    nonDepend.push(inputList[k]);
                    for (let m = 0; m < tempBlock.length; m++) {
                        if(!currentBlock.includes(tempBlock[m])) {
                            currentBlock.push(tempBlock[m]);
                        }
                        if(!blocked.includes(tempBlock[m])) {
                            blocked.push(tempBlock[m]);
                        }
                        blockAmount++;
                        
                    }
                }
            }
            //print the prime implicant found
            console.log(nonDepend);
            let dependsOnce = false; //the logic equation depends on at least one input
            for (let m = 0; m < inputList.length; m++) {
                if(!nonDepend.includes(inputList[m])) {
                    //depends on m'th input
                    dependsOnce = true;
                    let tableValue = document.querySelector(".truth-table-" + inputList[m] + minterms[j]).textContent;
                    console.log(document.querySelector(".truth-table-" + inputList[m] + minterms[j]).textContent);
                    if(tableValue == "0") {
                        equationField.value += "~";
                    }
                    equationField.value += inputList[m] +" ";
                }                    
            }
            equationField.value += " + ";
            
            
            
        }
        equationField.value = equationField.value.trim();
        if(equationField.value.charAt(equationField.value.length - 1) == "+") {
            equationField.value = equationField.value.substring(0,equationField.value.length - 1);
        }
        const fontSize = getTextWidth(equationField.value, getCanvasFont(equationField));
        equationField.style.width = Math.max(50, fontSize) + "px";

    }
    //SOM
    for (let i = 0; i < outputList.length; i++) {
        let SOMField = document.querySelector(".som-field-" + outputList[i]);
        SOMField.value = "";
        let minterms = SOMMap.get(outputList[i]);
        for (let j = 0; j < minterms.length; j++) {
            if(j != minterms.length - 1) {
                SOMField.value += minterms[j] + ",";
            } else {
                SOMField.value += minterms[j];
            }
        }
    }
    //truth table
    setAllZero();
    for (let i = 0; i < outputList.length; i++) {
        let minterms = SOMMap.get(outputList[i]);
        for (let j = 0; j < minterms.length; j++) {
            let element = document.querySelector(".truth-table-" + outputList[i] + minterms[j]);
            console.log(element);
            element.firstChild.value = "1";
        }
    }
}

//---------Logic Equation---------

//checks if given string is a valid boolean equation
function validBoolEq(equation) {

//todo
}

//evaluates boolean equations
function evalBoolEq() {
    for (let i = 0; i < outputList.length; i++) {
        let equation = document.querySelector(".logic-eq-field-" + outputList[i]).value;
        SOMMap.get(inputList[i]) = []; //reset SOM of ith output

    }
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

    let newSOMMap = new Map();
    for (let i = 0; i < outputList.length; i++) {
        if(SOMMap.has(outputList[i])) {
            //if ith output already exists, preserve previous SOM
            newSOMMap.set(outputList[i], SOMMap.get(outputList[i]));
            continue
        } 
        //else, assign new array for SOM and create new element
        newSOMMap.set(outputList[i], []);

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

    SOMMap = newSOMMap;
    sumOfMintermElements = document.getElementsByClassName("som-field");
    console.log(SOMMap);
    
    for (let i = 0; i < sumOfMintermElements.length; i++) {
        sumOfMintermElements[i].addEventListener("keyup", function(event) { 
            
        
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
                } else if(minterms[j] == "") {
                    valid = false;
                    break;
                }
            }
            console.log(minterms);
            console.log(valid);
            if (valid) {
                //change SOMMap
                SOMMap.set(outputList[i], []); //clear SOM of ith output
                for (let j = 0; j < minterms.length; j++) {
                    if(minterms[j] == "") {
                        continue;
                    }

                    SOMMap.get(outputList[i]).push(Number(minterms[j]));
                }
                SOMMap.get(outputList[i]).sort();
                console.log(SOMMap);


                //change logic eq and truth table
                updateFromSOM();

            }
        
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
            element.firstChild.value = "0";
        }
        
    }
}

//adds element to truth table
function addTableElement(value, name = "", height = 0, output = false) {
    liElement = document.createElement("li");
    liElement.className = "truth-table-" + name + height;//todo
    node = document.createTextNode(value);

    if(output) {
        let inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.className = "text-field table-text-field";
        inputElement.id = name + "-" + height;

        inputElement.value = value;
        liElement.appendChild(inputElement);

        inputElement.addEventListener("keyup", function(event) {
            if(inputElement.value == "1" || inputElement.value == "0") {
                //update SOM from truth table
                let done = false;
                console.log(name);
                for (let i = 0; i < SOMMap.get(name).length; i++) {
                    if(height == SOMMap.get(name)[i]) {
                        done = true;
                        if(inputElement.value == "0") {
                            SOMMap.get(name).splice(i,1);
                        }
                        break;
                    }
                    if(height < SOMMap.get(name)[i]) {
                        done = true;
                        SOMMap.get(name).splice(i, 0, height);
                        break;
                    }
                }
                if(!done) {
                    SOMMap.get(name).push(height);
                }
                updateFromSOM();
                
                  
            }
            console.log(SOMMap);
        });

    } else {
        liElement.appendChild(node);
    }

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
        //inputs
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
        //outputs
        for (let j = 0; j < outputList.length; j++) {
            //fill according to SOM
            if(SOMMap.get(outputList[j]).includes(i)) {
                addTableElement("1", outputList[j], i, true);
            } else {
                addTableElement("0", outputList[j], i, true);
            }
        }

        newLine();
    }
}

//--------Inputs/Outputs---------

function addInput() {
    if(inputText.value == "") return;
    let newInput = inputText.value.trim();
    if(inputList.includes(newInput) || outputList.includes(newInput)) return;
    if(newInput.includes(" ")) return;

    inputList.push(newInput);
    inputText.value = "";
    console.log(inputList);
    updateTruthTable();
    updateFromSOM();

}
function addOutput() {
    if(outputText.value == "") return;
    let newOutput = outputText.value.trim();
    if(inputList.includes(newOutput) || outputList.includes(newOutput)) return;
    if(newOutput.includes(" ")) return;

    outputList.push(newOutput);
    outputText.value = "";
    console.log(outputList);
    updateSOM(); //must come first since others use the SOM to update

    updateTruthTable();
    updateLogicEq();

    updateFromSOM();

    //update text field event listeners
    let textFields = document.querySelectorAll(".text-field");
    for (let i = 0; i < textFields.length; i++) {
        let textFieldElement = textFields[i];
        textFieldElement.addEventListener("keydown",function(event) {
            //setting width of text field
            const fontSize = getTextWidth(textFieldElement.value, getCanvasFont(textFieldElement));
            textFieldElement.style.width = Math.max(50, fontSize) + "px";
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

