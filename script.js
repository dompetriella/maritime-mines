const grid = document.querySelector('.mine-grid');
let height = 10
let width = 10
let totalTiles = (width*height)
let minesNumber = parseInt((width*height)*(1/5));
let tiles = [];
let flags = minesNumber;
let successfulFlags = 0;
let tilesClicked = 0;
let gameOverStatus = false;

// globals for the grid width and height
// could be easily changed to allow for more tiles/harder difficulty
function setGlobals() {
    let screenWidth = screen.width;
    console.log(screenWidth)
    if (screenWidth < 600) {
        width = 8
        height = 12
        totalTiles = (width*height)
        minesNumber = parseInt((width*height)*(1/5));
    }

}

//shows the number of mines and total number of flags
function generateHUD() {
    const minesCount = document.querySelector('.mines-count')
    minesCount.textContent = "🚨 " + minesNumber

    const flagsCount = document.querySelector('.flags-count')
    flagsCount.textContent = '🚩 ' + flags
}

function setFlags() {
    const setFlagsCount = document.querySelector('.flags-count')
    setFlagsCount.textContent = '🚩 ' + flags
}

// gets the number of nearby mines when a tile is pressed
function totalNearbyMines(i) {
    let totalNearbyMines = 0;
    const isLeftEdge = (i % width === 0)
    const isRightEdge = (i % width === width - 1)
    const isTop = i >= 0 && i < width ? true : false;
    const isBottom = i >= (width*height)-width && (width*height)-1 ? true : false;

    //left
    if(!isLeftEdge && tiles[i-1].classList.contains('mine')) totalNearbyMines++
    //right
    if(!isRightEdge && tiles[i+1].classList.contains('mine')) totalNearbyMines++

    if (!isTop) {
        //up
        if(tiles[i-width].classList.contains('mine')) totalNearbyMines++
        //up-right
        if(!isRightEdge && tiles[(i-width) + 1].classList.contains('mine')) totalNearbyMines++
        //up-left
        if(!isLeftEdge && tiles[(i-width) - 1].classList.contains('mine')) totalNearbyMines++
    }

    if (!isBottom) {
        //down
        if(tiles[i+width].classList.contains('mine')) totalNearbyMines++
        //down-right
        if(!isRightEdge && tiles[(i+width) + 1].classList.contains('mine')) totalNearbyMines++
        //down-left
        if(!isLeftEdge && tiles[(i+width) - 1].classList.contains('mine')) totalNearbyMines++
    }
    

    return totalNearbyMines
}

// checks to see if a nearby tile has a mine
// if the tile is blank, recurse to that tile and do the same
function recurseTiles(tile) {
    const tileID = parseInt(tile.id)
    const isLeftEdge = (tileID % width === 0)
    const isRightEdge = (tileID % width === width - 1)
    const isTop = tileID >= 0 && tileID < width ? true : false;
    const isBottom = tileID >= (width*height)-width && (width*height)-1 ? true : false;

    setTimeout(() => {
        //left
        if (!isLeftEdge && !tiles[tileID-1].classList.contains('clicked')) {
            const newID = tiles[parseInt(tileID)-1].id
            const newTile = document.getElementById(newID)
            click(newTile)
        }

        //right
        if (!isRightEdge && !tiles[tileID+1].classList.contains('clicked')) {
            const newID = tiles[parseInt(tileID)+1].id
            const newTile = document.getElementById(newID)
            click(newTile)
        }
    

        if (!isTop) {
            //up
            if (!tiles[tileID-width].classList.contains('clicked')) {
                const newID = tiles[parseInt(tileID-width)].id
                const newTile = document.getElementById(newID)
                click(newTile)
            }

            //up-right
            if (!isRightEdge && !tiles[(tileID-width) + 1].classList.contains('clicked')) {
                const newID = tiles[parseInt((tileID-width) + 1)].id
                const newTile = document.getElementById(newID)
                click(newTile)
            }
            
            //up-left
            if(!isLeftEdge && !tiles[(tileID-width) - 1].classList.contains('clicked')) {
                const newID = tiles[parseInt((tileID-width) - 1)].id
                const newTile = document.getElementById(newID)
                click(newTile)
            }
        }

        if (!isBottom) {
            //down
            if (!tiles[tileID+width].classList.contains('clicked')) {
                const newID = tiles[parseInt(tileID+width)].id
                const newTile = document.getElementById(newID)
                click(newTile)
            }

            if (!isRightEdge && !tiles[(tileID+width) + 1].classList.contains('clicked')) {
                const newID = tiles[parseInt((tileID+width) + 1)].id
                const newTile = document.getElementById(newID)
                click(newTile)
            }

            if (!isLeftEdge && !tiles[(tileID+width) - 1].classList.contains('clicked')) {
                const newID = tiles[parseInt((tileID+width) - 1)].id
                const newTile = document.getElementById(newID)
                click(newTile)
            }
        }

    }, 5)
}


//"renders" a splash screen (game over, you win, etc)
// then adds it to the DOM
// also moves other splash screens to behind the background atm (zIndex -1)
function renderSplashScreen(message, querySelector) {

    const splashQuery = document.querySelector(querySelector)

    const splashDiv = document.createElement('div')
    splashDiv.textContent = message

    const splashButtons = document.createElement('div')
    splashButtons.classList.add("splash-buttons")

        const retryButton = document.createElement('div')
        retryButton.classList.add("retry", "button")
        retryButton.setAttribute('id', "retry-button")
        retryButton.textContent = "Play Again"

        switch(message) {
            case "Game Over":
                retryButton.addEventListener('click', () => {
                    mountGameOver(false)
                    createBoard()
                })
                break;
            case "You Won!":
                retryButton.addEventListener('click', () => {
                    mountWin(false)
                    createBoard()
                })
                break;
            }

        const mainMenuButton = document.createElement('div')
        mainMenuButton.classList.add("main-menu", "button")
        mainMenuButton.setAttribute('id', "main-menu-button")
        mainMenuButton.textContent = "Main Menu"


    splashQuery.appendChild(splashDiv)
    splashQuery.appendChild(splashButtons)
    splashButtons.appendChild(retryButton)
    //splashButtons.appendChild(mainMenuButton)
    
}

// puts a splash screen at the front (zIndex 99) or back (zIndex -1), depending on situation
// the better move would be delete them from the DOM, but this is faster lol
function mountGameOver(mode) {
    if (mode) {
        document.getElementById("game-over-screen").style.zIndex = "99"
        document.getElementById("winning-screen").style.zIndex = "-1"
        document.getElementById("mine-grid").style.zIndex = "-1"
    }
    else {
        document.getElementById("game-over-screen").style.zIndex = "-1"
        document.getElementById("mine-grid").style.zIndex = "99"
    }
}

function mountWin(mode) {
    if (mode) {
        document.getElementById("winning-screen").style.zIndex = "99"
        document.getElementById("game-over-screen").style.zIndex = "-1"
        document.getElementById("mine-grid").style.zIndex = "-1"
    }
    else {
        document.getElementById("winning-screen").style.zIndex = "-1"
        document.getElementById("mine-grid").style.zIndex = "99"
    }
}


function deleteBoard() {
    const grid = document.querySelector('.mine-grid');
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    tiles = []
}

function restartGame() {
    successfulFlags = 0
    tilesClicked = 0;
    flags = minesNumber;
    setFlags()
}

// Durstenfeld shuffle for randomizing mines
function shuffleArray(inputArray) {
   for (let i = inputArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [inputArray[i], inputArray[j]] = [inputArray[j], inputArray[i]];
    }
    return inputArray

}

function createBoard() {
    deleteBoard()
    restartGame()
    const minesArray = Array(minesNumber).fill('mine')
    const emptyArray = Array(totalTiles - minesNumber).fill('space')
    const gameArray = [...minesArray, ...emptyArray]
    const gameArrayShuffled = shuffleArray(gameArray)

    for(let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div')
        tile.classList.add("tile")
        tile.setAttribute('id', i)
        tile.classList.add(gameArrayShuffled[i])
        grid.appendChild(tile)
        tiles.push(tile)

        tile.addEventListener('click', () => {
            click(tile)
        })

        tile.addEventListener('contextmenu', (e) => {
            flag(tile)
            e.preventDefault();
            return false
        }, false)
    }

    for (let i = 0; i < tiles.length; i++) {
        let nearbyMines = 0

        if (tiles[i].classList.contains('space')) {

            tiles[i].setAttribute('nearbyMines', totalNearbyMines(i))
        }
    }
}

function gameOver() {
    gameOverStatus = true
    successfulFlags = 0
    tilesClicked = 0;
    flags = minesNumber;
    setFlags()
    mountGameOver(gameOver)
}

function click(tile) {

    if (!tile.classList.contains("clicked")) tilesClicked++

    if (tile.classList.contains('mine')) {
        gameOver()
        
    }
    else {

        let total = tile.getAttribute('nearbyMines')
        if (total != 0) {
            // adds to css class for this item "clicked"
            tile.classList.add('clicked')
            tile.textContent = total

        if (tilesClicked >= (totalTiles-minesNumber)) {
            mountWin(true)
        }
        
        return
        }

        tile.classList.add('clicked')
        recurseTiles(tile)
    }


}

function flag(tile) {
    if (flags => 0) {
        if (tile.classList.contains('flagged')) {
            tile.classList.remove("flagged")
            tile.textContent = ''
            if (tile.classList.contains('mine')) {
                successfulFlags--
            }
            flags++
            setFlags()


        }

        else {
            tile.classList.add("flagged")
            tile.textContent = '🚩'
            flags--
            setFlags()
            let flagsCount = () => {
                document.getElementById('flags-count').textContent = '🚩 ' + flags
            }

            if (tile.classList.contains('mine')) {
                successfulFlags++
            }
        }

        if (successfulFlags === minesNumber) {
            mountWin(true)
        }
    }
}

function startGame() {
    setGlobals()
    createBoard()
    generateHUD()
    renderSplashScreen("Game Over",".game-over-screen")
    renderSplashScreen("You Won!",".winning-screen")
    document.getElementById("start-screen-container").style.zIndex = "-1"
    document.getElementById("start-screen").style.zIndex = "-1"  
    document.getElementById("back-button").style.zIndex = "" 
}