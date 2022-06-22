const config = require('config');
const connectRedis = require('../../src/redis/redis-pool');
const {
    uuid
} = require('uuidv4');

const getLogin = async (req, res) => {
    res.render('layouts/login/login', { title: 'Giriş Yap', pagetitle: 'Giriş Yap'});
}

const postLogin = async (req, res) => {
    const {pin} = req.body;
    const sessionID = req.sessionID;
    if(pin == config.get('pin')) {
        const keyuuid = uuid();
        connectRedis()
        .then(client => {
            client
            .setEx(sessionID, 1000, keyuuid)
            .then(async (result) => {
                req.session.key = await client.get(sessionID);
                res.redirect('/');
            })
            .catch(err => {
                console.log(err);
                res.render('layouts/login/login', { title: 'Giriş Yap', pagetitle: 'Giriş Yap', error: err});
            })
        })
        .catch(err => {
            console.log(err);
            res.render('layouts/login/login', { title: 'Giriş Yap', pagetitle: 'Giriş Yap', error: err});
        })
    } else {
        res.render('layouts/login/login', { title: 'Giriş Yap', pagetitle: 'Giriş Yap', error: "Hatalı PIN"});
    }
}

module.exports = {
    getLogin,
    postLogin
};
