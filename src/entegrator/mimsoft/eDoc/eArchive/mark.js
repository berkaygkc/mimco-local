const connect = require('../../connection');

module.exports = (uuids, mark, value, token) => {
    return new Promise(async (resolve, reject) => {
        const body = {
            uuids,
            mark,
            value
        }
        await connect('post', '/earchive.mark', body, token)
            .then(response => {
               resolve(response)
            })
            .catch(err => {
                resolve(err)
            })
    })
}