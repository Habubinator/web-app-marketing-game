const db = require("../database/dbController.js");

const cISForUser = 1;
const cISForReferal = 1;
class ApiController {
    // Method to get all items
    async online(req, res) {
        try {
            const { user } = req.body;
            await db.updateUserLastApiTrigger(
                user.user.id,
                Math.floor(Date.now() / 1000)
            );
            const referalCount = await db.countUserWorkersByOwnerId(
                user.user.id
            );
            const coinsToAdd = cISForUser + cISForReferal * referalCount;
            return res.json({
                coins: await db.addUserCoins(user.user.id, coinsToAdd),
            });
        } catch (error) {
            return res.status(500).json({ message: `${error}` });
        }
    }
    // Write new session
    async auth(req, res) {
        try {
            const { user } = req.body;
            await db.addUser(user.user);
            return res.json(await db.addUserAuth(user));
        } catch (error) {
            return res.status(500).json({ message: `${error}` });
        }
    }
}

// Update coins count while offline
async function addCoins() {
    const userArr = await db.getUsers();
    const now = Math.floor(Date.now() / 1000);
    if (userArr.length > 0) {
        for (const user of userArr) {
            if (+user.last_api_trigger + 5 < now) {
                const referalCount = await db.countUserWorkersByOwnerId(
                    user.id
                );
                if (referalCount > 0) {
                    const coinsToAdd = cISForReferal * referalCount;
                    await db.addUserCoins(user.id, coinsToAdd);
                }
            }
        }
    }
}

async function updateOfflineUsers() {
    await addCoins();
}

setInterval(updateOfflineUsers, 1000);

module.exports = new ApiController();
