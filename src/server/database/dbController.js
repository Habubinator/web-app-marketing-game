const db = require("./dbPool");

class databaseController {
    constructor() {
        this.sheets; // Property to store parsed Google Sheets data
    }

    // Method to add or retrieve a user ID
    async addUser(user) {
        try {
            const existingUser = await db.query(
                "SELECT * FROM users WHERE id = $1",
                [user.id]
            );

            if (existingUser.rows.length > 0) {
                // Если пользователь существует, возвращаем его идентификатор
                this.updateUser(user.id, user);
                return existingUser.rows[0].id;
            } else {
                // Если пользователь не существует, создаем нового и возвращаем его идентификатор
                const newUser = await db.query(
                    `INSERT INTO users (id, first_name, last_name, username, language_code, is_premium, allows_write_to_pm, company_name, company_coins, last_api_trigger) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
                    [
                        user.id,
                        user.first_name,
                        user.last_name,
                        user.username,
                        user.language_code,
                        user.is_premium,
                        user.allows_write_to_pm,
                        user.company_name,
                        user.company_coins,
                        user.last_api_trigger,
                    ]
                );
                return newUser.rows[0].id;
            }
        } catch (error) {
            console.error("Ошибка в методе addUser:", error);
            throw error;
        }
    }

    // Method to add or retrieve a user_auth record
    async addUserAuth(auth) {
        try {
            const existingAuth = await db.query(
                "SELECT * FROM user_auth WHERE query_id = $1",
                [auth.query_id]
            );

            if (existingAuth.rows.length > 0) {
                // If user_auth record exists, return its query_id
                return existingAuth.rows[0].query_id;
            } else {
                // If user_auth record doesn't exist, create a new one and return its query_id
                const newUserAuth = await db.query(
                    `INSERT INTO user_auth (query_id, auth_date, hash, user_id) 
                VALUES ($1, $2, $3, $4) RETURNING *`,
                    [auth.query_id, auth.auth_date, auth.hash, auth.user.id]
                );
                return newUserAuth.rows[0].query_id;
            }
        } catch (error) {
            console.error("Error in addUserAuth method:", error);
            throw error; // Rethrow the error for handling in the caller
        }
    }

    // Method to add a user-worker association
    async addUserWorker(owner_id, worker_id) {
        try {
            if (owner_id == worker_id || isNaN(+worker_id)) {
                return {
                    user: null,
                    already_exists: null,
                    owner_id: owner_id,
                    worker_id: worker_id,
                };
            }
            const user = await this.getUserById(owner_id);
            if (user) {
                const existingUserWorker = await db.query(
                    "SELECT * FROM user_workers WHERE owner_id = $1 AND worker_id = $2",
                    [owner_id, worker_id]
                );

                if (existingUserWorker.rows.length > 0) {
                    // If the association exists, return its owner_id and worker_id
                    return {
                        user,
                        already_exists: true,
                        owner_id: owner_id,
                        worker_id: worker_id,
                    };
                } else {
                    // If the association doesn't exist, create a new one and return its owner_id and worker_id
                    await db.query(
                        `INSERT INTO user_workers (owner_id, worker_id) 
                VALUES ($1, $2) RETURNING *`,
                        [owner_id, worker_id]
                    );
                    return {
                        user,
                        already_exists: false,
                        owner_id: owner_id,
                        worker_id: worker_id,
                    };
                }
            } else {
                return {
                    user,
                    already_exists: null,
                    owner_id: owner_id,
                    worker_id: worker_id,
                };
            }
        } catch (error) {
            console.error("Error in addUserWorker method:", error);
            throw error; // Rethrow the error for handling in the caller
        }
    }

    // Method to retrieve all users from the database
    async getUsers() {
        try {
            return (await db.query("SELECT * FROM users")).rows;
        } catch (error) {
            console.error("Error in getUsers method:", error);
            throw error; // Rethrow the error for handling in the caller
        }
    }

    // Method to retrieve a specific user based on their ID
    async getUserById(userId) {
        try {
            return (
                await db.query("SELECT * FROM users WHERE id = $1", [userId])
            ).rows[0];
        } catch (error) {
            console.error("Error in getUserById method:", error);
            throw error; // Rethrow the error for handling in the caller
        }
    }

    // Method to update a user's information based on their ID
    async updateUser(userId, userData) {
        try {
            return (
                await db.query(
                    `UPDATE users 
                    SET 
                        first_name = COALESCE($1, first_name),
                        last_name = COALESCE($2, last_name),
                        username = COALESCE($3, username),
                        language_code = COALESCE($4, language_code),
                        is_premium = COALESCE($5, is_premium),
                        allows_write_to_pm = COALESCE($6, allows_write_to_pm),
                        company_name = COALESCE($7, company_name)
                    WHERE id = $8 
                    RETURNING *;`,
                    [
                        userData.first_name,
                        userData.last_name,
                        userData.username,
                        userData.language_code,
                        userData.is_premium,
                        userData.allows_write_to_pm,
                        userData.company_name,
                        userId,
                    ]
                )
            ).rows[0];
        } catch (error) {
            console.error("Error in updateUser method:", error);
            throw error; // Rethrow the error for handling in the caller
        }
    }

    // Method to delete a user based on their ID
    async deleteUser(userId) {
        try {
            return (
                await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [
                    userId,
                ])
            ).rows[0];
        } catch (error) {
            console.error("Error in deleteUser method:", error);
            throw error; // Rethrow the error for handling in the caller
        }
    }

    // Method to count the number of user_workers by owner_id
    async countUserWorkersByOwnerId(ownerId) {
        try {
            const result = await db.query(
                "SELECT COUNT(*) AS count FROM user_workers WHERE owner_id = $1",
                [ownerId]
            );
            return result.rows[0].count;
        } catch (error) {
            console.error("Error in countUserWorkersByOwnerId method:", error);
            throw error; // Rethrow the error for handling in the caller
        }
    }

    // Method to add coins to a user
    async addUserCoins(userId, coinsToAdd) {
        try {
            const user = await db.query("SELECT * FROM users WHERE id = $1", [
                userId,
            ]);

            if (user.rows.length === 0) {
                throw new Error("User not found");
            }

            const currentCoins = user.rows[0].company_coins || 0;
            const newCoins = currentCoins + coinsToAdd;

            await db.query(
                "UPDATE users SET company_coins = $1 WHERE id = $2",
                [newCoins, userId]
            );

            return newCoins;
        } catch (error) {
            console.error("Error in addUserCoins method:", error);
            throw error; // Rethrow the error for handling in the caller
        }
    }

    // Метод для обновления last_api_trigger для пользователя по его ID
    async updateUserLastApiTrigger(userId, lastApiTrigger) {
        try {
            const updatedUser = await db.query(
                `UPDATE users 
            SET last_api_trigger = $1 
            WHERE id = $2 
            RETURNING *`,
                [lastApiTrigger, userId]
            );
            return updatedUser.rows[0]; // Возвращаем обновленного пользователя
        } catch (error) {
            console.error("Ошибка в методе updateUserLastApiTrigger:", error);
            throw error; // Повторное генерирование ошибки для обработки вызывающим кодом
        }
    }
}

module.exports = new databaseController(); // Export an instance of the database controller
