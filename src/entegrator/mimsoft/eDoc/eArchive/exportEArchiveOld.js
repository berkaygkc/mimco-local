const connect = require('../../connection');


module.exports = (uuid, type, token) => {
    return new Promise(async (resolve, reject) => {
        await connect('get', '/earchive/'+uuid+'/export?type='+type, '', token)
            .then(response => {
               resolve(response)
            })
            .catch(err => {
                resolve(err)
            })
    })
}