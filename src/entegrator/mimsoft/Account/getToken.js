const connect = require('../connection');

const getToken = (username, password) => {
    return new Promise(async (resolve, reject) => {
        data = {
            username,
            password
        }
        await connect('post','/account/auth', data)
        .then(response => {
            const token = response.resultData.access_token;
            resolve(token);
        })
        .catch(error => {
            reject(error);
        })
    })
}

module.exports = getToken;