/* -------------------------------------------- Variables y Configuración Inicial -------------------------------------------- */

let clicks;
let coins;
let upgradeCosts = { coinsPerClick: 10, coinsPerSecond: 15, reductionPerClick: 20, reductionPerSecond: 50};
let upgradeBenefits = { coinsPerClick: 1, coinsPerSecond: 0, reductionPerClick: 1, reductionPerSecond: 0, specialCoinPerClick: 0 , specialReductionPerClick: 0, specialCoinPerSecond: 0, specialReductionPerSecond: 0};
let startTime;
let adInterval = 2 * 60 * 1000; // 2 minutos
let adShown = false;
let clicksAcumulados = 0;
let bonusInterval;
let bonusDuration = 60; 
let costFactor = 2.5; 
let benefictFactor = 2; 

let achieved = [];
const achievements = [
    { id: '100-clicks', description: 'First 100 clicks', conditionDmg: 9999900, reward: '10 coins' },
    { id: '500-clicks', description: 'First 500 clicks', conditionDmg: 9999500, reward: '50 coins' },
    { id: '1000-clicks', description: 'First 1000 clicks', conditionDmg: 9999000, reward: '100 coins' },
    { id: '2500-clicks', description: 'First 2500 clicks', conditionDmg: 9997500, reward: '250 coins' },
    { id: '5000-clicks', description: 'First 5000 clicks', conditionDmg: 9995000, reward: '500 coins' },
    { id: '10000-clicks', description: 'First 10.000 clicks', conditionDmg: 9990000, reward: 'x2 coinsPerClick' },
    { id: '50000-clicks', description: 'First 50.000 clicks', conditionDmg: 9950000, reward: 'x2 coinsPerSecond' },
    { id: '100000-clicks', description: 'First 100.000 clicks', conditionDmg: 9900000, reward: 'x2 reductionPerClick' },
    { id: '250000-clicks', description: 'First 250.000 clicks', conditionDmg: 9750000, reward: 'x2 reductionPerSecond' },
    { id: '500000-clicks', description: 'First 500.000 clicks', conditionDmg: 9500000, reward: '5000 coins' },
    { id: '1000000-clicks', description: 'First 1.000.000 clicks', conditionDmg: 9000000, reward: 'x3 coinsPerClick' },
    { id: '1500000-clicks', description: 'First 1.500.000 clicks', conditionDmg: 8500000, reward: 'x3 coinsPerSecond' },
    { id: '2000000-clicks', description: 'First 2.000.000 clicks', conditionDmg: 8000000, reward: 'x3 reductionPerClick' },
    { id: '2500000-clicks', description: 'First 2.500.000 clicks', conditionDmg: 7500000, reward: 'x3 reductionPerSecond' },
    { id: '3000000-clicks', description: 'First 3.000.000 clicks', conditionDmg: 7000000, reward: 'x3 coinsAll' },
    { id: '3500000-clicks', description: 'First 3.500.000 clicks', conditionDmg: 6500000, reward: 'x3 reductionAll' },
    { id: '4000000-clicks', description: 'First 4.000.000 clicks', conditionDmg: 6000000, reward: 'x3 all' },
    { id: '4500000-clicks', description: 'First 4.500.000 clicks', conditionDmg: 5500000, reward: 'x3 all & 45000 coins' },
    { id: '5000000-clicks', description: 'First 5.000.000 clicks', conditionDmg: 5000000, reward: '50000 coins' },
    { id: '5500000-clicks', description: 'First 5.500.000 clicks', conditionDmg: 4500000, reward: 'x5 reductionAll' },
    { id: '6000000-clicks', description: 'First 6.000.000 clicks', conditionDmg: 4000000, reward: 'x5 coinsAll' },
    { id: '7000000-clicks', description: 'First 7.000.000 clicks', conditionDmg: 3000000, reward: 'x5 all' },
    { id: '8000000-clicks', description: 'First 8.000.000 clicks', conditionDmg: 2000000, reward: 'x10 all' },
    { id: '9000000-clicks', description: 'First 9.000.000 clicks', conditionDmg: 1000000, reward: 'x10 all & 90000 coins' },
    { id: '10000000-clicks', description: 'First 10.000.000 clicks', conditionDmg: 0, reward: 'end game' },
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
    achievementSound.play().catch(error => {
        console.log('Autoplay was prevented:', error);
    });
}

function playCoinSound() {
    coinSound.volume = 0.4;
    coinSound.play().catch(error => {
        console.log('Autoplay was prevented:', error);
    });
}

function playGlassSound() {
    glassSound.volume = 0.2;
    glassSound.currentTime = 0;
    glassSound.play().catch(error => {
        console.log('Autoplay was prevented:', error);
    });
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
    var coinsPerClickUpgrade = document.getElementById('coinsPerClickUpgrade');
    var coinsPerSecondUpgrade = document.getElementById('coinsPerSecondUpgrade');
    var reductionPerClickUpgrade = document.getElementById('reductionPerClickUpgrade');
    var reductionPerSecondUpgrade = document.getElementById('reductionPerSecondUpgrade');

    if(upgradeBenefits.specialCoinPerClick > 0){        
        coinsPerClickUpgrade.classList.add('bonus-active');
        coinsPerClickUpgrade.innerHTML = `
        <img src="img/coin.png" alt="Coin Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Coins/10 Clicks: ${formatNumber(upgradeBenefits.coinsPerClick)} (x${1 + upgradeBenefits.specialCoinPerClick})`;
    } else {
        coinsPerClickUpgrade.classList.remove('bonus-active');
        coinsPerClickUpgrade.innerHTML = `
        <img src="img/coin.png" alt="Coin Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Coins/10 Clicks: ${formatNumber(upgradeBenefits.coinsPerClick)}`;
    } 
    if(upgradeBenefits.specialCoinPerSecond > 0){
        coinsPerSecondUpgrade.classList.add('bonus-active');
        coinsPerSecondUpgrade.innerHTML = `
        <img src="img/coin.png" alt="Coin Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Coins/10 Seconds: ${formatNumber(upgradeBenefits.coinsPerSecond)} (x${1 + upgradeBenefits.specialCoinPerSecond})`;
    } else {
        coinsPerSecondUpgrade.classList.remove('bonus-active');
        coinsPerSecondUpgrade.innerHTML = `
        <img src="img/coin.png" alt="Coin Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Coins/10 Seconds: ${formatNumber(upgradeBenefits.coinsPerSecond)}`;
    }  
    if(upgradeBenefits.specialReductionPerClick > 0){       
        reductionPerClickUpgrade.classList.add('bonus-active');
        reductionPerClickUpgrade.innerHTML = `
        <img src="img/Hammer.cur" alt="Reduction Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Reduction/Click: ${formatNumber(upgradeBenefits.reductionPerClick)} (x${1 + upgradeBenefits.specialReductionPerClick})`;
    } else {
        reductionPerClickUpgrade.classList.remove('bonus-active');
        reductionPerClickUpgrade.innerHTML = `
        <img src="img/Hammer.cur" alt="Reduction Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Reduction/Click: ${formatNumber(upgradeBenefits.reductionPerClick)}`;
    } 
    if(upgradeBenefits.specialReductionPerSecond > 0){
        reductionPerSecondUpgrade.classList.add('bonus-active');
        reductionPerSecondUpgrade.innerHTML = `
        <img src="img/Hammer.cur" alt="Reduction Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Reduction/Second: ${formatNumber(upgradeBenefits.reductionPerSecond)} (x${1 + upgradeBenefits.specialReductionPerSecond})`;
    } else {
        reductionPerSecondUpgrade.classList.remove('bonus-active');
        reductionPerSecondUpgrade.innerHTML = `
        <img src="img/Hammer.cur" alt="Reduction Upgrade" style="width:20px; vertical-align:middle; margin-right:5px;">
        Reduction/Second: ${formatNumber(upgradeBenefits.reductionPerSecond)}`;
    } 

    document.getElementById('coinsPerClickButton').innerText = `Upgrade Coins/10 Clicks: (${formatNumber(upgradeCosts.coinsPerClick)} coins)`;
    document.getElementById('coinsPerSecondButton').innerText = `Upgrade Coins/10 Seconds: (${formatNumber(upgradeCosts.coinsPerSecond)} coins)`;
    document.getElementById('reductionPerClickButton').innerText = `Upgrade Reduction/Click: (${formatNumber(upgradeCosts.reductionPerClick)} coins)`;
    document.getElementById('reductionPerSecondButton').innerText = `Upgrade Reduction/Second: (${formatNumber(upgradeCosts.reductionPerSecond)} coins)`;
}

function updateUpgradeButtons(coins) {
    document.getElementById('coinsPerClickButton').setAttribute('data-cost', upgradeCosts['coinsPerClick']);
    document.getElementById('coinsPerSecondButton').setAttribute('data-cost', upgradeCosts['coinsPerSecond']);
    document.getElementById('reductionPerClickButton').setAttribute('data-cost', upgradeCosts['reductionPerClick']);
    document.getElementById('reductionPerSecondButton').setAttribute('data-cost', upgradeCosts['reductionPerSecond']);
    
    const coinsPerClickButton = document.getElementById('coinsPerClickButton');
    const coinsPerSecondButton = document.getElementById('coinsPerSecondButton');
    const reductionPerClickButton = document.getElementById('reductionPerClickButton');
    const reductionPerSecondButton = document.getElementById('reductionPerSecondButton');

    const coinsPerClickCost = parseInt(coinsPerClickButton.getAttribute('data-cost'));
    const coinsPerSecondCost = parseInt(coinsPerSecondButton.getAttribute('data-cost'));
    const reductionPerClickCost = parseInt(reductionPerClickButton.getAttribute('data-cost'));
    const reductionPerSecondCost = parseInt(reductionPerSecondButton.getAttribute('data-cost'));

    coinsPerClickButton.disabled = coins < coinsPerClickCost;
    coinsPerSecondButton.disabled = coins < coinsPerSecondCost;
    reductionPerClickButton.disabled = coins < reductionPerClickCost;
    reductionPerSecondButton.disabled = coins < reductionPerSecondCost;
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
        let reductionPerClick = upgradeBenefits.reductionPerClick * (1 + upgradeBenefits.specialReductionPerClick);
        clicks = Math.max(0, clicks - reductionPerClick);
        let coinsEarned = upgradeBenefits.coinsPerClick * (1 + upgradeBenefits.specialCoinPerClick);
        if(clicksAcumulados % 10 === 0) {
            coins += coinsEarned;
            animacionCoin();
        }
        showDamage(reductionPerClick);
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

function reductionPerSecond() {
    if (upgradeBenefits.reductionPerSecond > 0 && clicks > 0) {
        let reduction = upgradeBenefits.reductionPerSecond * (1 + upgradeBenefits.specialReductionPerSecond);
        clicks = Math.max(0, clicks - reduction);
        updateClicks();
        updateGlassImage();
        saveGame();
    }
}

function autoCoin() {
    if (upgradeBenefits.coinsPerSecond > 0 && clicks > 0) {
        let beneficio = upgradeBenefits.coinsPerSecond * (1 + upgradeBenefits.specialCoinPerSecond);
        coins = Math.max(0, coins + beneficio);
        updateCoins();
        animacionCoin();
        saveGame();
    }
}

function updateGlassImage() {
    const glass = document.getElementById('glass');
    if (clicks <= 10000000) {
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
        }
    });
}

function endGame() {
    const message = document.getElementById('end-game-message');
    message.style.display = 'block';
    saveGame();
    // Opcional: detener otras actividades del juego, por ejemplo:
    // clearInterval(gameInterval);
    // deshabilitar botones, etc.
}

function getReward(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
        switch (achievement.reward) {
            case '10 coins':
                coins += 10;
                updateCoins();
                animacionCoin();
                break;
            case '50 coins':
                coins += 50;
                updateCoins();
                animacionCoin();
                break;
            case '100 coins':
                coins += 100;
                updateCoins();
                animacionCoin();
                break;
            case '250 coins':
                coins += 250;
                updateCoins();
                animacionCoin();
                break;
            case '500 coins':
                coins += 500;
                updateCoins();
                animacionCoin();
                break;
            case 'x2 coinsPerClick':
                upgradeBenefits.specialCoinPerClick += 1;
                updateUpgrades();
                let remainingTimeCPC = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTimeCPC--;
                    if (remainingTimeCPC <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialCoinPerClick -= 1;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x2 coinsPerSecond':
                upgradeBenefits.specialCoinPerSecond += 1;
                updateUpgrades();
                let remainingTimeCPS = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTimeCPS--;
                    if (remainingTimeCPS <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialCoinPerSecond -= 1;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x2 reductionPerClick':
                upgradeBenefits.specialReductionPerClick += 1;
                updateUpgrades();
                let remainingTimeRPC = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTimeRPC--;
                    if (remainingTimeRPC <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialReductionPerClick -= 1;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x2 reductionPerSecond':
                upgradeBenefits.specialReductionPerSecond += 1;
                updateUpgrades();
                let remainingTimeRPS = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTimeRPS--;
                    if (remainingTimeRPS <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialReductionPerSecond -= 1;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case '5000 coins':
                coins += 5000;
                updateCoins();
                animacionCoin();
                break;
            case 'x3 coinsPerClick':
                upgradeBenefits.specialCoinPerClick += 2;
                updateUpgrades();
                let remainingTime3CPC = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime3CPC--;
                    if (remainingTime3CPC <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialCoinPerClick -= 2;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x3 coinsPerSecond':
                upgradeBenefits.specialCoinPerSecond += 2;
                updateUpgrades();
                let remainingTime3CPS = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime3CPS--;
                    if (remainingTime3CPS <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialCoinPerSecond -= 2;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x3 reductionPerClick':
                upgradeBenefits.specialReductionPerClick += 2;
                updateUpgrades();
                let remainingTime3RPC = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime3RPC--;
                    if (remainingTime3RPC <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialReductionPerClick -= 2;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x3 reductionPerSecond':
                upgradeBenefits.specialReductionPerSecond += 2;
                updateUpgrades();
                let remainingTime3RPS = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime3RPS--;
                    if (remainingTime3RPS <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialReductionPerSecond -= 2;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x3 coinsAll':
                upgradeBenefits.specialCoinPerClick += 2;
                upgradeBenefits.specialCoinPerSecond += 2;
                updateUpgrades();
                let remainingTime3All = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime3All--;
                    if (remainingTime3All <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialCoinPerClick -= 2;
                        upgradeBenefits.specialCoinPerSecond -= 2;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x3 reductionAll':
                upgradeBenefits.specialReductionPerClick += 2;
                upgradeBenefits.specialReductionPerSecond += 2;
                updateUpgrades();
                let remainingTime3RAll = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime3RAll--;
                    if (remainingTime3RAll <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialReductionPerClick -= 2;
                        upgradeBenefits.specialReductionPerSecond -= 2;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x3 all':
                upgradeBenefits.specialCoinPerClick += 2;
                upgradeBenefits.specialCoinPerSecond += 2;
                upgradeBenefits.specialReductionPerClick += 2;
                upgradeBenefits.specialReductionPerSecond += 2;
                updateUpgrades();
                let remainingTime3AllBoost = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime3AllBoost--;
                    if (remainingTime3AllBoost <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialCoinPerClick -= 2;
                        upgradeBenefits.specialCoinPerSecond -= 2;
                        upgradeBenefits.specialReductionPerClick -= 2;
                        upgradeBenefits.specialReductionPerSecond -= 2;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x3 all & 45000 coins':
                upgradeBenefits.specialCoinPerClick += 2;
                upgradeBenefits.specialCoinPerSecond += 2;
                upgradeBenefits.specialReductionPerClick += 2;
                upgradeBenefits.specialReductionPerSecond += 2;
                coins += 45000;
                updateCoins();
                updateUpgrades();
                let remainingTime3AllCoins = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime3AllCoins--;
                    if (remainingTime3AllCoins <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialCoinPerClick -= 2;
                        upgradeBenefits.specialCoinPerSecond -= 2;
                        upgradeBenefits.specialReductionPerClick -= 2;
                        upgradeBenefits.specialReductionPerSecond -= 2;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case '50000 coins':
                coins += 50000;
                updateCoins();
                animacionCoin();
                break;
            case 'x5 reductionAll':
                upgradeBenefits.specialReductionPerClick += 4;
                upgradeBenefits.specialReductionPerSecond += 4;
                updateUpgrades();
                let remainingTime5RAll = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime5RAll--;
                    if (remainingTime5RAll <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialReductionPerClick -= 4;
                        upgradeBenefits.specialReductionPerSecond -= 4;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x5 coinsAll':
                upgradeBenefits.specialCoinPerClick += 4;
                upgradeBenefits.specialCoinPerSecond += 4;
                updateUpgrades();
                let remainingTime5CAll = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime5CAll--;
                    if (remainingTime5CAll <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialCoinPerClick -= 4;
                        upgradeBenefits.specialCoinPerSecond -= 4;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x5 all':
                upgradeBenefits.specialCoinPerClick += 4;
                upgradeBenefits.specialCoinPerSecond += 4;
                upgradeBenefits.specialReductionPerClick += 4;
                upgradeBenefits.specialReductionPerSecond += 4;
                updateUpgrades();
                let remainingTime5All = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime5All--;
                    if (remainingTime5All <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialCoinPerClick -= 4;
                        upgradeBenefits.specialCoinPerSecond -= 4;
                        upgradeBenefits.specialReductionPerClick -= 4;
                        upgradeBenefits.specialReductionPerSecond -= 4;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x10 all':
                upgradeBenefits.specialCoinPerClick += 9;
                upgradeBenefits.specialCoinPerSecond += 9;
                upgradeBenefits.specialReductionPerClick += 9;
                upgradeBenefits.specialReductionPerSecond += 9;
                updateUpgrades();
                let remainingTime10All = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime10All--;
                    if (remainingTime10All <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialCoinPerClick -= 9;
                        upgradeBenefits.specialCoinPerSecond -= 9;
                        upgradeBenefits.specialReductionPerClick -= 9;
                        upgradeBenefits.specialReductionPerSecond -= 9;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'x10 all & 90000 coins':
                upgradeBenefits.specialCoinPerClick += 9;
                upgradeBenefits.specialCoinPerSecond += 9;
                upgradeBenefits.specialReductionPerClick += 9;
                upgradeBenefits.specialReductionPerSecond += 9;
                coins += 90000;
                updateCoins();
                updateUpgrades();
                let remainingTime10AllCoins = bonusDuration;
                bonusTimerInterval = setInterval(() => {
                    remainingTime10AllCoins--;
                    if (remainingTime10AllCoins <= 0) {
                        clearInterval(bonusTimerInterval);
                        upgradeBenefits.specialCoinPerClick -= 9;
                        upgradeBenefits.specialCoinPerSecond -= 9;
                        upgradeBenefits.specialReductionPerClick -= 9;
                        upgradeBenefits.specialReductionPerSecond -= 9;
                        updateUpgrades();
                    }
                }, 1000);
                break;
            case 'end game':
                endGame();
                break;
        }
        achieved.push(achievement.id);
        playAchievementSound();
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

function markAchievementAsNonCompleted(achievementId) {
    const achievementElement = document.getElementById(`achievement-${achievementId}`);
    if (achievementElement) {
        achievementElement.classList.remove('completed');
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
    upgradeBenefits.specialReductionPerClick += 1;
    updateUpgrades();

    document.getElementById('bonus-time-remaining').innerText = '60 s';
    const timerProgress = document.getElementById('timer-progress');
    timerProgress.style.animation = `countdown ${bonusDuration}s linear forwards`;
    showBonusTimer();

    let remainingTime = bonusDuration;
    bonusTimerInterval = setInterval(() => {
        remainingTime--;
        updateBonusTimer(remainingTime);   
        if (remainingTime <= 0) {
            clearInterval(bonusTimerInterval);
            hideBonusTimer();
            adShown = false;
            upgradeBenefits.specialReductionPerClick -= 1;
            updateUpgrades();
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

function resetBoost(){
    upgradeBenefits.specialCoinPerClick = 0;
    upgradeBenefits.specialCoinPerSecond = 0;
    upgradeBenefits.specialReductionPerClick = 0;
    upgradeBenefits.specialReductionPerSecond = 0;
}

/* -------------------------------------------- Manejo de Almacenamiento -------------------------------------------- */

function saveGame() {
    localStorage.setItem('clicks', clicks);
    localStorage.setItem('coins', coins);
    localStorage.setItem('achieved', JSON.stringify(achieved));
    localStorage.setItem('upgradeCosts', JSON.stringify(upgradeCosts));
    localStorage.setItem('upgradeBenefits', JSON.stringify(upgradeBenefits));
    localStorage.setItem('startTime', startTime.toString());
    localStorage.setItem('adShown', JSON.stringify(adShown));
    localStorage.setItem('clicksAcumulados', JSON.stringify(clicksAcumulados));
}

function loadGame() {
    clicks = localStorage.getItem('clicks') !== null ? parseInt(localStorage.getItem('clicks')) : 10000000;
    coins = localStorage.getItem('coins') !== null ? parseInt(localStorage.getItem('coins')) : 0;
    achieved = localStorage.getItem('achieved') !== null ? JSON.parse(localStorage.getItem('achieved')) : [];
    for (let i = 0; i < achieved.length; i++) {
        const achievementId = achieved[i];
        const rewardButton = document.getElementById(`reward-${achievementId}`);
        if (rewardButton) {
            rewardButton.disabled = true;
            rewardButton.textContent = 'Checked';
            markAchievementAsCompleted(achievementId);
        }
    }
    upgradeCosts = localStorage.getItem('upgradeCosts') !== null ? JSON.parse(localStorage.getItem('upgradeCosts')) : { coinsPerClick: 10, coinsPerSecond: 15, reductionPerClick: 20, reductionPerSecond: 50 };
    upgradeBenefits = localStorage.getItem('upgradeBenefits') !== null ? JSON.parse(localStorage.getItem('upgradeBenefits')) : { coinsPerClick: 1, coinsPerSecond: 0, reductionPerClick: 1, reductionPerSecond: 0, specialCoinPerClick: 0 , specialReductionPerClick: 0, specialCoinPerSecond: 0, specialReductionPerSecond: 0};
    startTime = localStorage.getItem('startTime') !== null ? new Date(localStorage.getItem('startTime')) : new Date();
    adShown = localStorage.getItem('adShown') !== null ? JSON.parse(localStorage.getItem('adShown')) : false;
    clicksAcumulados = localStorage.getItem('clicksAcumulados') !== null ? JSON.parse(localStorage.getItem('clicksAcumulados')) : 0;
}

function resetGame() {
    if (confirm('Are you sure you want to restart the game?')) {
        clicks = 10000000;
        coins = 0;
        for (let i = 0; i < achieved.length; i++) {
            const achievementId = achieved[i];
            const rewardButton = document.getElementById(`reward-${achievementId}`);
            if (rewardButton) {
                rewardButton.disabled = true;
                rewardButton.textContent = 'Get Reward';
                markAchievementAsNonCompleted(achievementId);
            }
        }
        achieved = [];
        upgradeCosts = { coinsPerClick: 10, coinsPerSecond: 15, reductionPerClick: 20, reductionPerSecond: 50 };
        upgradeBenefits = { coinsPerClick: 1, coinsPerSecond: 0, reductionPerClick: 1, reductionPerSecond: 0, specialCoinPerClick: 0 , specialReductionPerClick: 0, specialCoinPerSecond: 0, specialReductionPerSecond: 0};
        startTime = new Date();
        adShown = false;
        clicksAcumulados = 0; 
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
    bonusTimerContainer.style.animation = 'none';
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
    resetBoost();
    updateUpgrades();
    updateUpgradeButtons(coins);
    updateGlassImage();
    checkAchievements();
    startTimer();
    setInterval(showAd, adInterval);
    setInterval(reductionPerSecond, 1000);
    setInterval(autoCoin, 10000);
}