
const {createClient} = require('redis');
const config = require('config');

const connectRedis = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const client = createClient({
                url: config.get('redis.urlpath')
            }); 
            client.on('error', (err) => { 
                reject(err);
            });
            await client.connect()
            resolve(client);
        } catch(err) {
            reject(err);
        }
        
    })
}

module.exports = connectRedis;
