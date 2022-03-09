const axios = require('axios');
const config = require('config');

const connect = (method, url, body, token) => {
    return new Promise(async (resolve, reject) => {
        const base_url = config.get('entegrator.mimsoft.base_url');
        const requestUrl = base_url+url;
        let auth;
        let data;
        if (token) auth = {'Authorization':'Bearer ' + token}
        if (body) data = body;
        const headers = {
            'Content-Type': 'application/json',
            ...auth
        }
    
        const configHttp = {
            method,
            url: requestUrl,
            headers,
            data
        }

        //console.log('connect config : ', configHttp);
    
        await axios(configHttp)
        .then(response => {
            resolve({resultCode: response.status, resultData: response.data});
        })
        .catch(error => {
            reject(error);
        })
    })
}

module.exports = connect;