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
	updateBannerQuote();

	upgradeCost = document.getElementsByClassName("upgradeCost");
	upgradesOwned = document.getElementsByClassName("upgradesOwned");
}

// Put addCommas and toFixed in a single function to clean up.
function updateScreen() {
	// updates chess pieces clicked
	chessPiecesClicked += (chessPiecesPerSecond / 10);

	chessPiecesClickedFormatted = addCommas(chessPiecesClicked.toFixed(0))
	chessPiecesClickedOnScreen.innerHTML = chessPiecesClickedFormatted;
	window.parent.document.title = chessPiecesClickedFormatted + " - Chess Clicker";
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
		upgradeCost[i].innerHTML = addCommas(upgrades[i].cost);
	}

	// updates amount of upgrades purchased
	for (i=0; i < upgradesOwned.length; i++) {
		upgradesOwned[i].innerHTML = "Owned: " + addCommas(upgrades[i].numberOwned);
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
		upgradeTitle.innerHTML += "<span class='upgradeCost'>" + addCommas(upgrades[i].cost) + "</span>";

		//Description of upgrade
		upgradeDescription = document.createElement("p");
		upgradeDescription.className = "upgradeDescription";
		upgradeDescription.innerHTML = upgrades[i].description;

		// Display number of purchased upgrades
		upgradesOwned = document.createElement("span");
		upgradesOwned.className = "upgradesOwned";
		upgradesOwned.innerHTML = "Owned: " + addCommas(upgrades[i].numberOwned);

		upgradeDiv.appendChild(upgradeTitle);
		upgradeDiv.appendChild(upgradeDescription);
		upgradeDiv.appendChild(upgradesOwned);

		upgradeDiv.onclick = upgrades[i].purchase;

		document.getElementById('upgrades').appendChild(upgradeDiv);
	}
}

function Upgrade(id, name, description, baseCost, clicksPerSecond, maxClicksPerSecond) {
	var $this = this;
	//var iconPath = "images/icons";

	this.id = id;
	this.name = name;
	this.description = description;
	//this.icon = iconPath + icon;
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
	new Upgrade(id = "pawnFarmer",
				name = "The Farmer", 
				description = "Clicks once every 10 seconds.",
				baseCost = 15,
				clicksPerSecond = 0.1,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "pawnBlacksmith",
				name = "The Blacksmith",
				description = "Clicks once every 5 seconds.",
				baseCost = 50,
				clicksPerSecond = 0.2,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "pawnWeaver",
				name = "The Weaver",
				description = "Clicks 10 times every second.",
				baseCost = 1000,
				clicksPerSecond = 10,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "pawnDoctor",
				name = "The Doctor",
				description = "Clicks 20 times every second.",
				baseCost = 2500,
				clicksPerSecond = 20,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "pawnMerchant",
				name = "The Merchant",
				description = "Clicks 50 times every second.",
				baseCost = 4000,
				clicksPerSecond = 50,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "pawnInnkeeper",
				name = "The Innkeeper",
				description = "Clicks 100 times every second.",
				baseCost = 6000,
				clicksPerSecond = 100,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "pawnPoliceOfficer",
				name = "The Officer",
				description = "Clicks 175 times every second.",
				baseCost = 10000,
				clicksPerSecond = 175,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "pawnGambler",
				name = "The Gambler",
				description = "Clicks 275 times every second.",
				baseCost = 15000,
				clicksPerSecond = 275,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "knightSteed",
				name = "Knight's Steed",
				description = "Clicks 500 times every second.",
				baseCost = 30000,
				clicksPerSecond = 500,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "knightSword",
				name = "Knight's Sword",
				description = "Clicks 1,000 times every second.",
				baseCost = 80000,
				clicksPerSecond = 1000,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "bishopArch",
				name = "The Archbishop",
				description = "Clicks 2,000 times every second.",
				baseCost = 200000,
				clicksPerSecond = 2000,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "bishopSupreme",
				name = "Supreme Bishop",
				description = "Clicks 5,000 times every second.",
				baseCost = 500000,
				clicksPerSecond = 5000,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "rookBastion",
				name = "Bastion's Keep",
				description = "Clicks 10,000 times every second.",
				baseCost = 1200000,
				clicksPerSecond = 15000,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "rookCastle",
				name = "Castle Proper",
				description = "Clicks 20,000 times every second.",
				baseCost = 2000000,
				clicksPerSecond = 30000,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "queen",
				name = "The Queen",
				description = "Clicks 50,000 times every second.",
				baseCost = 5000000,
				clicksPerSecond = 80000,
				maxClicksPerSecond = 1000000000000 ),

	new Upgrade(id = "king",
				name = "The King",
				description = "Clicks 250,000 times every second.",
				baseCost = 50000000,
				clicksPerSecond = 250000,
				maxClicksPerSecond = 1000000000000 )
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

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

Array.prototype.randomNewElement = function(last) {
    var num = 0;
    do {
       num = Math.floor(Math.random() * this.length);
    } while (this[num] == last);
    return this[num];
}

var bannerQuotes = [
	"Chess is life. - Bobby Fischer",
	"Life is too short for chess. - Byron",
	"The pawns are the soul of chess - Philidor",
	"Every chess master	was once a beginner. - Chernev",
	"Even a poor plan is better than no plan at all. - Mikhail Chigorin",
	"Pawn endings are to chess what putting is to golf. - Cecil Purdy",
	"Every pawn is a potential queen. - James Mason",
];

function updateBannerQuote() {
	quoteOnScreen = document.getElementById("bannerQuote");
	quoteOnScreen.innerHTML = bannerQuotes.randomNewElement(quoteOnScreen.innerHTML);
}

setInterval(updateBannerQuote, 30000);