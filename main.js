var chessPiecesClicked = 0.0;
var chessPiecesClickedIncrement = 1.0;

var totalPiecesClicked = 0.0;
var totalPiecesSpent = 0.0;

var chessPiecesPerSecond = 0.0;

var chessPiece;
var chessPiecesClickedOnScreen;

var chessPiecesPerSecondOnScreen;
var chessPiecesClickedIncrementOnScreen;

var totalPiecesClickedOnScreen;
var totalPiecesSpentOnScreen;

var upgradeCost;
var upgradesOwned;

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}

addLoadEvent(initializeDomEvents);

// Borrowed from http://stackoverflow.com/questions/143815/how-to-determine-using-javascript-if-html-element-has-overflowing-content/143889#143889
function checkOverflow(el) {
   var curOverflow = el.style.overflow;
   if ( !curOverflow || curOverflow === "visible" )
      el.style.overflow = "hidden";

   var isOverflowing = el.clientWidth < el.scrollWidth 
      || el.clientHeight < el.scrollHeight;

   el.style.overflow = curOverflow;

   return isOverflowing;
}

function initializeDomEvents() {
	chessPiece = document.getElementById('chessPiece');
	chessPiecesClickedOnScreen = document.getElementById('chessPiecesClicked');
	chessPiecesPerSecondOnScreen = document.getElementById('chessPiecesPerSecond');
	chessPiecesClickedIncrementOnScreen = document.getElementById('chessPiecesClickedIncrement');

	totalPiecesClickedOnScreen = document.getElementById('totalClicked');
	totalPiecesSpentOnScreen = document.getElementById('totalSpent');

	if (chessPiece) {
		chessPiece.onclick = function() {
			chessPiecesClicked += chessPiecesClickedIncrement;
			totalPiecesClicked += 1;
		};
	}

	drawUpgrades();

	upgradeCost = document.getElementsByClassName("upgradeCost");
	upgradesOwned = document.getElementsByClassName("upgradesOwned");
}

// Put addCommas and toFixed in a single function to clean up.
function updateScreen() {
	// updates chess pieces clicked
	chessPiecesClicked += (chessPiecesPerSecond / 10);
	chessPiecesClickedOnScreen.innerHTML = addCommas(chessPiecesClicked.toFixed(0));
	//chessPiecesClickedOverflow = checkOverflow(chessPiecesClickedOnScreen);

	/*
	if (chessPiecesClickedOverflow) {
		chessPiecesClickedOnScreen.style.setProperty("font-size", parseFloat(window.getComputedStyle(chessPiecesClickedOnScreen, 'font-size').getPropertyValue('font-size')) - 1 + "px");
	}
	*/

	// updates total per second	
	chessPiecesPerSecondOnScreen.innerHTML = "Per Second: " + addCommas(chessPiecesPerSecond.toFixed(1));

	// updates increment per click
	chessPiecesClickedIncrementOnScreen.innerHTML = "Per Click: " + addCommas(chessPiecesClickedIncrement);

	// updates cost of upgrades
	for (i=0; i < upgradeCost.length; i++) {
		upgradeCost[i].innerHTML = upgrades[i].cost;
	}

	// updates amount of upgrades purchased
	for (i=0; i < upgradesOwned.length; i++) {
		upgradesOwned[i].innerHTML = "Owned: " + upgrades[i].numberOwned;
	}

	// updates total clicked for stats
	totalPiecesClickedOnScreen.innerHTML = "Total Clicked: " + addCommas(totalPiecesClicked.toFixed(0));

	// updates total spent for stats
	totalPiecesSpentOnScreen.innerHTML = "Total Spent: " + addCommas(totalPiecesSpent.toFixed(0));

}
setInterval(updateScreen, 100);

function drawUpgrades() {
	for (var i = 0; i < upgrades.length; i++) {
		var upgradeDiv = document.createElement("div");
		upgradeDiv.className = "inactiveUpgrade";
		upgradeDiv.id = upgrades[i].id;

		// Title of upgrade
		upgradeTitle = document.createElement("h3");
		upgradeTitle.id = "upgradeTitle";
		upgradeTitle.innerHTML = upgrades[i].name;

		// Upgrade cost
		upgradeTitle.innerHTML += "<span class='upgradeCost'>" + upgrades[i].cost + "</span>";

		//Description of upgrade
		upgradeDescription = document.createElement("p");
		upgradeDescription.className = "upgradeDescription";
		upgradeDescription.innerHTML = upgrades[i].description;

		// Display number of purchased upgrades
		upgradesOwned = document.createElement("span");
		upgradesOwned.className = "upgradesOwned";
		upgradesOwned.innerHTML = "Owned: " + upgrades[i].numberOwned;

		upgradeDiv.appendChild(upgradeTitle);
		upgradeDiv.appendChild(upgradeDescription);
		upgradeDiv.appendChild(upgradesOwned);

		upgradeDiv.onclick = upgrades[i].purchase;

		document.getElementById('upgrades').appendChild(upgradeDiv);
	}
}

function Upgrade(id, name, description, baseCost, clicksPerSecond, maxClicksPerSecond) {
	var $this = this;

	this.id = id;
	this.name = name;
	this.description = description;
	this.baseCost = baseCost;
	this.cost = baseCost;
	this.clicksPerSecond = clicksPerSecond;
	this.maxClicksPerSecond = maxClicksPerSecond;
	this.numberOwned = 0;

	this.purchase = function() {
		if (chessPiecesClicked >= $this.cost) {
			chessPiecesClicked -= $this.cost;
			totalPiecesSpent += $this.cost;
			$this.numberOwned += 1;
			$this.cost = Math.floor($this.baseCost * Math.pow(1.15, $this.numberOwned));

			if ($this.clicksPerSecond <= maxClicksPerSecond) {
				chessPiecesPerSecond += $this.clicksPerSecond;
			}
		}
	};
}

var upgrades = [
	new Upgrade(id = "pawnForward",
				name = "Pawn Forward", 
				description = "Clicks once every 10 seconds.",
				baseCost = 15,
				clicksPerSecond = 0.1,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "pawnDoubleForward",
				name = "Pawn Double Forward",
				description = "Clicks once every 5 seconds.",
				baseCost = 50,
				clicksPerSecond = 0.2,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "enPassant",
				name = "En Passant",
				description = "Clicks 10 times every second.",
				baseCost = 1000,
				clicksPerSecond = 10,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "knightAdvance",
				name = "Knight Advance",
				description = "Clicks 20 times every second.",
				baseCost = 2500,
				clicksPerSecond = 20,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "bishopAdvance",
				name = "Bishop Advance",
				description = "Clicks 50 times every second.",
				baseCost = 4000,
				clicksPerSecond = 35,
				maxClicksPerSecond = 1000000000000 ),
];

function enableUpgrades() {
	for (i = 0; i < upgrades.length; i++) {
		upgradeDiv = document.getElementById(upgrades[i].id);
		if (chessPiecesClicked >= upgrades[i].cost) {
			upgradeDiv.className = "upgrade";
		} else {
			upgradeDiv.className = "inactiveUpgrade";
		}
	}
}
setInterval(enableUpgrades, 100);

var achievements = {
}