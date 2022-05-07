const connect = require('../../connection');


module.exports = (uuid, token) => {
    return new Promise(async (resolve, reject) => {
        const body = {}
        await connect('post', '/earchive/'+uuid+'/cancel', body, token)
            .then(response => {
               resolve(response)
            })
            .catch(err => {
                resolve(err)
            })
    })
}