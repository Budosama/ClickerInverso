/* -------------------------------------------- Variables y Configuración Inicial -------------------------------------------- */

let clicks;
let coins;
let upgradeCosts = { coinsPerClick: 10, coinsPerSecond: 15, clickReduction: 20, autoClick: 50};
let upgradeBenefits = { coinsPerClick: 1, coinsPerSecond: 0, clickReduction: 1, autoClick: 0, specialCoin: 0 , specialClick: 0};
let startTime;
let adInterval = 2 * 60 * 1000; // 2 minutos
let adShown = false;
let clicksAcumulados = 0;
let bonusInterval;
let bonusDuration = 60; 
let costFactor = 2.5; 
let benefictFactor = 2; 

let achieved = [];
let achievements = [
    { id: '100-clicks', description: 'First 100 clicks', conditionDmg: 4999900, reward: '100 coins' },
    { id: '1000-clicks', description: 'First 1.000 clicks', conditionDmg: 4999000, reward: '1000 coins' },
    { id: '5000-clicks', description: 'First 5.000 clicks', conditionDmg: 4995000, reward: '2x multiplier' },
    { id: '10000-clicks', description: 'First 10.000 clicks', conditionDmg: 4990000, reward: '5000 coins' },
];

let achievementSound = new Audio('sounds/logro.mp3');
achievementSound.muted = true;
let coinSound = new Audio('sounds/coin.mp3');
coinSound.muted = true;
let glassSound = new Audio('sounds/glass.wav');
glassSound.muted = true;
let backgroundMusic = new Audio('sounds/fondo.wav');

backgroundMusic.loop = true;
backgroundMusic.muted = true;
backgroundMusic.volume = 0.5;

/* -------------------------------------------- Manejo de Sonido -------------------------------------------- */

function toggleMute() {
    const muteButton = document.getElementById('mute-button');
    if (backgroundMusic.muted) {
        backgroundMusic.play().catch(error => {
            console.log('Autoplay was prevented:', error);
        });
        achievementSound.muted = false;
        coinSound.muted = false;
        glassSound.muted = false;
        backgroundMusic.muted = false;
        muteButton.innerText = '🔊';
    } else {
        achievementSound.muted = true;
        coinSound.muted = true;
        glassSound.muted = true;
        backgroundMusic.muted = true;
        muteButton.innerText = '🔇';
    }
}

function playAchievementSound() {
    achievementSound.play();
}

function playCoinSound() {
    coinSound.volume = 0.4;
    coinSound.play();
}

function playGlassSound() {
    glassSound.volume = 0.2;
    glassSound.currentTime = 0;
    glassSound.play();
}

/* -------------------------------------------- Funciones de Actualización de UI -------------------------------------------- */

function updateClicks() {
    document.getElementById('clicks').innerText = formatNumber(clicks);
}

function updateCoins() {
    document.getElementById('coins').innerText = formatNumber(coins);
    updateUpgradeButtons(coins);
}

function updateUpgrades() {
    document.getElementById('coinsPerClickUpgrade').innerHTML = `
        <img src="img/coin.png" alt="Coin Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Coins/10 Clicks: ${formatNumber(upgradeBenefits.coinsPerClick)}`;
    document.getElementById('coinsPerSecondUpgrade').innerHTML = `
        <img src="img/coin.png" alt="Coin Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Coins/10 Seconds: ${formatNumber(upgradeBenefits.coinsPerSecond)}`;
    if(adShown){
        document.getElementById('clickReductionUpgrade').innerHTML = `
        <img src="img/Hammer.cur" alt="Reduction Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Reduction/Click: ${formatNumber(upgradeBenefits.clickReduction)} (x2)`;
    } else {
        document.getElementById('clickReductionUpgrade').innerHTML = `
        <img src="img/Hammer.cur" alt="Reduction Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Reduction/Click: ${formatNumber(upgradeBenefits.clickReduction)}`;
    } 
    document.getElementById('autoClickUpgrade').innerHTML = `
        <img src="img/Hammer.cur" alt="Reduction Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Reduction/Second: ${formatNumber(upgradeBenefits.autoClick)}`;

    document.getElementById('coinsPerClickButton').innerText = `Upgrade Coins/10 Clicks: (${formatNumber(upgradeCosts.coinsPerClick)} coins)`;
    document.getElementById('coinsPerSecondButton').innerText = `Upgrade Coins/10 Seconds: (${formatNumber(upgradeCosts.coinsPerSecond)} coins)`;
    document.getElementById('clickReductionButton').innerText = `Upgrade Reduction/Click: (${formatNumber(upgradeCosts.clickReduction)} coins)`;
    document.getElementById('autoClickButton').innerText = `Upgrade Reduction/Second: (${formatNumber(upgradeCosts.autoClick)} coins)`;
}

function updateUpgradeButtons(coins) {
    document.getElementById('coinsPerClickButton').setAttribute('data-cost', upgradeCosts['coinsPerClick']);
    document.getElementById('coinsPerSecondButton').setAttribute('data-cost', upgradeCosts['coinsPerSecond']);
    document.getElementById('clickReductionButton').setAttribute('data-cost', upgradeCosts['clickReduction']);
    document.getElementById('autoClickButton').setAttribute('data-cost', upgradeCosts['autoClick']);
    
    const coinsPerClickButton = document.getElementById('coinsPerClickButton');
    const coinsPerSecondButton = document.getElementById('coinsPerSecondButton');
    const clickReductionButton = document.getElementById('clickReductionButton');
    const autoClickButton = document.getElementById('autoClickButton');

    const coinsPerClickCost = parseInt(coinsPerClickButton.getAttribute('data-cost'));
    const coinsPerSecondCost = parseInt(coinsPerSecondButton.getAttribute('data-cost'));
    const clickReductionCost = parseInt(clickReductionButton.getAttribute('data-cost'));
    const autoClickCost = parseInt(autoClickButton.getAttribute('data-cost'));

    coinsPerClickButton.disabled = coins < coinsPerClickCost;
    coinsPerSecondButton.disabled = coins < coinsPerSecondCost;
    clickReductionButton.disabled = coins < clickReductionCost;
    autoClickButton.disabled = coins < autoClickCost;
}

/* -------------------------------------------- Animaciones -------------------------------------------- */

function animacionCoin(){
    const coinsSpan = document.getElementById('coins');
    coinsSpan.classList.add('change-animation');
    setTimeout(() => {
        coinsSpan.classList.remove('change-animation');
    }, 1000); 
    playCoinSound(); 
}

function animacionGlass(){
    const glass = document.getElementById('glass');
    const shardsContainer = document.getElementById('shards-container');
    glass.classList.add('breaking');
    glass.addEventListener('animationend', () => {
        glass.classList.remove('breaking');
    });
    for (let i = 0; i < 20; i++) {
        const shard = document.createElement('div');
        shard.classList.add('shard');
        const translateX = (Math.random() - 0.5) * 200;
        const translateY = (Math.random() - 0.5) * 200;
        shard.style.setProperty('--translate-x', `${translateX}px`);
        shard.style.setProperty('--translate-y', `${translateY}px`);
        shard.style.left = `${Math.random() * 100}%`;
        shard.style.top = `${Math.random() * 100}%`;
        shardsContainer.appendChild(shard);
        requestAnimationFrame(() => {
            shard.style.opacity = '1';
            shard.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.5)`;
        });
        shard.addEventListener('animationend', () => {
            shard.remove();
        });
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

/* -------------------------------------------- Funcionalidad del Juego -------------------------------------------- */

function breakGlass() {
    if (clicks > 0) {
        clicksAcumulados += 1;
        let clickReduction = upgradeBenefits.clickReduction * (1 + upgradeBenefits.specialClick);
        clicks = Math.max(0, clicks - clickReduction);
        let coinsEarned = upgradeBenefits.coinsPerClick * (1 + upgradeBenefits.specialCoin);
        if(clicksAcumulados % 10 === 0) {
            coins += coinsEarned;
            animacionCoin();
        }
        showDamage(clickReduction);
        animacionGlass();
        updateClicks();
        updateCoins();
        updateGlassImage();
        checkAchievements();
        saveGame();
        createShards();
        playGlassSound(); 
    }
}

function showDamage(damage) {
    const glassContainer = document.getElementById('glass-container');
    const damageDisplay = document.createElement('div');
    damageDisplay.classList.add('damage-display');
    const randomX = Math.random() * (glassContainer.offsetWidth); 
    const randomY = Math.random() * (glassContainer.offsetHeight); 
    damageDisplay.style.left = `${randomX}px`;
    damageDisplay.style.top = `${randomY}px`;
    damageDisplay.innerText = `-${damage}`;
    glassContainer.appendChild(damageDisplay);
    damageDisplay.addEventListener('animationend', () => {
        damageDisplay.remove(); 
    });
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

function autoCoin() {
    if (upgradeBenefits.coinsPerSecond > 0 && clicks > 0) {
        let beneficio = upgradeBenefits.coinsPerSecond * 1;
        coins = Math.max(0, coins + beneficio);
        updateCoins();
        animacionCoin();
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

function buyUpgrade(type) {
    let cost = upgradeCosts[type];
    let benefit = upgradeBenefits[type]; 
    if (coins >= cost) {
        coins -= cost;
        upgradeCosts[type] = Math.ceil(cost * costFactor);
        if(upgradeBenefits[type] == 0){
            upgradeBenefits[type] = 1;
        } else {
            upgradeBenefits[type] = benefit * benefictFactor;
        }    
        animacionCoin();  
    }
    document.getElementById(`${type}Button`).setAttribute('data-cost', upgradeCosts[type]);
    updateCoins();
    updateUpgrades();
    updateUpgradeButtons(coins);
    saveGame();
}

/* -------------------------------------------- Manejo de Logros -------------------------------------------- */

function checkAchievements() {
    achievements.forEach(achievement => {
        if (clicks <= achievement.conditionDmg && !achieved.includes(achievement.id)) {
            document.getElementById(`reward-${achievement.id}`).disabled = false;
            achieved.push(achievement.id);
            playAchievementSound(); 
            saveGame();
        }
    });
}

function getReward(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
        switch (achievement.reward) {
            case '100 coins':
                coins += 100;
                updateCoins();
                animacionCoin();
                break;
            case '1000 coins':
                coins += 1000;
                updateCoins();
                animacionCoin();
                break;
            case '2x multiplier':
                upgradeBenefits.coinsPerClick *= 2;
                break;
            case '5000 coins':
                coins += 5000;
                updateCoins();
                animacionCoin();
                break;
        }
        const rewardButton = document.getElementById(`reward-${achievementId}`);
        rewardButton.disabled = true;
        rewardButton.textContent = 'Checked';
        markAchievementAsCompleted(achievementId);
        saveGame();
    }
}

function markAchievementAsCompleted(achievementId) {
    const achievementElement = document.getElementById(`achievement-${achievementId}`);
    if (achievementElement) {
        achievementElement.classList.add('completed');
    }
}

/* -------------------------------------------- Manejo de Publicidad y Bonificaciones -------------------------------------------- */

function showAdContainer() {
    const adContainer = document.getElementById('ad-container');
    adContainer.style.display = 'flex';
}

function hideAdContainer() {
    const adContainer = document.getElementById('ad-container');
    adContainer.style.display = 'none';
}

function showAd() {
    if (!adShown) {
        showAdContainer();
        adShown = false;
        saveGame();
    }
}

function watchAd() {
    hideAdContainer();
    adShown = true;
    upgradeBenefits.specialClick = 1;
    document.getElementById('clickReductionUpgrade').innerHTML = `
        <img src="img/Hammer.cur" alt="Reduction Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Reduction/Click: ${formatNumber(upgradeBenefits.clickReduction)} (x2)`;
    showBonusTimer();
    let remainingTime = bonusDuration;

    var clickReductionUpgrade = document.getElementById('clickReductionUpgrade');
    clickReductionUpgrade.classList.add('bonus-active');
    document.getElementById('bonus-time-remaining').innerText = '60 s';
    const timerProgress = document.getElementById('timer-progress');
    timerProgress.style.animation = `countdown ${bonusDuration}s linear forwards`;

    bonusTimerInterval = setInterval(() => {
        remainingTime--;
        updateBonusTimer(remainingTime);
        
        if (remainingTime <= 0) {
            clearInterval(bonusTimerInterval);
            hideBonusTimer();
            adShown = false;
            upgradeBenefits.specialClick = 0;
            document.getElementById('clickReductionUpgrade').innerHTML = `
                <img src="img/Hammer.cur" alt="Reduction Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
                Reduction/Click: ${formatNumber(upgradeBenefits.clickReduction)}`;
            clickReductionUpgrade.classList.remove('bonus-active');       
            // alert('The temporary special upgrade has ended.');
        }
    }, 1000);   
    saveGame();
}

function rejectAd() {
    hideAdContainer();
    adShown = false;
    saveGame();
}

/* -------------------------------------------- Manejo de Almacenamiento -------------------------------------------- */

function saveGame() {
    localStorage.setItem('clicks', clicks);
    localStorage.setItem('coins', coins);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('achieved', JSON.stringify(achieved));
    localStorage.setItem('upgradeCosts', JSON.stringify(upgradeCosts));
    localStorage.setItem('upgradeBenefits', JSON.stringify(upgradeBenefits));
    localStorage.setItem('startTime', startTime.toString());
    localStorage.setItem('adShown', JSON.stringify(adShown));
    localStorage.setItem('clicksAcumulados', JSON.stringify(clicksAcumulados));
}

function loadGame() {
    clicks = localStorage.getItem('clicks') !== null ? parseInt(localStorage.getItem('clicks')) : 5000000;
    coins = localStorage.getItem('coins') !== null ? parseInt(localStorage.getItem('coins')) : 0;
    achievements = localStorage.getItem('achievements') !== null ? JSON.parse(localStorage.getItem('achievements')) : [
        { id: '100-clicks', description: 'First 100 clicks', conditionDmg: 4999900, reward: '100 coins' },
        { id: '1000-clicks', description: 'First 1.000 clicks', conditionDmg: 4999000, reward: '1000 coins' },
        { id: '5000-clicks', description: 'First 5.000 clicks', conditionDmg: 4995000, reward: '2x multiplier' },
        { id: '10000-clicks', description: 'First 10.000 clicks', conditionDmg: 4990000, reward: '5000 coins' },
    ];
    achieved = localStorage.getItem('achieved') !== null ? JSON.parse(localStorage.getItem('achieved')) : [];
    upgradeCosts = localStorage.getItem('upgradeCosts') !== null ? JSON.parse(localStorage.getItem('upgradeCosts')) : { coinsPerClick: 10, coinsPerSecond: 15, clickReduction: 20, autoClick: 50 };
    upgradeBenefits = localStorage.getItem('upgradeBenefits') !== null ? JSON.parse(localStorage.getItem('upgradeBenefits')) : { coinsPerClick: 1, coinsPerSecond: 0, clickReduction: 1, autoClick: 0, specialCoin: 0, specialClick: 0 };
    startTime = localStorage.getItem('startTime') !== null ? new Date(localStorage.getItem('startTime')) : new Date();
    adShown = localStorage.getItem('adShown') !== null ? JSON.parse(localStorage.getItem('adShown')) : false;
    clicksAcumulados = localStorage.getItem('clicksAcumulados') !== null ? JSON.parse(localStorage.getItem('clicksAcumulados')) : 0;
}

function resetGame() {
    if (confirm('Are you sure you want to restart the game?')) {
        clicks = 5000000;
        coins = 0;
        achievements = [
            { id: '100-clicks', description: 'First 100 clicks', conditionDmg: 4999900, reward: '100 coins' },
            { id: '1000-clicks', description: 'First 1.000 clicks', conditionDmg: 4999000, reward: '1000 coins' },
            { id: '5000-clicks', description: 'First 5.000 clicks', conditionDmg: 4995000, reward: '2x multiplier' },
            { id: '10000-clicks', description: 'First 10.000 clicks', conditionDmg: 4990000, reward: '5000 coins' },
        ];
        achieved = [];
        upgradeCosts = { coinsPerClick: 10, coinsPerSecond: 15, clickReduction: 20, autoClick: 50 };
        upgradeBenefits = { coinsPerClick: 1, coinsPerSecond: 0, clickReduction: 1, autoClick: 0, specialCoin: 0, specialClick: 0 };
        startTime = new Date();
        adShown = false;
        clicksAcumulados = 0;
        document.getElementById('clickReductionUpgrade').classList.remove('bonus-active'); 
        document.getElementById('bonus-time-remaining').style.animation = 'none';  
        hideBonusTimer();
        updateClicks();
        updateCoins();
        updateUpgrades();
        updateGlassImage();
        saveGame();
    }
}

/* -------------------------------------------- Control del Temporizador -------------------------------------------- */

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
    document.getElementById('time').innerText = `${hours}:${minutes}:${seconds}`;
}

function updateBonusTimer(remainingTime) {
    const bonusTimeRemaining = document.getElementById('bonus-time-remaining');
    bonusTimeRemaining.innerText = `${remainingTime} s`;
    bonusTimeRemaining.style.animation = 'none';
        requestAnimationFrame(() => {
            bonusTimeRemaining.style.animation = 'jump 0.5s';
        });
}

function showBonusTimer() {
    const bonusTimerContainer = document.getElementById('bonus-timer-container');
    bonusTimerContainer.style.display = 'flex';
}

function hideBonusTimer() {
    const bonusTimerContainer = document.getElementById('bonus-timer-container');
    bonusTimerContainer.style.display = 'none';
    const timerProgress = document.getElementById('timer-progress');
    timerProgress.style.animation = 'none';
}

/* -------------------------------------------- Funciones de Utilidad -------------------------------------------- */

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* -------------------------------------------- Inicialización del Juego -------------------------------------------- */

window.onload = function() {
    loadGame();
    updateClicks();
    updateCoins();
    updateUpgrades();
    updateUpgradeButtons(coins);
    updateGlassImage();
    startTimer();
    setInterval(showAd, adInterval);
    setInterval(autoClick, 1000);
    setInterval(autoCoin, 10000);
}