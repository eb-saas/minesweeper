const mineGrid = document.getElementById("minegrid");
const inputHeight = document.getElementById("grid_height");
const inputWidth = document.getElementById("grid_width");
const inputCellZoom = document.getElementById("cell_zoom")
const cssRoot = document.querySelector(":root");

var height = parseInt(inputHeight.value);
var width = parseInt(inputWidth.value);
var cellSize = getComputedStyle(cssRoot).getPropertyValue("--cell-size");

function resizeGrid() {
    mineGrid.innerHTML = "";
    for (let i = 0; i < height; i++) {
        let newRow = document.createElement("tr");
        newRow.setAttribute("data-row", `${i}`);

        mineGrid.appendChild(newRow);
        for (let j = 0; j < width; j++) {
            let newCell = document.createElement("td");
            let newCellIsMine = Math.random()<50/(height*width); //Need a better way to spefify how may mines are in the grid
            newCell.setAttribute("data-col", `${j}`);
            newCell.setAttribute("data-mine", `${newCellIsMine}`);

            if (newCellIsMine) {
                newCell.innerText = "!"
            }

            newRow.appendChild(newCell);
        };
    };
};

resizeGrid();

inputHeight.addEventListener("input", () => {
    height = parseInt(inputHeight.value);
    resizeGrid();
});

inputWidth.addEventListener("input", () => {
    width = parseInt(inputWidth.value);
    resizeGrid();
});

inputCellZoom.value = cellSize;
inputCellZoom.addEventListener("input", () => {
    cellSize = inputCellZoom.value;
    cssRoot.style.setProperty("--cell-size", cellSize);
})

function selectCellCoord(selRow, selCol) {
    let currentRow = document.querySelector(`[data-row="${selRow}"]`);
    let selectedCell = currentRow.querySelector(`[data-col="${selCol}"]`);

    if (selectedCell == null) { return false; };
    return selectedCell;
}

function numberGrid() {
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            let currentCell = selectCellCoord(row, col);
            if (currentCell.getAttribute("data-mine") == "true") {
                currentCell.style.backgroundColor = "red";
            } else {
                let surroundingMineSum = 0;

                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let adjacentCell = selectCellCoord(row+(i-1), col+(j-1));
                        if (adjacentCell == false) {
                            break;
                        } else if (adjacentCell.getAttribute("data-mine") == "true") {
                            surroundingMineSum++;
                        }
                    }
                }

                currentCell.innerText = surroundingMineSum;
                currentCell.classList.add("mine_"+surroundingMineSum)
            }            
        }
    }
}