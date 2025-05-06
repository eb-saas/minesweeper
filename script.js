const mineGrid = document.getElementById("minegrid");
const inputHeight = document.getElementById("grid_height");
const inputWidth = document.getElementById("grid_width");
const inputCellZoom = document.getElementById("cell_zoom");
const inputKeybindReveal = document.getElementById("reveal_keybind");
const inputKeybindFlag = document.getElementById("flag_keybind")
const cssRoot = document.querySelector(":root");
const inputMineCount = document.getElementById("mine_count");

var height = parseInt(inputHeight.value);
var width = parseInt(inputWidth.value);
var mineCount = parseInt(inputMineCount.value);
var cellSize = getComputedStyle(cssRoot).getPropertyValue("--cell-size");
var hoveredCol = undefined;
var hoveredRow = undefined;
var keybindReveal = inputKeybindReveal.value;
var keybindFlag = inputKeybindFlag.value;

function updateGrid() {
    mineGrid.innerHTML = "";
    let remainingMines = mineCount;

    for (let i = 0; i < height; i++) {
        let newRow = document.createElement("tr");
        newRow.setAttribute("data-row", `${i}`);

        mineGrid.appendChild(newRow);
        for (let j = 0; j < width; j++) {
            let newCell = document.createElement("td");
            let newCellIsMine = false;
            if (remainingMines > 0) {
                newCellIsMine = Math.random()<(remainingMines/(width*(height-i)-j));
                if (newCellIsMine) { remainingMines-- };
            }
            newCell.setAttribute("data-col", `${j}`);
            newCell.setAttribute("data-mine", `${newCellIsMine}`);
            newCell.setAttribute("data-flagged", "false")

            newRow.appendChild(newCell);
        };
    };

    numberGrid();
};

updateGrid();

inputHeight.addEventListener("input", () => {
    height = parseInt(inputHeight.value);
    updateGrid();
});

inputWidth.addEventListener("input", () => {
    width = parseInt(inputWidth.value);
    updateGrid();
});

inputCellZoom.value = cellSize;
inputCellZoom.addEventListener("input", () => {
    cellSize = inputCellZoom.value;
    cssRoot.style.setProperty("--cell-size", cellSize);
})

inputMineCount.addEventListener("input", () => {
    mineCount = parseInt(inputMineCount.value);
    updateGrid()
});

function selectCellCoord(selRow, selCol) {
    let currentRow = document.querySelector(`[data-row="${selRow}"]`);
    if (currentRow == null) { return false; };
    let selectedCell = currentRow.querySelector(`[data-col="${selCol}"]`);

    if (selectedCell == null) { return false; };
    return selectedCell;
}

function numberGrid() {
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            let currentCell = selectCellCoord(row, col);
            if (currentCell.getAttribute("data-mine") == "true") {
            } else {
                let surroundingMineSum = 0;

                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let adjacentCell = selectCellCoord(row+(i-1), col+(j-1));
                        if (adjacentCell == false) {
                        } else if (adjacentCell.getAttribute("data-mine") == "true") {
                            surroundingMineSum++;
                        }
                    }
                }

                currentCell.setAttribute("data-mine-sum", surroundingMineSum);
            }  
            
            currentCell.classList.add("hidden_cell");

            currentCell.addEventListener("click", () => {
                revealCell(row, col);
            })
            currentCell.addEventListener("contextmenu", () => {
                event.preventDefault();
                flagCell(row, col);
            })
        }
    }
}

function setDifficulty(newHeight, newWidth, mines) {
    inputHeight.value = newHeight;
    inputWidth.value = newWidth;
    inputMineCount.value = mines;

    height = newHeight;
    width = newWidth;
    mineCount = mines;

    updateGrid();
}

function revealCell(cellRow, cellCol) {
    clickedCell = selectCellCoord(cellRow, cellCol);
    if (clickedCell == false) { return false; };
    if (clickedCell.hasAttribute("data-clicked")) { return false; };
    if (clickedCell.getAttribute("data-flagged") == "true") { return false; };
    clickedCell.setAttribute("data-clicked", true);

    clickedCell.classList = "";

    if (clickedCell.getAttribute("data-mine") == "true") {
        clickedCell.innerText = "!";
        clickedCell.classList.add("mine");
    } else {
        cellMineSum = parseInt(clickedCell.getAttribute("data-mine-sum"));
        clickedCell.innerText = cellMineSum;
        clickedCell.classList.add("mine_"+cellMineSum);
        if (cellMineSum == 0) {
            revealCell(cellRow-1, cellCol-1);
            revealCell(cellRow, cellCol-1);
            revealCell(cellRow+1, cellCol-1);
            revealCell(cellRow-1, cellCol);
            revealCell(cellRow+1, cellCol);
            revealCell(cellRow-1, cellCol+1);
            revealCell(cellRow, cellCol+1);
            revealCell(cellRow+1, cellCol+1);
        }
    }
}


function flagCell(cellRow, cellCol) {
    clickedCell = selectCellCoord(cellRow, cellCol);
    if (clickedCell == false) { return false; };
    if (clickedCell.hasAttribute("data-clicked")) { return false; };

    if (clickedCell.getAttribute("data-flagged") == "false") {
        clickedCell.setAttribute("data-flagged", "true");
        clickedCell.innerText = "X";
        clickedCell.classList.add("flag");
    } else {
        clickedCell.setAttribute("data-flagged", "false");
        clickedCell.innerText = "";
        clickedCell.classList.remove("flag");
    }
    
}


document.addEventListener('mousemove', () => {
    console.clear();
    hoveredCol = document.elementFromPoint(event.clientX, event.clientY).getAttribute("data-col")
    hoveredRow = document.elementFromPoint(event.clientX, event.clientY).parentElement.getAttribute("data-row")
});

document.addEventListener('keydown', () => {
    if (event.key == keybindFlag) {
        flagCell(hoveredRow, hoveredCol);
    } else if (event.key == keybindReveal) {
        selectCellCoord(hoveredRow, hoveredCol).click();
    }
})