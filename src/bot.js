const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const db = require("./server/database/dbController.js");

bot.setMyCommands([
    { command: "/start", description: "Открыть веб-апп" },
    { command: "/referal", description: "Получить реферальную ссылку" },
]);

bot.onText(/\/start(.+)?/, async (msg, match) => {
    try {
        const chatId = msg.chat.id;
        const resp = match[1] ? match[1].trim() : null;

        // Проверяем, есть ли параметры
        if (resp) {
            const result = await db.addUserWorker(resp, msg.from.id);
            if (result.user) {
                if (result.already_exists) {
                    await bot.sendMessage(
                        chatId,
                        `Вы уже были приглашены данным пользователем`
                    );
                } else {
                    await bot.sendMessage(
                        chatId,
                        `Вы были приглашены пользователем @${result.user.username}`
                    );
                }
            } else {
                await bot.sendMessage(
                    chatId,
                    `Данное приглашение в игру не может быть активировано`
                );
            }
        }
        // Отправка общего сообщения
        bot.sendMessage(chatId, "Перейдите в веб-апп по кнопке ниже 👇", {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Запустить игру!",
                            web_app: {
                                url: "https://web-app-marketing-game.onrender.com/",
                            },
                        },
                    ],
                ],
            },
        });
    } catch (error) {
        console.log(error);
    }
});

bot.on("polling_error", (error) => {
    if (Math.floor(process.uptime()) >= 60) {
        process.exit(0);
    }
});

module.exports = bot;
