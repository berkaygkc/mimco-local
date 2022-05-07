const connect = require('../../connection');


module.exports = (uuid, reject_reason, token) => {
    const body = {
        reject_reason
    }
    return new Promise(async (resolve, reject) => {
        await connect('delete', '/einvoice/'+uuid+'/reply', body, token)
            .then(response => {
               resolve(response)
            })
            .catch(err => {
                resolve(err)
            })
    })
}