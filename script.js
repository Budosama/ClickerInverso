/* -------------------------------------------- Variables y Configuración Inicial -------------------------------------------- */

let initialDurability = 10000000;
let durability = 10000000;
let totalClicks = 0;
let coins = 0;
let totalCoins = 0;
let totalAdWatched = 0;
let totalCriticalHits = 0;
let startTime;
let adInterval = 2 * 60 * 1000;
let bonusDuration = 60;
let adShown = false;
let clicksAcumulados = 0;
let costFactor = 2.5; 
let benefictFactor = 2; 
let criticalRate = 0.05;
let achieved = [];

let bonusGame = [
    { id: 'coinsPerClick', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/coin.png", alt: "CoinUpgrade", txt: "Coins/10 Clicks:", benefit: 1, cost: 10, level: 1 },
    { id: 'coinsPerSecond', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/coin.png", alt: "CoinUpgrade", txt: "Coins/10 Seconds:", benefit: 1, cost: 15, level: 1 },
    { id: 'reductionPerClick', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/hammer.png", alt: "DamageUpgrade", txt: "Damage/Click:", benefit: 1, cost: 20, level: 1, adShown: false },
    { id: 'reductionPerSecond', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/hammer.png", alt: "DamageUpgrade", txt: "Damage/Second:", benefit: 1, cost: 50, level: 1 }
];
const achievements = [
    { id: '100-damage', description: '100 damage', conditionDmg: 9999900, coins: 10, boost: '', multiplicador: 0, critical: 0 },
    { id: '500-damage', description: '500 damage', conditionDmg: 9999500, coins: 50, boost: '', multiplicador: 0, critical: 0 },
    { id: '1000-damage', description: '1000 damage', conditionDmg: 9999000, coins: 100, boost: '', multiplicador: 0, critical: 0 },
    { id: '2500-damage', description: '2500 damage', conditionDmg: 9997500, coins: 250, boost: '', multiplicador: 0, critical: 0 },
    { id: '5000-damage', description: '5000 damage', conditionDmg: 9995000, coins: 500, boost: '', multiplicador: 0, critical: 0 },
    { id: '10000-damage', description: '10.000 damage', conditionDmg: 9990000, coins: 0, boost: 'coinsPerClick', multiplicador: 2, critical: 0 },
    { id: '50000-damage', description: '50.000 damage', conditionDmg: 9950000, coins: 0, boost: 'coinsPerSecond', multiplicador: 2, critical: 0 },
    { id: '100000-damage', description: '100.000 damage', conditionDmg: 9900000, coins: 0, boost: 'reductionPerClick', multiplicador: 2, critical: 0 },
    { id: '250000-damage', description: '250.000 damage', conditionDmg: 9750000, coins: 0, boost: 'reductionPerSecond', multiplicador: 2, critical: 0 },
    { id: '500000-damage', description: '500.000 damage', conditionDmg: 9500000, coins: 5000, boost: '', multiplicador: 0, critical: 0 },
    { id: '1000000-damage', description: '1.000.000 damage', conditionDmg: 9000000, coins: 0, boost: 'coinsPerClick', multiplicador: 3, critical: 0 },
    { id: '1500000-damage', description: '1.500.000 damage', conditionDmg: 8500000, coins: 0, boost: 'coinsPerSecond', multiplicador: 3, critical: 0 },
    { id: '2000000-damage', description: '2.000.000 damage', conditionDmg: 8000000, coins: 0, boost: 'reductionPerClick', multiplicador: 3, critical: 0 },
    { id: '2500000-damage', description: '2.500.000 damage', conditionDmg: 7500000, coins: 0, boost: 'reductionPerSecond', multiplicador: 3, critical: 0 },
    { id: '3000000-damage', description: '3.000.000 damage', conditionDmg: 7000000, coins: 0, boost: 'coinsAll', multiplicador: 3, critical: 0 },
    { id: '3500000-damage', description: '3.500.000 damage', conditionDmg: 6500000, coins: 0, boost: 'reductionAll', multiplicador: 3, critical: 0 },
    { id: '4000000-damage', description: '4.000.000 damage', conditionDmg: 6000000, coins: 0, boost: 'all', multiplicador: 3, critical: 0 },
    { id: '4500000-damage', description: '4.500.000 damage', conditionDmg: 5500000, coins: 0, boost: 'all', multiplicador: 3, critical: 0.25 },
    { id: '5000000-damage', description: '5.000.000 damage', conditionDmg: 5000000, coins: 50000, boost: '', multiplicador: 0, critical: 0 },
    { id: '5500000-damage', description: '5.500.000 damage', conditionDmg: 4500000, coins: 0, boost: 'reductionAll', multiplicador: 5, critical: 0 },
    { id: '6000000-damage', description: '6.000.000 damage', conditionDmg: 4000000, coins: 0, boost: 'coinsAll', multiplicador: 5, critical: 0 },
    { id: '7000000-damage', description: '7.000.000 damage', conditionDmg: 3000000, coins: 0, boost: 'all', multiplicador: 5, critical: 0 },
    { id: '8000000-damage', description: '8.000.000 damage', conditionDmg: 2000000, coins: 0, boost: 'all', multiplicador: 7, critical: 0 },
    { id: '9000000-damage', description: '9.000.000 damage', conditionDmg: 1000000, coins: 0, boost: 'all', multiplicador: 0, critical: 0.70 },
    { id: '10000000-damage', description: '10.000.000 damage', conditionDmg: 0, coins: 0, boost: '', multiplicador: 0, critical: 0 },
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

function updateDurability() {
    document.getElementById('durability').innerText = formatNumber(durability);
    document.getElementById('total-damage').innerText = formatNumber(initialDurability - durability);
}

function updateCoins() {
    document.getElementById('coins').innerText = formatNumber(coins);
    updateUpgradeButtons(coins);
}

function updateCriticalRate() {
    document.getElementById('criticalRate').innerText = `${formatNumber(criticalRate*100)}%`;
}

function updateStats(totalSeconds) {
    document.getElementById('total-coins').innerText = formatNumber(totalCoins);
    document.getElementById('total-clicks').innerText = formatNumber(totalClicks);
    document.getElementById('ads-watched').innerText = formatNumber(totalAdWatched);
    document.getElementById('total-critical-hits').innerText = formatNumber(totalCriticalHits);
    document.getElementById('damage-second').innerText = ((initialDurability - durability) / totalSeconds).toFixed(2);
    document.getElementById('clicks-second').innerText = (totalClicks / totalSeconds).toFixed(2);
    document.getElementById('coins-second').innerText = (totalCoins / totalSeconds + bonusGame[1].benefit).toFixed(2);    
}

function updateUpgrades() {
    bonusGame.forEach(bonus => {
        var boton = document.getElementById(`${bonus.id}Upgrade`);
        if (bonus.activeBonuses.length > 0) {
            boton.classList.add('bonus-active');
            boton.innerHTML = `
                <img src="${bonus.src}" alt="${bonus.alt}" style="width:20px; vertical-align:middle; margin-right:5px;">
                ${bonus.txt} ${formatNumber(bonus.benefit)} (x${bonus.multiplicador})
                <span class="timer">${bonus.duration}s <img src="img/boost.png" alt="Boost" style="width:20px; vertical-align:middle; margin-left:5px;"></span>
            `;
        } else {
            boton.classList.remove('bonus-active');
            boton.innerHTML = `
                <img src="${bonus.src}" alt="${bonus.alt}" style="width:20px; vertical-align:middle; margin-right:5px;">
                ${bonus.txt} ${formatNumber(bonus.benefit)}
            `;
        }
    });
}

function updateUpgradeButtons(coins) {
    document.getElementById('coinsPerClickButton').innerHTML = `Coins/10 Clicks - Level: ${(bonusGame[0].level)} - Cost: ${formatNumber(bonusGame[0].cost)} <img src="img/coin.png" alt="Coins" style="width:20px; vertical-align:middle; margin-right:5px;">`;
    document.getElementById('coinsPerSecondButton').innerHTML = `Coins/10 Seconds - Level: ${(bonusGame[1].level)} - Cost: ${formatNumber(bonusGame[1].cost)} <img src="img/coin.png" alt="Coins" style="width:20px; vertical-align:middle; margin-right:5px;">`;
    document.getElementById('reductionPerClickButton').innerHTML = `Damage/Click - Level: ${(bonusGame[2].level)} - Cost: ${formatNumber(bonusGame[2].cost)} <img src="img/coin.png" alt="Coins" style="width:20px; vertical-align:middle; margin-right:5px;">`;
    document.getElementById('reductionPerSecondButton').innerHTML = `Damage/Second - Level: ${(bonusGame[3].level)} - Cost: ${formatNumber(bonusGame[3].cost)} <img src="img/coin.png" alt="Coins" style="width:20px; vertical-align:middle; margin-right:5px;">`;

    document.getElementById('coinsPerClickButton').setAttribute('data-cost', bonusGame[0].cost);
    document.getElementById('coinsPerSecondButton').setAttribute('data-cost', bonusGame[1].cost);
    document.getElementById('reductionPerClickButton').setAttribute('data-cost', bonusGame[2].cost);
    document.getElementById('reductionPerSecondButton').setAttribute('data-cost', bonusGame[3].cost);
    
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
    const hitAnimation = document.getElementById('hit-animation');
    
    // Obtener la posición del clic relativa al elemento glass
    const rect = glass.getBoundingClientRect();
    const clickX = (event.clientX - rect.left +50);
    const clickY = (event.clientY - rect.top -10);

    // Posicionar la animación del golpe en la posición del clic
    hitAnimation.style.left = `${clickX - hitAnimation.offsetWidth / 2}px`;
    hitAnimation.style.top = `${clickY - hitAnimation.offsetHeight / 2}px`;

    // Mostrar la animación del golpe
    hitAnimation.classList.remove('hidden');
    hitAnimation.style.opacity = '1';

    // Ocultar la animación del golpe después de 1 segundo
    setTimeout(() => {
        hitAnimation.style.opacity = '0';
        hitAnimation.addEventListener('transitionend', () => {
            hitAnimation.classList.add('hidden');
        }, { once: true });
    }, 100);

    glass.classList.add('hammer2');
    setTimeout(() => {
        glass.classList.remove('hammer2');
    }, 100);

    const shardsContainer = document.getElementById('shards-container');
    glass.classList.add('breaking');
    updateGlassImage('Hit');

    glass.addEventListener('animationend', () => {
        glass.classList.remove('breaking');
        updateGlassImage('');
    }, { once: true });

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

        shard.addEventListener('transitionend', () => {
            shard.remove();
        }, { once: true });
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
    if (durability > 0) {
        totalClicks += 1;
        document.getElementById('total-clicks').innerText = formatNumber(totalClicks);
        clicksAcumulados += 1;
        let reductionPerClick = bonusGame[2].benefit;
        if (bonusGame[2].activeBonuses.length > 0 && bonusGame[2].multiplicador > 0) {
            reductionPerClick *= bonusGame[2].multiplicador;
        }
        durability = Math.max(0, durability - reductionPerClick);
        let coinsEarned = bonusGame[0].benefit;
        if (bonusGame[0].activeBonuses.length > 0 && bonusGame[0].multiplicador > 0) {
            coinsEarned *= bonusGame[0].multiplicador;
        }
        if(clicksAcumulados % 10 === 0) {
            coins += coinsEarned;
            totalCoins += coinsEarned;
            document.getElementById('total-coins').innerText = formatNumber(totalCoins);
            animacionCoin();
        }
        showDamage(reductionPerClick);
        animacionGlass();
        updateDurability();
        updateCoins(); 
        checkAchievements();
        saveGame();
        createShards();
        playGlassSound(); 
    }
}

function showDamage(damage) {
    const glassContainer = document.getElementById('glass-container');
    const damageDisplay = document.createElement('div');
    const isCritical = Math.random() < criticalRate;

    if (isCritical) {
        damage *= 2; 
        damageDisplay.classList.add('damage-display', 'critical');
        totalCriticalHits += 1;
        document.getElementById('total-critical-hits').innerText = formatNumber(totalCriticalHits);
    } else {
        damageDisplay.classList.add('damage-display');
    }

    const randomX = Math.random() * (glassContainer.offsetWidth); 
    const randomY = Math.random() * (glassContainer.offsetHeight); 
    damageDisplay.style.left = `${randomX}px`;
    damageDisplay.style.top = `${randomY}px`;
    damageDisplay.innerText = `-${formatNumber(damage)}`;
    glassContainer.appendChild(damageDisplay);

    damageDisplay.addEventListener('animationend', () => {
        damageDisplay.remove(); 
    });
}

function reductionPerSecond() {
    if (durability > 0) {
        let reduction = bonusGame[3].benefit;
        if (bonusGame[3].activeBonuses > 0 && bonusGame[3].multiplicador > 0) {
            reduction *= bonusGame[3].multiplicador;
        }
        durability = Math.max(0, durability - reduction);
        updateDurability();
        updateGlassImage('');
        checkAchievements();
        saveGame();
    }
}

function coinPerSecond() {
    if (durability > 0) {
        let beneficio = bonusGame[1].benefit;
        if (bonusGame[1].activeBonuses > 0 && bonusGame[1].multiplicador > 0) {
            beneficio *= bonusGame[1].multiplicador;
        }
        coins = Math.max(0, coins + beneficio);
        totalCoins += beneficio;
        document.getElementById('total-coins').innerText = `${formatNumber(totalCoins)}`;
        updateCoins();
        animacionCoin();
        saveGame();
    }
}

function updateGlassImage(hit) {
    const glass = document.getElementById('glass');
    for (let i = 0; i < achievements.length - 21; i++) {
        if (durability > achievements[i].conditionDmg) {
            glass.src = `img/window${i}${hit}.png`;
            break;
        }
    }
}

function buyUpgrade(id) {
    let bonus = bonusGame.find(b => b.id === id);
    if (coins >= bonus.cost) {
        coins -= bonus.cost;
        bonus.cost = Math.ceil(bonus.cost * costFactor);
        bonus.benefit *= benefictFactor;
        bonus.level += 1;
        animacionCoin();  
    }
    updateCoins();
    updateUpgrades();
    updateUpgradeButtons(coins);
    saveGame();
}

/* -------------------------------------------- Manejo de Logros -------------------------------------------- */

function checkAchievements() {
    achievements.forEach(achievement => {
        const rewardButton = document.getElementById(`reward-${achievement.id}`);     
        if (durability <= achievement.conditionDmg && !achieved.includes(achievement.id)) {
            rewardButton.disabled = false;
        } else {
            rewardButton.disabled = true;
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

function setBonusInterval(bonus, multiplicador, ad) {
    const newBonus = { duration: 60, multiplicador: multiplicador};
    bonus.activeBonuses.push(newBonus);

    if(ad){
        adShown = ad;
        bonus.adShown = ad;
    }
    showBonusTimer(bonus.id);

    // Si no hay un intervalo activo, crea uno
    if (!bonus.bonusTimerInterval) {
        bonus.bonusTimerInterval = setInterval(() => {
            // Filtra los bonos activos que aún no han expirado
            bonus.activeBonuses = bonus.activeBonuses.filter(b => {
                b.duration--;
                return b.duration > 0;
            });

            // Actualiza el multiplicador
            bonus.multiplicador = bonus.activeBonuses.reduce((total, b) => total + b.multiplicador, 0);

            // Actualiza el temporizador visual
            const remainingDuration = bonus.activeBonuses.length > 0 ? Math.max(...bonus.activeBonuses.map(b => b.duration)) : 0;
            bonus.duration = remainingDuration;
            updateBonusTimer(bonus.id, remainingDuration);

            if (bonus.activeBonuses.length === 0) {
                clearInterval(bonus.bonusTimerInterval);
                bonus.bonusTimerInterval = null;
                hideBonusTimer(bonus.id);
                if(ad){
                    bonus.adShown = false;
                    adShown = false;
                }
            }

            updateUpgrades();
            saveGame();
        }, 1000);
    }

    saveGame();
}

function getReward(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achieved.includes(achievementId)) {
        // Sumar monedas si corresponde
        if (achievement.coins > 0) {
            coins += achievement.coins;
            totalCoins += achievement.coins;
            updateCoins();
        }

        if (achievement.critical > 0) {
            criticalRate += achievement.critical;         
            updateCriticalRete();
        }

        // Manejar actualizaciones específicas
        if (achievement.boost) {
            const bonus = bonusGame.find(b => b.id === achievement.boost);
            if (bonus) {            
                setBonusInterval(bonus, achievement.multiplicador, false);
            }

            // Manejar actualizaciones globales
            if (achievement.boost === 'coinsAll' || achievement.boost === 'reductionAll' || achievement.boost === 'all') {
                bonusGame.forEach(bonus => {
                    if (achievement.boost === 'coinsAll' && bonus.id.includes('coins')) {
                        setBonusInterval(bonus, achievement.multiplicador, false);
                    }
                    if (achievement.boost === 'reductionAll' && bonus.id.includes('reduction')) {
                        setBonusInterval(bonus, achievement.multiplicador, false);
                    }
                    if (achievement.boost === 'all') {
                        setBonusInterval(bonus, achievement.multiplicador, false);
                    }
                });
            }
        }

        achieved.push(achievement.id);    
        const rewardButton = document.getElementById(`reward-${achievementId}`);
        rewardButton.disabled = true;
        rewardButton.textContent = 'Checked';
        updateAchivementCounter();
        playAchievementSound();
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

function updateAchivementCounter() {
    const achievementCounter = document.getElementById('achievement-counter');
    achievementCounter.textContent = `Achievements (${achieved.length}/${achievements.length})`;
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
        saveGame();
    }
}

function watchAd() {
    let bonus = bonusGame.find(i => i.id === 'reductionPerClick');
    totalAdWatched += 1;
    document.getElementById('ads-watched').innerText = formatNumber(totalAdWatched);
    setBonusInterval(bonus, 2, true);
    hideAdContainer();
}

function rejectAd() {
    hideAdContainer();
    adShown = false;
    saveGame();
}

/* -------------------------------------------- Manejo de Almacenamiento -------------------------------------------- */

function saveGame() {
    localStorage.setItem('durability', durability);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('coins', coins);
    localStorage.setItem('totalCoins', totalCoins);
    localStorage.setItem('totalAdWatched', totalAdWatched);
    localStorage.setItem('totalCriticalHits', totalCriticalHits);
    localStorage.setItem('achieved', JSON.stringify(achieved));
    localStorage.setItem('bonusGame', JSON.stringify(bonusGame));
    localStorage.setItem('startTime', startTime.toString());
    localStorage.setItem('adShown', JSON.stringify(adShown));
    localStorage.setItem('clicksAcumulados', JSON.stringify(clicksAcumulados));
    localStorage.setItem('criticalRate', JSON.stringify(criticalRate));
}

function loadGame() {
    durability = localStorage.getItem('durability') !== null ? parseInt(localStorage.getItem('durability')) : initialDurability;
    totalClicks = localStorage.getItem('totalClicks') !== null ? parseInt(localStorage.getItem('totalClicks')) : 0;
    coins = localStorage.getItem('coins') !== null ? parseInt(localStorage.getItem('coins')) : 0;
    totalCoins = localStorage.getItem('totalCoins') !== null ? parseInt(localStorage.getItem('totalCoins')) : 0;
    totalAdWatched = localStorage.getItem('totalAdWatched') !== null ? parseInt(localStorage.getItem('totalAdWatched')) : 0;
    totalCriticalHits = localStorage.getItem('totalCriticalHits') !== null ? parseInt(localStorage.getItem('totalCriticalHits')) : 0;
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
    bonusGame = localStorage.getItem('bonusGame') !== null ? JSON.parse(localStorage.getItem('bonusGame')) : [
        { id: 'coinsPerClick', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/coin.png", alt: "CoinUpgrade", txt: "Coins/10 Clicks:", benefit: 1, cost: 10, level: 1 },
        { id: 'coinsPerSecond', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/coin.png", alt: "CoinUpgrade", txt: "Coins/10 Seconds:", benefit: 1, cost: 15, level: 1 },
        { id: 'reductionPerClick', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/hammer.png", alt: "DamageUpgrade", txt: "Damage/Click:", benefit: 1, cost: 20, level: 1, adShown: false },
        { id: 'reductionPerSecond', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/hammer.png", alt: "DamageUpgrade", txt: "Damage/Second:", benefit: 1, cost: 50, level: 1 }
    ];
    startTime = localStorage.getItem('startTime') !== null ? new Date(localStorage.getItem('startTime')) : new Date();
    adShown = localStorage.getItem('adShown') !== null ? JSON.parse(localStorage.getItem('adShown')) : false;
    clicksAcumulados = localStorage.getItem('clicksAcumulados') !== null ? JSON.parse(localStorage.getItem('clicksAcumulados')) : 0;
    criticalRate = localStorage.getItem('criticalRate') !== null ? JSON.parse(localStorage.getItem('criticalRate')) : 0.05;
}

function resetGame() {
    if (confirm('Are you sure you want to restart the game?')) {
        durability = initialDurability;
        totalClicks = 0;
        coins = 0;
        totalCoins = 0;
        totalAdWatched = 0;
        totalCriticalHits = 0;
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
        bonusGame = [
            { id: 'coinsPerClick', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/coin.png", alt: "CoinUpgrade", txt: "Coins/10 Clicks:", benefit: 1, cost: 10, level: 1 },
            { id: 'coinsPerSecond', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/coin.png", alt: "CoinUpgrade", txt: "Coins/10 Seconds:", benefit: 1, cost: 15, level: 1 },
            { id: 'reductionPerClick', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/hammer.png", alt: "DamageUpgrade", txt: "Damage/Click:", benefit: 1, cost: 20, level: 1, adShown: false },
            { id: 'reductionPerSecond', activeBonuses: [], bonusTimerInterval: null, duration: 0, multiplicador: 0, src: "img/hammer.png", alt: "DamageUpgrade", txt: "Damage/Second:", benefit: 1, cost: 50, level: 1 }
        ];
        startTime = new Date();
        adShown = false;
        clicksAcumulados = 0; 
        criticalRate = 0.05;
        updateDurability();
        updateCoins();
        updateStats(1);
        updateUpgrades();
        updateUpgradeButtons(coins);
        updateGlassImage('');
        updateAchivementCounter();
        checkAchievements();
        saveGame();
    }
}

/* -------------------------------------------- Control del Tiempo -------------------------------------------- */

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
    document.getElementById('total-time').innerText = `${hours}:${minutes}:${seconds}`;
    const totalSeconds = parseInt(seconds) + parseInt(minutes) * 60 + parseInt(hours) * 3600;
    updateStats(totalSeconds);
}

/* -------------------------------------------- Control del Temporizador -------------------------------------------- */

function updateBonusTimer(bonusId, duration) {
    const timerElement = document.getElementById(`${bonusId}Timer`);
    if (timerElement) {
        timerElement.textContent = formatDuration(duration);
    }
}

function showBonusTimer(bonusId) {
    const timerElement = document.getElementById(`${bonusId}Timer`);
    if (timerElement) {
        timerElement.style.display = 'inline';
    }
}

function hideBonusTimer(bonusId) {
    const timerElement = document.getElementById(`${bonusId}Timer`);
    if (timerElement) {
        timerElement.style.display = 'none';
        timerElement.textContent = ''; // Limpiar el temporizador
    }
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/* -------------------------------------------- Funciones de Utilidad -------------------------------------------- */

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* -------------------------------------------- Inicialización del Juego -------------------------------------------- */

window.onload = function() {
    loadGame();
    updateDurability();
    updateCoins();
    updateUpgrades();
    updateUpgradeButtons(coins);
    updateCriticalRate();
    updateGlassImage('');
    updateAchivementCounter();
    checkAchievements();
    startTimer();
    setInterval(showAd, adInterval);
    setInterval(reductionPerSecond, 1000);
    setInterval(coinPerSecond, 10000);
    bonusGame.forEach(bonus => {
        reinitializeBonus(bonus);
    });
}

function reinitializeBonus(bonus) {
    if (bonus.activeBonuses.length > 0) {
        clearInterval(bonus.bonusTimerInterval);
        showBonusTimer(bonus.id);
        if(bonus.adShown){
            adShown = bonus.adShown;
        }
        bonus.bonusTimerInterval = setInterval(() => {
            // Filtra los bonos activos que aún no han expirado
            bonus.activeBonuses = bonus.activeBonuses.filter(b => {
                b.duration--;
                return b.duration > 0;
            });

            // Actualiza el multiplicador
            bonus.multiplicador = bonus.activeBonuses.reduce((total, b) => total + b.multiplicador, 0);

            // Actualiza el temporizador visual
            const remainingDuration = bonus.activeBonuses.length > 0 ? Math.max(...bonus.activeBonuses.map(b => b.duration)) : 0;
            bonus.duration = remainingDuration;
            updateBonusTimer(bonus.id, remainingDuration);

            if (bonus.activeBonuses.length === 0) {
                clearInterval(bonus.bonusTimerInterval);
                bonus.bonusTimerInterval = null;
                hideBonusTimer(bonus.id);
                if(bonus.adShown){
                    adShown = false;
                }
            }

            updateUpgrades();
            saveGame();
        }, 1000);
    }
}

/* -------------------------------------------- Objetos voladores -------------------------------------------- */

let movingWindowClicks = 0;
const movingWindow = document.createElement('div');
movingWindow.id = 'moving-window';
const mainContent = document.querySelector('.main-content');
mainContent.appendChild(movingWindow);

let posX = 0;
let posY = 0;
let velocityX = 2; // Velocidad en el eje X
let velocityY = 2; // Velocidad en el eje Y

function showMovingWindow() {
    movingWindow.style.display = 'block';
    movingWindowClicks = 0;
    posX = Math.random() * (mainContent.clientWidth  - movingWindow.offsetWidth);
    posY = Math.random() * (mainContent.clientHeight - movingWindow.offsetHeight);
    moveWindowRandomly();

    // Agregar el evento de clic
    movingWindow.addEventListener('click', handleWindowClick);
}

function moveWindowRandomly() {
    const limitX = mainContent.clientWidth - movingWindow.offsetWidth;
    const limitY = mainContent.clientHeight - movingWindow.offsetHeight;

    function updatePosition() {
        posX += velocityX;
        posY += velocityY;

        // Cambio de dirección en los límites
        if (posX <= 0 || posX >= limitX) {
            velocityX = -velocityX;
        }
        if (posY <= 0 || posY >= limitY) {
            velocityY = -velocityY;
        }

        movingWindow.style.transform = `translate(${posX}px, ${posY}px)`;
    }

    setInterval(updatePosition, 10); // Actualización cada 10ms para un movimiento suave
}

function handleWindowClick() {
    movingWindowClicks += 1;
    if (movingWindowClicks >= 10) {
        movingWindow.style.display = 'none';
        movingWindow.removeEventListener('click', handleWindowClick);
        alert('Window broken! You got a reward!');
        // Aquí puedes agregar la lógica para otorgar la recompensa
    }
}