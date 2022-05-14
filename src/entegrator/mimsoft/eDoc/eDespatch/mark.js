const connect = require('../../connection');

module.exports = (uuids, mark, value, direction, token) => {
    return new Promise(async (resolve, reject) => {
        const body = {
            uuids,
            mark,
            direction,
            value
        }
        await connect('post', '/edespatch.mark', body, token)
            .then(response => {
               resolve(response)
            })
            .catch(err => {
                resolve(err)
            })
    })
}