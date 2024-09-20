let draggedDisk = null;
let moveCount = 0;
const maxMoves = 15;

// Function to allow dropping
function allowDrop(event) {
    event.preventDefault();
}

// Function to handle dragging
function drag(event) {
    draggedDisk = event.target;
}

// Function to handle dropping
function drop(event) {
    event.preventDefault();

    const tower = event.currentTarget;
    const lastDisk = tower.querySelector('.disk:last-child');

    const draggedDiskWidth = parseInt(window.getComputedStyle(draggedDisk).width);
    const lastDiskWidth = lastDisk ? parseInt(window.getComputedStyle(lastDisk).width) : Infinity;

    // Check if the move is valid (smaller disk on a larger one or empty tower)
    if (!lastDisk || draggedDiskWidth < lastDiskWidth) {
        tower.appendChild(draggedDisk);
        moveCount++;
        document.getElementById('moveCount').textContent = moveCount;

        // After moving, update which disks are draggable
        updateDraggableDisks();

        if (moveCount === maxMoves) {
            checkWin();
        } else if (moveCount > maxMoves) {
            document.getElementById('status').textContent = "You exceeded the optimal number of moves!";
        }
    } else {
        alert("Invalid move!");
    }
}

// Function to check win condition
function checkWin() {
    const tower3 = document.getElementById('tower3');
    if (tower3.children.length === 4) {
        document.getElementById('status').textContent = "Congratulations! You solved the Tower of Hanoi in the optimal number of moves! Proceeding to the next stage in 5 seconds.";
        setTimeout(function () {
            const nextStageAnchor = document.createElement("a");
            fetch("/update-stage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ curStage: "8" }),
            })
                .then((res) => res.json())
                .then(console.log("Stage Updated"));
            nextStageAnchor.href = "/stage9";
            nextStageAnchor.style = "display: none;";
            document.body.appendChild(nextStageAnchor);
            nextStageAnchor.click();
        }, 5000);
    } else {
        document.getElementById('status').textContent = "You reached the maximum number of moves, but the puzzle is not solved! Try Again.";
    }
}

// Function to update which disks are draggable (only the topmost disk of each tower)
function updateDraggableDisks() {
    // Disable dragging for all disks first
    const allDisks = document.querySelectorAll('.disk');
    allDisks.forEach(disk => disk.setAttribute('draggable', 'false'));

    // Enable dragging for the top disk of each tower
    const towers = document.querySelectorAll('.tower');
    towers.forEach(tower => {
        const topDisk = tower.querySelector('.disk:last-child');
        if (topDisk) {
            topDisk.setAttribute('draggable', 'true');
        }
    });

    // Specifically for tower1 (the first tower), only the top disk should be draggable
    const tower1 = document.getElementById('tower1');
    const topDiskInTower1 = tower1.querySelector('.disk:last-child');
    if (topDiskInTower1) {
        topDiskInTower1.setAttribute('draggable', 'true');
    }
}

// Initialize draggable state when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDraggableDisks();
});
