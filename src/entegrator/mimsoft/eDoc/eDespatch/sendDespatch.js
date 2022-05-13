const connect = require('../../connection');
const fs = require('fs');
const {Buffer} = require('buffer');


module.exports = (xmlPath, token) => {
    return new Promise(async (resolve, reject) => {
        const xml = fs.readFileSync(xmlPath, 'utf-8');
        const body = {
            content: Buffer.from(xml).toString('base64')
        }
        await connect('post', '/edespatch', body, token)
            .then(response => {
                console.log(response);
               resolve(response)
            })
            .catch(err => {
                resolve(err)
            })
    })
}