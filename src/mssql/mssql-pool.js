const sql = require('mssql');
const config = require('config');

const mssql = () => {
    const configSql = {
        user: config.get('customer.mssql.user'),
        password: config.get('customer.mssql.pass'),
        database: config.get('customer.mssql.db_name'),
        server: config.get('customer.mssql.server'),
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        },
        dialect: "mssql",
        port: 1433,
        options: {
            encrypt: false,
            enableArithAbort: false
        },
        dialectOptions: {
            instanceName: config.get('customer.mssql.instance_name'),
        },
    }

    return new Promise((resolve, reject) => {
        sql.connect(configSql, (err) => {
            if (err) reject(err);
        
            const request = new sql.Request();
            resolve(request);

        });
        
        sql.on('error', err => {
            reject(err);
        });
    })
}

module.exports = {
    mssql,
    sql
};
