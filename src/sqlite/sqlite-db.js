const sqlite = require('better-sqlite3');
const path = require('path');
const config = require('config')

const db = new sqlite(config.get('sqlite.db'));

const query = async (sql, params) => {
    return new Promise((resolve, reject) => {
        if(params) {
            resolve(db.prepare(sql).all(params));
        } else {
            resolve(db.prepare(sql).all());
        }
    })
}

const insert = async (sql, params) => {
    return db.prepare(sql).run(params);
}

module.exports = {
    query,
    insert
}