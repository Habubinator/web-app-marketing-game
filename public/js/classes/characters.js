import { assets } from "./../assets.js";

export class GameObj {
    constructor() {
        this.assets;
        this.maxFrame;
        this.currentFrame = 0;
        this.x = 0;
        this.y = 0;
        this.width = 480;
        this.height = 800;
    }

    draw(ctx, timeStamp) {
        if (this.currentFrame > 0 && this.currentFrame < this.maxFrame - 1) {
            this.currentFrame++;
        } else {
            this.currentFrame = 0;
        }
        ctx.drawImage(
            this.assets[this.currentFrame],
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
    animate() {
        if (this.currentFrame == 0) {
            this.currentFrame = 1;
        }
    }

    update() {}
}

export class ClickRectangle extends GameObj {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxFrame = 0;
        this.currentFrame = 0;
    }
    click() {}
}

export class Boss extends GameObj {
    constructor() {
        super();
        this.assets = assets.boss;
        this.maxFrame = 12;
        this.currentFrame = 0;
    }
}

export class Worker1 extends GameObj {
    constructor() {
        super();
        this.assets = assets.worker1;
        this.maxFrame = 12;
        this.currentFrame = 0;
    }
}

export class Worker2 extends GameObj {
    constructor() {
        super();
        this.assets = assets.worker2;
        this.maxFrame = 12;
        this.currentFrame = 0;
    }
}

export class Worker3 extends GameObj {
    constructor() {
        super();
        this.assets = assets.worker3;
        this.maxFrame = 12;
        this.currentFrame = 0;
    }
}

export class Light1 extends GameObj {
    constructor() {
        super();
        this.assets = assets.light1;
        this.maxFrame = 7;
        this.currentFrame = 0;
    }
}

export class Light2 extends GameObj {
    constructor() {
        super();
        this.assets = assets.light2;
        this.maxFrame = 7;
        this.currentFrame = 0;
    }
}

export class Screen1 extends GameObj {
    constructor() {
        super();
        this.assets = assets.screen1;
        this.maxFrame = 10;
        this.currentFrame = 0;
    }
}

export class Screen2 extends GameObj {
    constructor() {
        super();
        this.assets = assets.screen2;
        this.maxFrame = 12;
        this.currentFrame = 0;
    }
}

export class InviteFriends extends ClickRectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
    click(params) {
        //TODO - не забыть поменять на проде
        console.log(params);
        params.tg.openTelegramLink(
            `https://t.me/share/url?url=https://t.me/hoodEvgTestBot?start=${params.user.user.user.id}&text=Твой друг пригласил тебя в игру, переходи в его компанию!`
        );
    }
}
