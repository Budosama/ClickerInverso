let clicks;
let coins;
let achievements = [];
let upgradeCosts = { coinsPerClick: 10, clickReduction: 20, autoClick: 50};
let upgradeBenefits = { coinsPerClick: 1, clickReduction: 1, autoClick: 0, special: 0 };
let startTime;
let adInterval = 5 * 60 * 1000; // 5 minutos
let adShown = false;

window.onload = function() {
    loadGame();
    updateClicks();
    updateCoins();
    updateAchievements();
    updateUpgrades();
    updateUpgradeButtons(coins);
    updateGlassImage();
    startTimer();
    setInterval(showAd, adInterval);
    setInterval(autoClick, 1000);
}

document.getElementById('glass').addEventListener('click', function() {
    this.classList.add('hammering');
    setTimeout(() => {
        this.classList.remove('hammering');
    }, 300); // Tiempo de duración de la animación en milisegundos
});

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function updateClicks() {
    document.getElementById('clicks').innerText = formatNumber(clicks);
}

function updateCoins() {
    document.getElementById('coins').innerText = formatNumber(coins);
    updateUpgradeButtons(coins);
}

function updateUpgrades() {
    document.getElementById('coinsPerClickUpgrade').innerText = `Coins/10 clicks: ${formatNumber(upgradeBenefits.coinsPerClick)}`;
    document.getElementById('clickReductionUpgrade').innerText = `Reduction/click: ${formatNumber(upgradeBenefits.clickReduction)}`;
    document.getElementById('autoClickUpgrade').innerText = `Reduction/second: ${formatNumber(upgradeBenefits.autoClick)}`;

    document.getElementById('coinsPerClickButton').innerText = `Mejorar Coins/10 clicks: (${formatNumber(upgradeCosts.coinsPerClick)} coins)`;
    document.getElementById('clickReductionButton').innerText = `Mejorar Reduction/click: (${formatNumber(upgradeCosts.clickReduction)} coins)`;
    document.getElementById('autoClickButton').innerText = `Mejorar Reduction/second: (${formatNumber(upgradeCosts.autoClick)} coins)`;
}

function updateUpgradeButtons(coins) {
    document.getElementById('coinsPerClickButton').setAttribute('data-cost', upgradeCosts['coinsPerClick']);
    document.getElementById('clickReductionButton').setAttribute('data-cost', upgradeCosts['clickReduction']);
    document.getElementById('autoClickButton').setAttribute('data-cost', upgradeCosts['autoClick']);
    
    const coinsPerClickButton = document.getElementById('coinsPerClickButton');
    const clickReductionButton = document.getElementById('clickReductionButton');
    const autoClickButton = document.getElementById('autoClickButton');

    const coinsPerClickCost = parseInt(coinsPerClickButton.getAttribute('data-cost'));
    const clickReductionCost = parseInt(clickReductionButton.getAttribute('data-cost'));
    const autoClickCost = parseInt(autoClickButton.getAttribute('data-cost'));

    coinsPerClickButton.disabled = coins < coinsPerClickCost;
    clickReductionButton.disabled = coins < clickReductionCost;
    autoClickButton.disabled = coins < autoClickCost;
}

function updateAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';

    achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.innerText = achievement;
        achievementsList.appendChild(li);
    });
}

function breakGlass() {
    if (clicks > 0) {
        let clickReduction = upgradeBenefits.clickReduction * 1 + upgradeBenefits.special * 10;
        clicks = Math.max(0, clicks - clickReduction);

        let coinsEarned = upgradeBenefits.coinsPerClick * 1;

        if ((5000000 - clicks) % 10 === 0) {
            coins += coinsEarned;
        }

        updateClicks();
        updateCoins();
        updateGlassImage();
        checkAchievements();
        saveGame();
        createShards();
    }
}

function createShards() {
    const shardsContainer = document.getElementById('shards-container');
    shardsContainer.innerHTML = ''; // Limpia cualquier fragmento previo

    for (let i = 0; i < 20; i++) {
        const shard = document.createElement('div');
        shard.classList.add('shard');
        shard.style.left = `${Math.random() * 100}%`;
        shard.style.top = `${Math.random() * 100}%`;
        shard.style.setProperty('--translate-x', `${(Math.random() - 0.5) * 300}px`);
        shard.style.setProperty('--translate-y', `${(Math.random() - 0.5) * 300}px`);
        shard.style.animation = 'shardAnimation 1s forwards';
        shardsContainer.appendChild(shard);
    }
}

function autoClick() {
    if (upgradeBenefits.autoClick > 0 && clicks > 0) {
        let reduction = upgradeBenefits.autoClick * 1;
        clicks = Math.max(0, clicks - reduction);
        updateClicks();
        updateGlassImage();
        saveGame();
    }
}

function updateGlassImage() {
    const glass = document.getElementById('glass');
    if (clicks <= 5000000) {
        glass.src = 'img/glass.png';
    }
    if (clicks < 4000000) {
        glass.src = 'img/glass_broken1.png';
    }
    if (clicks < 2000000) {
        glass.src = 'img/glass_broken2.png';
    }
    if (clicks === 0) {
        glass.src = 'img/glass_shattered.png';
        alert('Congratulations, you broke the glass!');
    }
}

//Original
// function checkAchievements() {
//     const achievementsList = document.getElementById('achievements-list');

//     if (clicks === 4500000 && !achievements.includes('Primer millón de clicks')) {
//         achievements.push('Primer millón de clicks');
//         const li = document.createElement('li');
//         li.innerText = 'Primer millón de clicks';
//         achievementsList.appendChild(li);
//         saveGame();
//     }

//     if (clicks === 0 && !achievements.includes('Rompiste el vidrio')) {
//         achievements.push('Rompiste el vidrio');
//         const li = document.createElement('li');
//         li.innerText = 'Rompiste el vidrio';
//         achievementsList.appendChild(li);
//         saveGame();
//     }

//     if (clicks <= 1000000 && !achievements.includes('Último millón de clicks')) {
//         achievements.push('Último millón de clicks');
//         const li = document.createElement('li');
//         li.innerText = 'Último millón de clicks';
//         achievementsList.appendChild(li);
//         saveGame();
//     }

//     if (clicks <= 100000 && !achievements.includes('Cien mil clicks restantes')) {
//         achievements.push('Cien mil clicks restantes');
//         const li = document.createElement('li');
//         li.innerText = 'Cien mil clicks restantes';
//         achievementsList.appendChild(li);
//         saveGame();
//     }
// }

//Test
function checkAchievements() {
    const achievementsList = document.getElementById('achievements-list');

    if (clicks === 4990000 && !achievements.includes('First 10.000 clicks')) {
        achievements.push('First 10.000 clicks');
        const li = document.createElement('li');
        li.innerText = 'First 10.000 clicks';
        achievementsList.appendChild(li);
        saveGame();
    }

    if (clicks === 4999000 && !achievements.includes('First 1.000 clicks')) {
        achievements.push('First 1.000 clicks');
        const li = document.createElement('li');
        li.innerText = 'First 1.000 clicks';
        achievementsList.appendChild(li);
        saveGame();
    }

    if (clicks <= 4995000 && !achievements.includes('First 5.000 clicks')) {
        achievements.push('First 5.000 clicks');
        const li = document.createElement('li');
        li.innerText = 'First 5.000 clicks';
        achievementsList.appendChild(li);
        saveGame();
    }

    if (clicks <= 4999500 && !achievements.includes('First 500 clicks')) {
        achievements.push('First 500 clicks');
        const li = document.createElement('li');
        li.innerText = 'First 500 clicks';
        achievementsList.appendChild(li);
        saveGame();
    }
}

function buyUpgrade(type) {
    let cost = upgradeCosts[type];
    let benefit = upgradeBenefits[type];
    let upgradeFactor = 2.5; // Factor de aumento para el costo y el beneficio

    if (coins >= cost) {
        coins -= cost;
        upgradeCosts[type] = Math.ceil(cost * upgradeFactor);
        if(upgradeBenefits[type] == 0){
            upgradeBenefits[type] = 1;
        } else {
            upgradeBenefits[type] = benefit * 2; // Aumento del 100% en el beneficio
        }      
    }

    document.getElementById(`${type}Button`).setAttribute('data-cost', upgradeCosts[type]);

    updateCoins();
    updateUpgrades();
    updateUpgradeButtons(coins); // Asegúrate de actualizar los botones después de cada compra
    saveGame();
}

function saveGame() {
    localStorage.setItem('clicks', clicks);
    localStorage.setItem('coins', coins);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('upgradeCosts', JSON.stringify(upgradeCosts));
    localStorage.setItem('upgradeBenefits', JSON.stringify(upgradeBenefits));
    localStorage.setItem('startTime', startTime.toString());
    localStorage.setItem('adShown', JSON.stringify(adShown));
}

function loadGame() {
    clicks = localStorage.getItem('clicks') !== null ? parseInt(localStorage.getItem('clicks')) : 5000000;
    coins = localStorage.getItem('coins') !== null ? parseInt(localStorage.getItem('coins')) : 0;
    achievements = localStorage.getItem('achievements') !== null ? JSON.parse(localStorage.getItem('achievements')) : [];
    upgradeCosts = localStorage.getItem('upgradeCosts') !== null ? JSON.parse(localStorage.getItem('upgradeCosts')) : { coinsPerClick: 10, clickReduction: 20, autoClick: 50 };
    upgradeBenefits = localStorage.getItem('upgradeBenefits') !== null ? JSON.parse(localStorage.getItem('upgradeBenefits')) : { coinsPerClick: 1, clickReduction: 1, autoClick: 0, special: 0 };
    startTime = localStorage.getItem('startTime') !== null ? new Date(localStorage.getItem('startTime')) : new Date();
    adShown = localStorage.getItem('adShown') !== null ? JSON.parse(localStorage.getItem('adShown')) : false;
}

function startTimer() {
    setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date();
    const timeDiff = currentTime - startTime;
    const timeElapsed = new Date(timeDiff);
    const hours = timeElapsed.getUTCHours().toString().padStart(2, '0');
    const minutes = timeElapsed.getUTCMinutes().toString().padStart(2, '0');
    const seconds = timeElapsed.getUTCSeconds().toString().padStart(2, '0');
    document.getElementById('timer').textContent = `Time: ${hours}:${minutes}:${seconds}`;
}

function showAd() {
    if (!adShown) {
        showAdContainer();
        adShown = false;
        saveGame();
    }
}

function watchAd() {
    setTimeout(() => {
        hideAdContainer();
        upgradeBenefits.special = 1;
        setTimeout(() => {
            upgradeBenefits.special = 0;
            alert('The temporary special upgrade has ended.');
        }, 60000); // 1 minuto
    }, 5000); // Simula un anuncio de 5 segundos
    adShown = false; // Reiniciar adShown después de ver el anuncio
    saveGame();
}

function rejectAd() {
    hideAdContainer();
    adShown = false;
    saveGame();
}

function hideAdContainer() {
    const adContainer = document.getElementById('ad-container');
    adContainer.style.display = 'none'; // Establece el estilo de visualización a 'none'
}

function showAdContainer() {
    const adContainer = document.getElementById('ad-container');
    adContainer.style.display = 'block'; // Establece el estilo de visualización a 'block' (o 'flex', 'inline', etc., según corresponda)
}


function resetGame() {
    if (confirm('Are you sure you want to restart the game?')) {
        clicks = 5000000;
        coins = 0;
        achievements = [];
        upgradeCosts = { coinsPerClick: 10, clickReduction: 20, autoClick: 50 };
        upgradeBenefits = { coinsPerClick: 1, clickReduction: 1, autoClick: 0, special: 0 };
        startTime = new Date();
        adShown = false;

        updateClicks();
        updateCoins();
        updateAchievements();
        updateUpgrades();
        updateGlassImage();
        saveGame();
    }
}