import { assets } from "./../js/assets.js";
import * as gameClass from "./classes/characters.js";

const tg = window.Telegram.WebApp;
tg.expand();

/*
{
        query_id: "AAEIQ6IeAAAAAAhDoh4hiL7H",
        user: {
            id: 513950472,
            first_name: "Жекіч",
            last_name: "🇺🇦🥟",
            username: "Munakuso",
            language_code: "ru",
            is_premium: true,
            allows_write_to_pm: true,
        },
        auth_date: "1715765835",
        hash: "7de6599114cda0d90321c9819eea0595807f31fecd3d4fd8ecda22e87abf6c0f",
    }
*/
const userData = {
    user: {
        query_id: "AAEIQ6IeAAAAAAhDoh4hiL7H",
        user: {
            id: 513950472,
            first_name: "Жекіч",
            last_name: "🇺🇦🥟",
            username: "Munakuso",
            language_code: "ru",
            is_premium: true,
            allows_write_to_pm: true,
        },
        auth_date: "1715765835",
        hash: "7de6599114cda0d90321c9819eea0595807f31fecd3d4fd8ecda22e87abf6c0f",
    },
    coins: 0,
};

async function initMethods() {
    await authUser(userData);
    await sendOnlineMsg();
}

/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let clickableObjects = [];
const fps = 30;
let gameObjects = [];
// Временный костыль
let oldReferalCount = 0;

initMethods();
setInterval(sendOnlineMsg, 1000);
window.onload = init;

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    gameObjects = [new gameClass.Boss(), new gameClass.Light2()];

    clickableObjects = [
        new gameClass.InviteFriends(65, 365, 140, 110),
        new gameClass.InviteFriends(320, 420, 120, 105),
        new gameClass.InviteFriends(125, 530, 190, 130),
        new gameClass.InviteFriends(40, 150, 70, 100),
    ];
    canvas.addEventListener("mousedown", function (e) {
        const { x, y } = getMousePosition(canvas, e);
        clickableObjects.forEach((obj) => {
            let isValidOnX = x >= obj.x && x <= obj.x + obj.width;
            let isValidOnY = y >= obj.y && y <= obj.y + obj.height;
            if (isValidOnX && isValidOnY) {
                obj.click({ tg, user: userData, canvas, ctx });
            }
        });
    });

    globalThis.gameObjects = gameObjects;
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    drawSpecificUserCount();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(assets.background, 0, 0, 480, 800);
    gameObjects.forEach((obj) => {
        if (getRandomInt(100) == 1) {
            obj.animate();
        }
        obj.draw(ctx, timeStamp);
    });
    gameObjects.forEach((obj) => {
        obj.update();
    });
    ctx.font = "48px serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`Coins: ${userData.coins}`, 10, 50);
    setTimeout(() => {
        requestAnimationFrame(gameLoop);
    }, 1000 / fps);
}

async function sendOnlineMsg() {
    try {
        let res = await (
            await fetch("/api/online", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({ user: userData.user }),
            })
        ).json();

        userData.coins = res.coins;
        userData.user.user = res.user;
        userData.referalCount = +res.referalCount;
    } catch (error) {
        console.log(error);
        alert("Произошла ошибка, возможно сервер оффлайн.");
    }
}

async function authUser(userData) {
    console.log(
        await (
            await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({ user: userData.user }),
            })
        ).json()
    );
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width; // Масштаб по оси X
    let scaleY = canvas.height / rect.height; // Масштаб по оси Y
    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    return { x, y };
}

function drawSpecificUserCount() {
    if (userData.referalCount == oldReferalCount) {
        return;
    }
    if (userData.referalCount == 1) {
        return (gameObjects = [
            new gameClass.Boss(),
            new gameClass.Light2(),
            new gameClass.Screen2(),
            new gameClass.Worker1(),
        ]);
    }
    if (userData.referalCount == 2) {
        return (gameObjects = [
            new gameClass.Boss(),
            new gameClass.Light2(),
            new gameClass.Screen2(),
            new gameClass.Worker1(),
            new gameClass.Light1(),
            new gameClass.Screen1(),
            new gameClass.Worker2(),
        ]);
    }
    if (userData.referalCount >= 3) {
        return (gameObjects = [
            new gameClass.Boss(),
            new gameClass.Light2(),
            new gameClass.Screen2(),
            new gameClass.Worker1(),
            new gameClass.Light1(),
            new gameClass.Screen1(),
            new gameClass.Worker2(),
            new gameClass.Worker3(),
        ]);
    }
}
