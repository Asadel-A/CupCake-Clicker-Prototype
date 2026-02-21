/*
Name: Asadel Ali & Roshan Azeemi
Date: Feb 05, 2026
Description: This file controls the game's logic, variables, user interactions, and dynamically updates the HTML to reflect the game's state.
*/

let gameState = {
    cupcakes: 0,
    clickValue: 1,
    totalClicks: 0,
    autoClickDelay: 0,
    myUpgrades: [],  
    myTrophies: []     
};

let autoClickTimer = null; 

const shopItems = [
    { id: 'sprinkles', name: 'Sprinkles (+1 Click)', type: 'click', cost: 50, boost: 1 },
    { id: 'cocoa', name: 'Cocoa (+5 Click)', type: 'click', cost: 200, boost: 5 },
    { id: 'cream', name: 'Whipped Cream (+10 Click)', type: 'click', cost: 500, boost: 10 },
    { id: 'eggs', name: 'Eggs (Auto 3 sec)', type: 'auto', cost: 100, delay: 3000 },
    { id: 'vanilla', name: 'Vanilla (Auto 1 sec)', type: 'auto', cost: 1000, delay: 1000 },
    { id: 'chocolate', name: 'Choco (Auto 0.1 sec)', type: 'auto', cost: 5000, delay: 100 }
];

const trophyList = [
    { id: 'first', text: 'CUPTASTIC: Clicked 1 time', icon: '👆', req: (g) => g.totalClicks >= 1 },
    { id: 'dough', text: 'Making Dough: 50 Cupcakes', icon: '🥯', req: (g) => g.cupcakes >= 50 },
    { id: 'cheat', text: 'Stop Cheating: Bought Auto Clicker', icon: '🥚', req: (g) => g.myUpgrades.includes('eggs') },
    { id: 'oven', text: 'Fresh Oven: Bought Sprinkles', icon: '✨', req: (g) => g.myUpgrades.includes('sprinkles') }
];

window.addEventListener('load', function() {
    createStoreButtons();
    document.getElementById('cupcake-btn').addEventListener('click', clickCupcake);
    document.getElementById('open-help').addEventListener('click', showHelp);
    document.getElementById('close-help').addEventListener('click', hideHelp);
    setInterval(updateGameLoop, 100); 
});

/**
 * Handles the manual clicking of the main cupcake to increase resources.
 * * @returns {void} Returns nothing.
 */
function clickCupcake() {
    gameState.cupcakes += gameState.clickValue; 
    gameState.totalClicks += 1;                 
    updateScreen();
}

/**
 * Processes the purchase of an upgrade, applies its effects, and increases its future cost.
 * * @param {Object} item The specific upgrade object being purchased from the store.
 * @returns {void} Returns nothing.
 */
function buyItem(item) {
    if (gameState.cupcakes >= item.cost) {
        gameState.cupcakes -= item.cost;
        item.cost = Math.ceil(item.cost * 1.5);
        
        if (!gameState.myUpgrades.includes(item.id)) {
            gameState.myUpgrades.push(item.id);
        }

        if (item.type === 'click') {
            gameState.clickValue += item.boost;
        } else if (item.type === 'auto') {
            startAutoClicker(item.delay);
        }

        createStoreButtons(); 
    }
}

/**
 * Starts or replaces the automatic clicking interval.
 * * @param {Number} delayTime The delay in milliseconds between automatic clicks.
 * @returns {void} Returns nothing.
 */
function startAutoClicker(delayTime) {
    if (autoClickTimer) {
        clearInterval(autoClickTimer);
    }

    gameState.autoClickDelay = delayTime;

    autoClickTimer = setInterval(function() {
        gameState.cupcakes += gameState.clickValue;
        updateScreen();
    }, delayTime);
}

/**
 * Updates the text values on the scoreboard based on the current game state.
 * * @returns {void} Returns nothing.
 */
function updateScreen() {
    document.getElementById('score-text').innerText = gameState.cupcakes;
    document.getElementById('click-power-text').innerText = gameState.clickValue;
}

/**
 * Runs periodically to continuously check for updates like unlocked trophies or affordable buttons.
 * * @returns {void} Returns nothing.
 */
function updateGameLoop() {
    checkTrophies();
    checkButtons();
}

/**
 * Iterates through store buttons and visually disables or enables them based on current resources.
 * * @returns {void} Returns nothing.
 */
function checkButtons() {
    shopItems.forEach(item => {
        let btn = document.getElementById('btn-' + item.id);
        if (gameState.cupcakes < item.cost) {
            btn.classList.add('disabled'); 
        } else {
            btn.classList.remove('disabled'); 
        }
    });
}

/**
 * Dynamically generates the HTML elements for the store buttons.
 * * @returns {void} Returns nothing.
 */
function createStoreButtons() {
    const container = document.getElementById('store-container');
    container.innerHTML = ''; 
    shopItems.forEach(item => {
        let btn = document.createElement('div');
        btn.className = 'upgrade-btn';
        btn.id = 'btn-' + item.id;
        btn.innerHTML = `<b>${item.name}</b><br>Cost: ${item.cost}`;
        btn.addEventListener('click', function() {
            buyItem(item);
        });

        container.appendChild(btn);
    });
}

/**
 * Iterates through the trophy list to see if the user has met any new unlock conditions.
 * * @returns {void} Returns nothing.
 */
function checkTrophies() {
    trophyList.forEach(trophy => { 
        if (!gameState.myTrophies.includes(trophy.id) && trophy.req(gameState)) {
            unlockTrophy(trophy);
        }
    });
}

/**
 * Records a new trophy as unlocked, displays it in the UI, and shows a temporary success message.
 * * @param {Object} trophy The specific trophy object that has been unlocked.
 * @returns {void} Returns nothing.
 */
function unlockTrophy(trophy) {
    gameState.myTrophies.push(trophy.id);
    let icon = document.createElement('div');
    icon.className = 'trophy';
    icon.innerText = trophy.icon;
    icon.title = trophy.text; 
    document.getElementById('trophy-area').appendChild(icon);
    
    let msg = document.getElementById('message-box');
    msg.innerText = "Unlocked: " + trophy.text;
    
    setTimeout(function() { 
        msg.innerText = "";
    }, 3000);
}

/**
 * Displays the help overlay to the user.
 * * @returns {void} Returns nothing.
 */
function showHelp() {
    document.getElementById('help').style.display = 'flex';
}

/**
 * Hides the help overlay from the user.
 * * @returns {void} Returns nothing.
 */
function hideHelp() {
    document.getElementById('help').style.display = 'none';
}