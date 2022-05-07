const connectRedis = require('../../redis/redis-pool');
const db = require('../../sqlite/sqlite-db');
const mimsoft = require('../../entegrator/mimsoft/index')
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const hasToken = (req, res, next) => {
    connectRedis()
    .then(client => {
        client
        .exists('entegratorToken')
        .then(async (result) => {
            if(result) {
                req.ent_token = await client.get('entegratorToken');
                next();
            }
            //db.query('select * from company_info')
            prisma.companyInfo.findFirst({})
            .then(async (result) => {
                const username = result.entegrator_username;
                const password = result.entegrator_password;
                await mimsoft
                .getToken(username, password)
                .then(token => {
                    connectRedis()
                    .then(client => {
                        client
                        .setEx('entegratorToken', 28800, token)
                        .then(async (result) => {
                            req.ent_token = await client.get('entegratorToken');
                            next();
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(404).send({"status":false,"message":err});
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
                .catch(err => {
                    console.log(err);
                })
            })
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
           console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
}

module.exports = hasToken;