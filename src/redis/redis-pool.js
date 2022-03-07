
const {createClient} = require('redis');

const connectRedis = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const client = createClient(); 
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
