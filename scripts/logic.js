let inputList = [];
let outputList = [];

const inputText = document.querySelector(".input-field");
const inputButton = document.querySelector(".input-button");

function displayTruthTable() {
    let width = inputList.length + outputList.length;
    let height = 2**inputList.length;
    
    let liElement;
    let node;
    let truthTable = document.querySelector(".truth-table-list");

    //first row
    for (let i = 0; i < width; i++) {
        liElement = document.createElement("li");
        node = document.createTextNode(inputList[i]);
        liElement.appendChild(node);
        truthTable.appendChild(liElement);
    }
    liElement = document.createElement("li");
    liElement.className = "newline";
    node = document.createTextNode(inputList[i]);
    liElement.appendChild(node);
    truthTable.appendChild(liElement);

    //table
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
        
        }
    }
}

function addInput() {
    inputList.push(inputText.value);
    console.log(inputList);
    displayTruthTable();

}
inputButton.addEventListener("click",addInput);
