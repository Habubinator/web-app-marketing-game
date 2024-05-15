const assets = {
    background: new Image(),
    boss: [],
    worker1: [],
    worker2: [],
    worker3: [],
    light1: [],
    light2: [],
    screen1: [],
    screen2: [],
};

// Background
assets.background.src = "./../assets/bg.png";

for (let i = 0; i < 12; i++) {
    // Boss
    assets.boss[i] = new Image();
    assets.boss[i].src = `./../assets/characters/boss/${i + 1}.png`;

    // Worker 1
    assets.worker1[i] = new Image();
    assets.worker1[i].src = `./../assets/characters/worker1/${i + 1}.png`;

    // Worker 2
    assets.worker2[i] = new Image();
    assets.worker2[i].src = `./../assets/characters/worker2/${i + 1}.png`;

    // Worker 3
    assets.worker3[i] = new Image();
    assets.worker3[i].src = `./../assets/characters/worker3/${i + 1}.png`;

    if (i < 7) {
        // Light 1
        assets.light1[i] = new Image();
        assets.light1[i].src = `./../assets/misc/light1/${i + 1}.png`;

        // Light 1
        assets.light2[i] = new Image();
        assets.light2[i].src = `./../assets/misc/light2/${i + 1}.png`;
    }

    if (i < 10) {
        // Screen 1
        assets.screen1[i] = new Image();
        assets.screen1[i].src = `./../assets/misc/screen1/${i + 1}.png`;
    }

    // Screen 2
    assets.screen2[i] = new Image();
    assets.screen2[i].src = `./../assets/misc/screen2/${i + 1}.png`;
}

export { assets };
