const connect = require("../connection");
const resolveToken = require("../../../middlewares/mimsoft/resolveToken");

module.exports = (type, body) => {
    return new Promise(async (resolve, reject) => {
        const token = await resolveToken();
        connect("POST", "/" + type + ".list.paged", body, token)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
