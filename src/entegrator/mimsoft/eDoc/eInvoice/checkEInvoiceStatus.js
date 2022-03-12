const connect = require('../../connection');


module.exports = (uuid, token) => {
    return new Promise(async (resolve, reject) => {
        await connect('get', '/einvoice/'+uuid+'/status', '', token)
            .then(response => {
               resolve(response)
            })
            .catch(err => {
                resolve(err)
            })
    })
}