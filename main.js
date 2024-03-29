"use strict";
let currentPlayer;
let [playerOneTotalScore, playerTwoTotalScore, currentScores, activePlayer] = [0, 0, 0, 0];
const switchPlayer = (change) => {
	const playerOneBackground = document.querySelector(".player-section-one");
	const playerTwoBackground = document.querySelector(".player-section-two");
	const playerOneScore = document.querySelector(".score-player-one");
	const playerTwoScore = document.querySelector(".score-player-two");

	if (change) {
		playerTwoBackground.classList.remove("active");
		playerOneBackground.classList.add("active");
	} else {
		if (!activePlayer) {
			playerOneBackground.classList.remove("active");
			playerTwoBackground.classList.add("active");
			playerOneTotalScore += currentScores;
			++activePlayer;
		} else {
			playerTwoBackground.classList.remove("active");
			playerOneBackground.classList.add("active");
			playerTwoTotalScore += currentScores;
			--activePlayer;
		}
	}
	playerOneScore.innerText = playerOneTotalScore;
	playerTwoScore.innerText = playerTwoTotalScore;
	whoIsTheWinner();
};

document.querySelector(".dice-roller").addEventListener("click", () => {
	const diceNumber = Math.trunc(Math.random() * 6) + 1;
	document.querySelector(".dice-bg").style.display = "block";
	document.querySelector(".dice-svg").src = `./files/dice-${diceNumber}.svg`;
	currentPlayer = document.querySelector(`.current-score-player-${!activePlayer ? "one" : "two"}`);

	if (diceNumber !== 1) {
		currentScores += diceNumber;
	} else {
		currentScores = 0;
		switchPlayer();
	}
	currentPlayer.innerText = currentScores;
});

document.querySelector(".hold").addEventListener("click", () => {
	switchPlayer();
	currentScores = 0;
	currentPlayer.innerText = currentScores;
});

const resetEveryThing = () => {
	playerOneTotalScore = 0;
	playerTwoTotalScore = 0;
	currentScores = 0;
	activePlayer = 0;
	switchPlayer(true);
	document.querySelector(".dice-bg").style.display = "none";
	document.querySelectorAll(".score").forEach((eachScore) => (eachScore.innerText = 0));
	document.querySelectorAll(".current-score").forEach((eachCurrentScore) => (eachCurrentScore.innerText = 0));
};

document.querySelector(".retry-btn").addEventListener("click", () => resetEveryThing());

document.querySelectorAll(".title-wrapper").forEach((each) => {
	each.addEventListener("mouseenter", (e) => {
		const oneOrTwo = e.currentTarget.className;
		document
			.querySelector(`.name-editor-player-${oneOrTwo.substring(oneOrTwo.length - 3)}`)
			.classList.add("mini-btn--show");
	});

	each.addEventListener("mouseleave", () => {
		document.querySelectorAll(".mini-btn").forEach((eachElement) => eachElement.classList.remove("mini-btn--show"));
	});
});

let playerTitle;
const promptPopUp = document.querySelector(".popup-prompt");
const promptInput = document.querySelector(".popup-prompt-input");

const showPrompt = (status) => {
	if (status) {
		promptPopUp.classList.add("popup-prompt--show");
		document.body.style.pointerEvents = "none";
	} else {
		promptPopUp.classList.remove("popup-prompt--show");
		promptInput.value = "";
		document.body.style.pointerEvents = "all";
	}
};

const scoreLimit = document.querySelector(".score-limit");
document.querySelector(".score-limit-wrapper").addEventListener("click", () => {
	showPrompt(true);
});

document.querySelectorAll(".mini-btn").forEach((each) => {
	each.addEventListener("click", (e) => {
		const isItOne = e.currentTarget.className.includes("one");
		playerTitle = document.querySelector(`.player-title-${isItOne ? "one" : "two"}`);
		promptInput.classList.add("changing-name");
		showPrompt(true);
	});
});

const promptMessage = document.querySelector(".popup-prompt-message");
document.querySelector(".popup-prompt-submit-btn").addEventListener("click", () => {
	const isItNameChanger = promptInput.className.includes("changing-name");

	if (isItNameChanger) {
		if (promptInput.value && promptInput.value.length <= 15) {
			playerTitle.innerText = promptInput.value;
			promptInput.classList.remove("changing-name");
			promptMessage.innerText = "";
			showPrompt(false);
		} else {
			promptMessage.innerText = "Value must be less than 15 characters";
		}
	} else {
		const value = promptInput.value;

		if (value && value >= 50 && value <= 500) {
			scoreLimit.innerText = value;
			promptMessage.innerText = "";
			showPrompt(false);
		} else {
			promptMessage.innerText = "Value must be between 50 and 500";
		}
	}
});

document.querySelector(".popup-prompt-cancel-btn").addEventListener("click", () => {
	promptInput.classList.remove("changing-name");
	promptMessage.innerText = "";
	showPrompt(false);
});

const mvpPopUp = document.querySelector(".mvp-popup");
function whoIsTheWinner() {
	const mvpWinner = document.querySelector(".mvp-popup-winner");
	const mvpScore = document.querySelector(".mvp-popup-score");

	const isOneBigger = playerOneTotalScore > playerTwoTotalScore;
	const playerTitle = document.querySelector(`.player-title-${isOneBigger ? "one" : "two"}`);
	const playerScore = document.querySelector(`.score-player-${isOneBigger ? "one" : "two"}`);

	if (Number(playerScore.innerText) >= Number(scoreLimit.innerText)) {
		mvpPopUp.classList.add("mvp-popup--show");
		mvpWinner.innerText = playerTitle.innerText;
		mvpScore.innerText = playerScore.innerText;
		document.body.style.pointerEvents = "none";
	}
}

document.querySelector(".new-game-btn").addEventListener("click", () => {
	resetEveryThing();
	mvpPopUp.classList.remove("mvp-popup--show");
	document.body.style.pointerEvents = "all";
});
