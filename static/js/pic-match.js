let images = [];
class Elements {
  constructor() {
    this.puzzle = document.querySelector('.puzzle')
    this.cellsAmount = 20
    this.puzzleDivs = []
    this.draggableDivs = []
    this.cells = document.querySelector('.cells')
    this.modal = document.querySelector('.modal')
    this.modalText = document.querySelector('.modal-text')
    this.modalBtn = document.querySelector('.modal-btn')
    this.attempt = document.querySelector('.attempt')
    this.finalImg = document.querySelector('.final-img')
    this.inputFile = document.getElementById('input-file')
    this.loader = document.querySelector('.loader')
    this.randomBtn = document.querySelector('.random-btn')
    this.createElments()
  }

  createElments() {
    for (let index = 0; index < this.cellsAmount; index++) {
      const puzzleDiv = document.createElement('div')
      puzzleDiv.setAttribute('data-index', index)
      this.puzzle.append(puzzleDiv)
      this.puzzleDivs.push(puzzleDiv)

      const draggableDiv = document.createElement('div')
      draggableDiv.setAttribute('data-index', index)
      draggableDiv.setAttribute('draggable', true)
      this.draggableDivs.push(draggableDiv)
    }
  }
}

async function fetchImages() {
  try {
    const response = await fetch("/fetch-picmatch-images");
    const data = await response.json();
    images = [...data];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


class PositionElements {
  constructor() {
    this.elements = new Elements()
    this.leftPositions = [0, 8, 16, 24, 32]
    this.topPositions = [0, 6, 12, 18]
    this.addDraggableDivs()
  }

  shuffle(array) {
    return array.sort(() => Math.random() - 0.5)
  }

  shufflePositions() {
    return this.shuffle(this.leftPositions)
      .map((leftPosition) => {
        return this.shuffle(this.topPositions).map((topPosition) => [leftPosition, topPosition])
      })
      .reduce((positions, item) => [...positions, ...item])
  }

  bgPositions() {
    return this.topPositions
      .map((topPosition) => {
        return this.leftPositions.map((leftPosition) => [topPosition, leftPosition])
      })
      .reduce((positions, item) => [...positions, ...item])
  }

  async addDraggableDivs() {
    await fetchImages();
    const { cells, draggableDivs, finalImg, loader, randomBtn } = this.elements;
    loader.classList.add('active');
    loader.classList.remove('active');
    const imageUrl = images[Math.floor(Math.random() * 16)]["image"];
    console.log(imageUrl);
    finalImg.style.backgroundImage = `url(${imageUrl})`

    const bgPositions = this.bgPositions()
    const shufflePositions = this.shufflePositions()

    draggableDivs.forEach((div, i) => {
      div.style.backgroundImage = `url(${imageUrl})`
      cells.append(div)
      div.style.backgroundPosition = `-${bgPositions[i][1]}vw -${bgPositions[i][0]}vw`
      div.style.left = `${shufflePositions[i][0]}vw`
      div.style.top = `${shufflePositions[i][1]}vw`
    })
    randomBtn.onclick = () => location.reload()
  }
}

class DragDrop {
  constructor() {
    this.positionElements = new PositionElements()
    this.selected = 0
    this.dragDropEvents()
    this.points = { correct: 0, wrong: 0 }
  }
  dragDropEvents() {
    const { draggableDivs, puzzleDivs, modal, modalText, modalBtn, attempt, cellsAmount } =
      this.positionElements.elements

    draggableDivs.forEach((draggableDiv, i) => {
      draggableDiv.addEventListener('dragstart', (e) => {
        this.selected = e.target
        console.log('dragstart')
      })
      puzzleDivs[i].addEventListener('dragover', (e) => {
        e.preventDefault()
        console.log('dragover')
      })
      puzzleDivs[i].addEventListener('drop', () => {
        if (puzzleDivs[i].children.length === 0) {
          this.selected.style.top = 0
          this.selected.style.left = 0
          this.selected.style.border = 'none'
          puzzleDivs[i].append(this.selected)

          if (this.selected.dataset.index === puzzleDivs[i].dataset.index) {
            this.points.correct = 0
            puzzleDivs.forEach((div) => {
              div.firstElementChild &&
                div.dataset.index === div.firstElementChild.dataset.index &&
                this.points.correct++
            })
          } else {
            this.points.wrong++
          }
          console.log(this.points)

          if (this.points.correct === cellsAmount && this.points.wrong < 50) {
            modal.style.cssText = 'opacity: 1; visibility: visible;'
            attempt.textContent = this.points.wrong
            modalBtn.onclick = () => location.reload()
            setTimeout(() => {
              fetch("/update-stage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ curStage: "9" }),
              })
                .then((res) => res.json())
                .then(console.log("Stage Updated"));
              alert("You Win! Oh my O! Take it and Go. Leaving to the next stage in 5 seconds.")
              const nextStageAnchor = document.createElement("a");
              nextStageAnchor.href = "/stage10";
              nextStageAnchor.style = "display: none;";
              document.body.appendChild(nextStageAnchor);
              nextStageAnchor.click();
            }, 5000);
          }
          if (this.points.correct === cellsAmount && this.points.wrong > 50) {
            modal.style.cssText = 'opacity: 1; visibility: visible;'
            modalText.textContent = 'You took too Many Wrong Attempts. Please Try Again.'
            modalBtn.onclick = () => location.reload()
          }

          const found = puzzleDivs.find((div) => !div.firstElementChild)
          if (!found && this.points.correct < cellsAmount) {
            modal.style.cssText = 'opacity: 1; visibility: visible;'
            modalText.textContent = 'You Lost. Please Try Again'
            modalBtn.onclick = () => location.reload()
          }
        }
      })
      puzzleDivs[i].addEventListener('dragenter', (e) => {
        puzzleDivs[i].classList.add('active')
      })
      puzzleDivs[i].addEventListener('dragleave', (e) => {
        console.log('leave')
        puzzleDivs[i].classList.remove('active')
      })
    })
  }
}

new DragDrop();