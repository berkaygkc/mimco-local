const connectRedis = require('../../redis/redis-pool');
const db = require('../../sqlite/sqlite-db');
const mimsoft = require('../../entegrator/mimsoft/index')

const resolveToken = () => {
    return new Promise((resolve, reject) => {
        connectRedis()
            .then(client => {
                client
                    .exists('entegratorToken')
                    .then(async (result) => {
                        if (result) {
                            token = await client.get('entegratorToken');
                            resolve(token);
                        }
                        db
                            .query('select * from company_info')
                            .then(async (result) => {
                                const username = result[0].entegrator_username;
                                const password = result[0].entegrator_password;
                                await mimsoft
                                    .getToken(username, password)
                                    .then(token => {
                                        connectRedis()
                                            .then(client => {
                                                client
                                                    .setEx('entegratorToken', 28800, token)
                                                    .then(async (result) => {
                                                        sysToken = await client.get('entegratorToken');
                                                        resolve(sysToken);
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                        reject({
                                                            "status": false,
                                                            "message": err
                                                        });
                                                    })
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                reject({
                                                    "status": false,
                                                    "message": err
                                                });
                                            })
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        reject({
                                            "status": false,
                                            "message": err
                                        });
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                                reject({
                                    "status": false,
                                    "message": err
                                });
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        reject({
                            "status": false,
                            "message": err
                        });
                    })
            })
            .catch(err => {
                console.log(err);
                reject({
                    "status": false,
                    "message": err
                });
            })
    })

}

module.exports = resolveToken;