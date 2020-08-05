
/*--------------------------------------------------------------------------------------------
	DOM handlers
--------------------------------------------------------------------------------------------*/

const gameContainer = document.getElementById('gameContainer');
const board = document.querySelector('.boardTable');
const introText = document.getElementById('introText');
const optionsScreen = document.getElementById('optionsScreen');
const endMessage = document.getElementById('endMessage');

const howToPlayButton = document.getElementById('howToPlay');
const playButton = document.getElementById('playButton');
const exitButton = document.getElementById('exitButton');
const musicButton = document.getElementById('musicButton');
const attackButton = document.getElementById('AttackButton');
const deffendButton = document.getElementById('DefendButton');

var playerTurn = document.getElementById('playerTurn');

var playerOneHealth = document.getElementById('playerOneHealth');
var playerOneDamage = document.getElementById('DamagePlayerOne');
var playerTwoHealth = document.getElementById('playerTwoHealth');
var playerTwoDamage = document.getElementById('DamagePlayerTwo');
var damageSpan1 = document.getElementById('damageSpanPlayerOne');
var damageSpan2 = document.getElementById('damageSpanPlayerTwo');
var weaponSpan1 = document.querySelector('#weaponSpanPlayerOne');
var weaponSpan2 = document.querySelector('#weaponSpanPlayerTwo');

/*--------------------------------------------------------------------------------------------
	Booleans used for players movement and fight
--------------------------------------------------------------------------------------------*/

let playerOneTurn = true;
let isDeffending = false;

/*--------------------------------------------------------------------------------------------
	Function to display the options screen after 30s
--------------------------------------------------------------------------------------------*/

setTimeout(function() {
	optionsScreen.style.visibility = "visible";
}, 30000);

/*--------------------------------------------------------------------------------------------
	Function to hide the intro screen after 30s
--------------------------------------------------------------------------------------------*/

setTimeout(function() {
	introText.style.display = "none";
}, 30000);

/*--------------------------------------------------------------------------------------------
	Eventlistener to start the game when the user clicks the play game button
--------------------------------------------------------------------------------------------*/

playButton.onclick = function () {
	createBoard();
	playMusic();
	addBlocks();
    addWeapons();
    addPlayers();
	HighlightTile();
	optionsScreen.style.display = "none";
	gameContainer.style.display = "block";

}

/*--------------------------------------------------------------------------------------------
	Player object to store the players values
--------------------------------------------------------------------------------------------*/

class Player {
	constructor(name, health, weapon, damage) {
		this.name = name;
		this.health = health;
		this.weapon = weapon;
		this.damage = damage;
	}
}

/*--------------------------------------------------------------------------------------------
	Set player 1 and player 2 values
--------------------------------------------------------------------------------------------*/

let player1 = new Player('Player 1', 100, 'lasers', 5);
let player2 = new Player('Player 2', 100, 'lasers', 5);


/*--------------------------------------------------------------------------------------------
	Function to generate the game board
--------------------------------------------------------------------------------------------*/	

tableCell = [
    [], [], [], [], [], [], [], []
];
//
function createBoard() {
    for (let r = 0; r < 8; r++) {
        let row = document.createElement('tr');
        for (let c = 0; c < 8; c++) {
            let cell = document.createElement('td');
            tableCell[r][c] = cell;
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

/*--------------------------------------------------------------------------------------------
	Random number function, used to add items on the game board 
--------------------------------------------------------------------------------------------*/

function randomWholeNum() {
	return Math.floor(Math.random() * 7) + 1;
}

/*--------------------------------------------------------------------------------------------
	Function to add Weapons on the game board
--------------------------------------------------------------------------------------------*/

function addBlocks() {
    for (let i = 0; i < 10; i++) {
        let n1 = randomWholeNum();
        let n2 = randomWholeNum();
        if (!tableCell[n1][n2].hasAttribute("class")) {
			tableCell[n1][n2].classList.add('block');
        } else {
            i--;
        }
    }
}

/*--------------------------------------------------------------------------------------------
	Function to add Weapons on the game board
--------------------------------------------------------------------------------------------*/

function addWeapons() {
	for ( let i = 0; i < 5; i++) {
		let n1 = randomWholeNum();
		let n2 = randomWholeNum();
		if(!tableCell[n1][n2].hasAttribute("class")) {
			switch(i) {
				case 0:
					tableCell[n1][n2].classList.add('viper');
					break;
				case 1:
					tableCell[n1][n2].classList.add('cylonViper');
					break;
				case 2:
					tableCell[n1][n2].classList.add('ballisticRocket');
					break;
				case 3:
					tableCell[n1][n2].classList.add('nuclearRocket');
					break;
				case 4:
					tableCell[n1][n2].classList.add('missle');
					break;
			}
		} else {
			i--;
		}
	}
}

/*--------------------------------------------------------------------------------------------
	Function to add Players on the game board
--------------------------------------------------------------------------------------------*/

function addPlayers() {
    for (let i = 0; i < 2; i++) {
        let n1 = randomWholeNum();
        let n2 = randomWholeNum();
        if (!tableCell[n1][n2].hasAttribute("class")) {
            tableCell[n1][n2].classList.add('p' + (i + 1));
        } else {
            i--;
        }
        if (tableCell[n1][n2].classList.contains('p1')) {
            p1Row = n1;
            p1Col = n2;
        } else if (tableCell[n1][n2].classList.contains('p2')) {
            p2Row = n1;
            p2Col = n2;
        }
    }
}

/*--------------------------------------------------------------------------------------------
	Function for Player 1 to highlight the available/moveble tiles and to move him across the board
--------------------------------------------------------------------------------------------*/

function HighlightTile() {
	playerTurn.innerHTML = "BattleStar Galactica turn";
	var table = document.getElementById("table"), rIndex, cIndex;

	if (playerOneTurn) {
		// Table rows
		
		
		for (var i = 0; i < table.rows.length; i++) {

		// Row Cells

		for (var j = 0; j < table.rows[i].cells.length; j++) {

			// Check if the targeted row and cell contain Player 1

			if(table.rows[i].cells[j].classList.contains('p1')){
				// Highlight Player 1
				table.rows[i].cells[j].classList.add("available");
				// Highlight Tiles after clicking on p1 
				table.rows[i].cells[j].onclick = function () {

					rIndex = this.parentElement.rowIndex;
					cIndex = this.cellIndex;
					console.log("Row : " + rIndex + " , Cell : " + cIndex);

					// Check 3 rows above Player One 

					for (let i = 0; i < 4; i++) {
						if(rIndex - i >= 0 && !table.rows[rIndex - i].cells[cIndex].classList.contains('block') && !table.rows[rIndex - i].cells[cIndex].classList.contains('p2')){
							table.rows[rIndex - i].cells[cIndex].classList.add('available');
						} else {
							i = 5;
						}
					}

					// Check 3 rows bellow
					for (let i = 0; i < 4; i++) {
						if(rIndex + i <= 7 && !table.rows[rIndex + i].cells[cIndex].classList.contains('block') && !table.rows[rIndex + i].cells[cIndex].classList.contains('p2')){
							table.rows[rIndex + i].cells[cIndex].classList.add('available');
						} else {
							i = 5;
						}
					}

					// Check 3 cells left


					for (let i = 0; i < 4; i++) {
						if(cIndex - i >= 0 && !table.rows[rIndex].cells[cIndex - i].classList.contains('block') && !table.rows[rIndex].cells[cIndex - i].classList.contains('p2')){
							table.rows[rIndex].cells[cIndex - i].classList.add('available');
						} else {
							i = 5;
						}
					}

					// Check 3 cells right

					for (let i = 0; i < 4; i++) {
						if(cIndex + i <= 7 && !table.rows[rIndex].cells[cIndex + i].classList.contains('block') && !table.rows[rIndex].cells[cIndex + i].classList.contains('p2')){
							table.rows[rIndex].cells[cIndex + i].classList.add('available');
						} else {
							i = 5;
						}
					}
					HighlightTile();
				}

				// Move Player 1

			} else if (table.rows[i].cells[j].classList.contains('available')) {
				table.rows[i].cells[j].onclick = function() {
					if (this.classList.contains('available')) {
						var availables = document.querySelectorAll('.available');
						[].forEach.call(availables, function (available) {
                            // Remove 'available' class from all tiles
                            available.classList.remove('available');
                        });

						document.querySelector('.p1').classList.remove('p1');

						rIndex = this.parentElement.rowIndex;
						cIndex = this.cellIndex;

						table.rows[rIndex].cells[cIndex].classList.add('p1');

						let targetCell = table.rows[rIndex].cells[cIndex];

						if(targetCell.classList.contains('viper') || targetCell.classList.contains('cylonViper') ||
						targetCell.classList.contains('ballisticRocket') ||targetCell.classList.contains('nuclearRocket') ||
						targetCell.classList.contains('missle') || targetCell.classList.contains('lasers')) {
							pickUpWeapon(targetCell, 'p1');
						}

						// Check if player 2 is in the vicinity of Player 1
						// If Player 2 is in the vicinity, activate the fight buttons
						// Check if Player 1 is somewhere inside the furthermost rows and columns 
							if(rIndex + 1 < 8 && rIndex - 1 >= 0 && cIndex + 1 < 8 && cIndex - 1 >= 0) {
								if(table.rows[rIndex + 1].cells[cIndex].classList.contains('p2') ||
                                table.rows[rIndex - 1].cells[cIndex].classList.contains('p2') ||
                                table.rows[rIndex].cells[cIndex + 1].classList.contains('p2') ||
                                table.rows[rIndex].cells[cIndex - 1].classList.contains('p2')) {
									attackButton.style.display = "block";
									deffendButton.style.display = "block";
									PlayerTwoFight();
								} else {
									playerOneTurn = false;
									HighlightTilePlayerTwo();
								}

								//Player 1 is in the top left corner
							} else if(cIndex == 0 && rIndex == 0){
								if(table.rows[rIndex + 1].cells[cIndex].classList.contains('p2') ||
								table.rows[rIndex].cells[cIndex + 1].classList.contains('p2')) {
									attackButton.style.display = "block";
									deffendButton.style.display = "block";
									PlayerTwoFight();	
								} else {
								playerOneTurn = false;
								HighlightTilePlayerTwo();
								}
								//Player 1 is in the bottom right corner
							} else if(cIndex == 7 && rIndex == 7){
								if(table.rows[rIndex - 1].cells[cIndex].classList.contains('p2') ||
								table.rows[rIndex].cells[cIndex - 1].classList.contains('p2')) {
									attackButton.style.display = "block";
									deffendButton.style.display = "block";
									PlayerTwoFight();	
								} else {
								playerOneTurn = false;
								HighlightTilePlayerTwo();
								}
								//Player 1 is in the bottom left corner
							} else if(cIndex == 0 && rIndex == 7){
								if(table.rows[rIndex - 1].cells[cIndex].classList.contains('p2') ||
								table.rows[rIndex].cells[cIndex + 1].classList.contains('p2')) {
									attackButton.style.display = "block";
									deffendButton.style.display = "block";
									PlayerTwoFight();	
								} else {
								playerOneTurn = false;
								HighlightTilePlayerTwo();
								}
								//Player 1 is in the top right corner
							} else if(cIndex == 7 && rIndex == 0){
								if(table.rows[rIndex + 1].cells[cIndex].classList.contains('p2') ||
								table.rows[rIndex].cells[cIndex - 1].classList.contains('p2')) {
									attackButton.style.display = "block";
									deffendButton.style.display = "block";
									PlayerTwoFight();	
								} else {
								playerOneTurn = false;
								HighlightTilePlayerTwo();
								}
								//Player 1 is in the bottom row
							} else if(rIndex == 7) {
								if (
									table.rows[rIndex - 1].cells[cIndex].classList.contains('p2') ||
									table.rows[rIndex].cells[cIndex + 1].classList.contains('p2') ||
									table.rows[rIndex].cells[cIndex - 1].classList.contains('p2')) {
										attackButton.style.display = "block";
										deffendButton.style.display = "block";
										PlayerTwoFight();
								} else {
									playerOneTurn = false;
									HighlightTilePlayerTwo();
								}
								//Player 1 is in the left column
							} else if (cIndex == 0) {
								if (
									table.rows[rIndex + 1].cells[cIndex].classList.contains('p2') ||
									table.rows[rIndex - 1].cells[cIndex].classList.contains('p2') ||
									table.rows[rIndex].cells[cIndex + 1].classList.contains('p2')) {
										attackButton.style.display = "block";
										deffendButton.style.display = "block";
										PlayerTwoFight();
								} else {
									playerOneTurn = false;
									HighlightTilePlayerTwo();
								}
								//Player 1 is in the right column
							} else if(cIndex == 7) {
								if (
									table.rows[rIndex + 1].cells[cIndex].classList.contains('p2') ||
									table.rows[rIndex - 1].cells[cIndex].classList.contains('p2') ||
									table.rows[rIndex].cells[cIndex - 1].classList.contains('p2')) {
										attackButton.style.display = "block";
										deffendButton.style.display = "block";
										PlayerTwoFight();
								} else {
									playerOneTurn = false;
									HighlightTilePlayerTwo();
								}
								//Player 1 is in the top row
							} else if(rIndex == 0) {
								if (
									table.rows[rIndex + 1].cells[cIndex].classList.contains('p2') ||
									table.rows[rIndex].cells[cIndex + 1].classList.contains('p2') ||
									table.rows[rIndex].cells[cIndex - 1].classList.contains('p2')) {
										attackButton.style.display = "block";
										deffendButton.style.display = "block";
										PlayerTwoFight();
								} else {
									playerOneTurn = false;
									HighlightTilePlayerTwo();
								}
							} else {
								playerOneTurn = false;
								HighlightTilePlayerTwo();
							}
						
						}
					}
				} 
			} 
		}
	} else {
		HighlightTilePlayerTwo();
	}
} 

/*--------------------------------------------------------------------------------------------
	Function for Player 2 to highlight the available/moveble tiles and to move him across the board
--------------------------------------------------------------------------------------------*/

function HighlightTilePlayerTwo() {
	playerTurn.innerHTML = "Cylon Basestar turn";
	var table = document.getElementById("table"), rIndex, cIndex;

	// Table rows

	for (var i = 0; i < table.rows.length; i++) {
		
		// Row Cells

		for (var j = 0; j < table.rows[i].cells.length; j++) {

			// Check if the targeted row and cell contain Player 2

			if(table.rows[i].cells[j].classList.contains('p2')){
				// Highlight Player 2
				table.rows[i].cells[j].classList.add("available");
				// Highlight Tiles after clicking on p2 
				table.rows[i].cells[j].onclick = function () {

					rIndex = this.parentElement.rowIndex;
					cIndex = this.cellIndex;
					console.log("Row : " + rIndex + " , Cell : " + cIndex);

					// Check 3 rows above  

					for (let i = 0; i < 4; i++) {
						if(rIndex - i >= 0 && !table.rows[rIndex - i].cells[cIndex].classList.contains('block') && !table.rows[rIndex - i].cells[cIndex].classList.contains('p1')){
							table.rows[rIndex - i].cells[cIndex].classList.add('available');
						} else {
							i = 5;
						}
					}

					// Check 3 rows bellow
					for (let i = 0; i < 4; i++) {
						if(rIndex + i <= 7 && !table.rows[rIndex + i].cells[cIndex].classList.contains('block') && !table.rows[rIndex + i].cells[cIndex].classList.contains('p1')){
							table.rows[rIndex + i].cells[cIndex].classList.add('available');
						} else {
							i = 5;
						}
					}

					// Check 3 cells left


					for (let i = 0; i < 4; i++) {
						if(cIndex - i >= 0 && !table.rows[rIndex].cells[cIndex - i].classList.contains('block') && !table.rows[rIndex].cells[cIndex - i].classList.contains('p1')){
							table.rows[rIndex].cells[cIndex - i].classList.add('available');
						} else {
							i = 5;
						}
					}

					// Check 3 cells right

					for (let i = 0; i < 4; i++) {
						if(cIndex + i <= 7 && !table.rows[rIndex].cells[cIndex + i].classList.contains('block') && !table.rows[rIndex].cells[cIndex + i].classList.contains('p1')){
							table.rows[rIndex].cells[cIndex + i].classList.add('available');
						} else {
							i = 5;
						}
					}
					HighlightTilePlayerTwo();
				}

				// Move Player 2

			} else if (table.rows[i].cells[j].classList.contains('available')) {
				table.rows[i].cells[j].onclick = function() {
					if (this.classList.contains('available')) {
						var availables = document.querySelectorAll('.available');
						[].forEach.call(availables, function (available) {
                            // Remove 'available' class from all tiles
                            available.classList.remove('available');
                        });

						document.querySelector('.p2').classList.remove('p2');

						rIndex = this.parentElement.rowIndex;
						cIndex = this.cellIndex;

						table.rows[rIndex].cells[cIndex].classList.add('p2');

						let targetCell = table.rows[rIndex].cells[cIndex];

						if(targetCell.classList.contains('viper') || targetCell.classList.contains('cylonViper') ||
						targetCell.classList.contains('ballisticRocket') ||targetCell.classList.contains('nuclearRocket') ||
						targetCell.classList.contains('missle') || targetCell.classList.contains('lasers')){
							pickUpWeapon(targetCell, 'p2');
						}
						
						// Check if Player 1 is in the vicinity of Player 2
						// If Player 1 is in the vicinity, activate the fight buttons
						// Check if Player 2 is somewhere inside the furthermost rows and columns
						if(rIndex + 1 < 8 && rIndex - 1 >= 0 && cIndex + 1 < 8 && cIndex - 1 >= 0) {
							if(table.rows[rIndex + 1].cells[cIndex].classList.contains('p1') ||
							table.rows[rIndex - 1].cells[cIndex].classList.contains('p1') ||
							table.rows[rIndex].cells[cIndex + 1].classList.contains('p1') ||
							table.rows[rIndex].cells[cIndex - 1].classList.contains('p1')) {
								attackButton.style.display = "block";
								deffendButton.style.display = "block";
								PlayerOneFight();
							} else {
								playerOneTurn = true;
								HighlightTile();
							}
							//Player 2 is in the top left corner
						} else if(cIndex == 0 && rIndex == 0){
							if(table.rows[rIndex + 1].cells[cIndex].classList.contains('p1') ||
							table.rows[rIndex].cells[cIndex + 1].classList.contains('p1')) {
								attackButton.style.display = "block";
								deffendButton.style.display = "block";
								PlayerOneFight();	
							} else {
								playerOneTurn = true;
								HighlightTile();
							}
							//Player 2 is in the bottom right corner
						} else if(cIndex == 7 && rIndex == 7){
							if(table.rows[rIndex - 1].cells[cIndex].classList.contains('p2') ||
							table.rows[rIndex].cells[cIndex - 1].classList.contains('p2')) {
								attackButton.style.display = "block";
								deffendButton.style.display = "block";
								PlayerOneFight();	
							} else {
								playerOneTurn = true;
								HighlightTile();
							}
							//Player 2 is in the bottom left corner
						} else if(cIndex == 0 && rIndex == 7){
							if(table.rows[rIndex - 1].cells[cIndex].classList.contains('p2') ||
							table.rows[rIndex].cells[cIndex + 1].classList.contains('p2')) {
								attackButton.style.display = "block";
								deffendButton.style.display = "block";
								PlayerOneFight();	
							} else {
								playerOneTurn = true;
								HighlightTile();
							}
							//Player 2 is in the top right corner
						} else if(cIndex == 7 && rIndex == 0){
							if(table.rows[rIndex + 1].cells[cIndex].classList.contains('p2') ||
							table.rows[rIndex].cells[cIndex - 1].classList.contains('p2')) {
								attackButton.style.display = "block";
								deffendButton.style.display = "block";
								PlayerOneFight();	
							} else {
								playerOneTurn = true;
								HighlightTile();
							} 
							//Player 2 is in the top row
						} else if(rIndex == 0) {
							if (
								table.rows[rIndex + 1].cells[cIndex].classList.contains('p1') ||
								table.rows[rIndex].cells[cIndex + 1].classList.contains('p1') ||
								table.rows[rIndex].cells[cIndex - 1].classList.contains('p1')) {
									attackButton.style.display = "block";
									deffendButton.style.display = "block";
									PlayerOneFight();
							} else {
								playerOneTurn = true;
								HighlightTile();
							}
							//Player 2 is in the bottom row
						} else if(rIndex == 7) {
							if (
								table.rows[rIndex - 1].cells[cIndex].classList.contains('p1') ||
								table.rows[rIndex].cells[cIndex + 1].classList.contains('p1') ||
								table.rows[rIndex].cells[cIndex - 1].classList.contains('p1')) {
									attackButton.style.display = "block";
									deffendButton.style.display = "block";
									PlayerOneFight();
							} else {
								playerOneTurn = true;
								HighlightTile();
							}
							//Player 2 is in the left column
						} else if (cIndex == 0) {
							if (
								table.rows[rIndex + 1].cells[cIndex].classList.contains('p1') ||
								table.rows[rIndex - 1].cells[cIndex].classList.contains('p1') ||
								table.rows[rIndex].cells[cIndex + 1].classList.contains('p1')) {
									attackButton.style.display = "block";
									deffendButton.style.display = "block";
									PlayerOneFight();
							} else {
								playerOneTurn = true;
								HighlightTile();
							}
							//Player 2 is in the right column
						} else if(cIndex == 7) {
							if (
								table.rows[rIndex + 1].cells[cIndex].classList.contains('p1') ||
								table.rows[rIndex - 1].cells[cIndex].classList.contains('p1') ||
								table.rows[rIndex].cells[cIndex - 1].classList.contains('p1')) {
									attackButton.style.display = "block";
									deffendButton.style.display = "block";
									PlayerOneFight()
							} else {
								playerOneTurn = true;
								HighlightTile();
							}
						} else {
							playerOneTurn = false;
							HighlightTilePlayerTwo();
						}				
					}
				}
			}
		}
	}
}

/*--------------------------------------------------------------------------------------------
	Function for Player 1 to initiate damage to player one, only if both of them have damage value greater than 0
--------------------------------------------------------------------------------------------*/

function PlayerOneFight() {

	if(player1.damage == 0 && player2.damage == 0) {
		HighlightTile();
	} else {

		const health = document.getElementById('playerTwoHealth');
		playerTurn.innerHTML = "BattleStar Gallactica fight";
		// If Player 1 health is 0 or less end the game
		if(player1.health <= 0){
			gameContainer.style.display = "none";
			endMessage.style.visibility = "visible";
			endMessage.innerHTML = "Cylon BaseStar CONQUERED the galaxy!";
		}
		if(player1.health > 0 && player2.health > 0) {
			attackButton.onclick = function () {
				// If Player 2 is defending reduce Player 1 damage by 50%
				if(isDeffending) {
					player2.health -= player1.damage/2;
					isDeffending = false;
				} else {
					player2.health -= player1.damage;
				}
				health.value = player2.health;
				PlayerTwoFight();
			}
			deffendButton.onclick = function () {
				isDeffending = true;
				PlayerTwoFight();
			}
		}
	}
}

/*--------------------------------------------------------------------------------------------
	Function for Player 2 to initiate damage to player one, only if both of them have damage value greater than 0	
--------------------------------------------------------------------------------------------*/

function PlayerTwoFight() {

	if(player1.damage == 0 && player2.damage == 0) {
		HighlightTilePlayerTwo();
	} else {
		
		const health = document.getElementById('playerOneHealth');
		playerTurn.innerHTML = "Cylon Basestar fight";
		// If Player 2 health is 0 or less end the game
		if(player2.health <= 0){
			gameContainer.style.display = "none";
			endMessage.style.visibility = "visible";
			endMessage.innerHTML = "BattleStar Galactica CONQUERED the galaxy!";
		}
		if(player1.health > 0 && player2.health > 0) {
			attackButton.onclick = function () {
				// If Player 1 is defending reduce Player 2 damage by 50%
				if(isDeffending) {
					player1.health -= player2.damage / 2;
					isDeffending = false;
				} else {
					player1.health -= player2.damage;
				}
				health.value = player1.health;
				PlayerOneFight();
			}
			deffendButton.onclick = function () {
				isDeffending = true;
				PlayerOneFight();
			}
		}
	}
}

/*--------------------------------------------------------------------------------------------
	Display the initial weapon of player 1 and player 2
--------------------------------------------------------------------------------------------*/

weaponSpan1.innerHTML = player1.weapon;
weaponSpan2.innerHTML = player2.weapon;

/*--------------------------------------------------------------------------------------------
	Function to pick up weapons from the game board. Function's parameters are , targetCell(the cell that the user clicks on and the p(this can be either player 1 or player 2))
--------------------------------------------------------------------------------------------*/

function pickUpWeapon(targetCell, p) {
	if (p == 'p1') {
		if(player1.weapon == "Lasers") {
			targetCell.className == p;
			targetCell.classList.add(player1.weapon);
			player1.weapon = targetCell.className.split(" ")[0];
			setDamage(player1.weapon, 'player1');
			weaponTemp1 = player1.weapon;
			weaponSpan1.innerHTML = player1.weapon;
			targetCell.classList.remove(player1.weapon);
		} else {
			targetCell.className == p;
			targetCell.classList.add(player1.weapon);
			weaponTemp1 = player1.weapon;
			player1.weapon = targetCell.className.split(" ")[0];
			setDamage(player1.weapon, 'player1');
			weaponSpan1.innerHTML = player1.weapon;
			targetCell.classList.remove(player1.weapon);
		}
	} else if(p == 'p2'){
		if(player2.weapon == "Lasers") {
			targetCell.className == p;
			targetCell.classList.add(player2.weapon);
			player2.weapon = targetCell.className.split(" ")[0];
			setDamage(player2.weapon, 'player2');
			weaponTemp2 = player2.weapon;
			weaponSpan2.innerHTML = player2.weapon;
			targetCell.classList.remove(player2.weapon);
		} else  {
			targetCell.className == p;
			targetCell.classList.add(player2.weapon);
			weaponTemp2 = player2.weapon;
			player2.weapon = targetCell.className.split(" ")[0];
			setDamage(player2.weapon, 'player2');
			weaponSpan2.innerHTML = player2.weapon;
			targetCell.classList.remove(player2.weapon);
		}
	}
}

/*--------------------------------------------------------------------------------------------
	Display the initial damage amount of player 1 and player 2
--------------------------------------------------------------------------------------------*/

damageSpan1.innerHTML = player1.damage;
damageSpan2.innerHTML = player2.damage;

/*--------------------------------------------------------------------------------------------
	Set the damage amount for the different weapons
--------------------------------------------------------------------------------------------*/

function setDamage(weapon, player) {
	switch(weapon) {
		case 'viper':
			eval(player).damage = 10;
			break;
		case 'cylonViper':
			eval(player).damage = 10;
			break;
		case 'ballisticRocket':
			eval(player).damage = 15;
			break;
		case 'missle':
			eval(player).damage = 15;
			break;
		case 'nuclearRocket':
			eval(player).damage = 20;
			break;
		case 'lasers':
			eval(player).damage = 5;
			break;
	}



	if(player == 'player1') {
		damageSpan1.innerHTML = eval(player).damage;
	} else {
		damageSpan2.innerHTML = eval(player).damage;
	}
}

/*--------------------------------------------------------------------------------------------
	If the user clicks the Exit button, hide everything and display the Exit message.
--------------------------------------------------------------------------------------------*/

exitButton.onclick = function () {
	optionsScreen.style.display = "none";
	endMessage.style.visibility = "visible";
	endMessage.innerHTML = "Thank you for visiting my game! I hope to see you soon!";
}

/*--------------------------------------------------------------------------------------------
	Function to play music in the background
--------------------------------------------------------------------------------------------*/

function playMusic() {
    myMusic = new sound("Audio/interstellar.mp3");

    myMusic.sound.setAttribute("loop", "true");
    myMusic.play();


    var myAudio = document.getElementById("myAudio");
    musicButton.addEventListener('click', (event) => {
        if (!myAudio.paused) {
			myAudio.pause();
            musicButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
			myAudio.play();
            musicButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.setAttribute("id", "myAudio");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}
