const connectRedis = require('../../redis/redis-pool');

const checkSession = (req, res, next) => {
    const sessionID = req.sessionID;
    if (req.session && 'key' in req.session) {
        connectRedis()
            .then(async(client) => {
                const key = await client.get(sessionID);
                if (key == req.session.key) return next();
                else {
                    req.session.destroy();
                    return res.redirect('/login');
                }
            })
            .catch(err => {
                console.log(err);
                return res.redirect('/login');
            })
    }
    else return res.redirect('/login')
};

module.exports = checkSession;
