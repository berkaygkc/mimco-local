
const { mssql, sql } = require('../../../mssql/mssql-pool');
const db = require('../../../sqlite/sqlite-db');

const bodyBuilder = (erpId) => {
    return new Promise((resolve, reject) => {
        db.query('select invoice_sql from sql_queries')
        .then((result) => {
            const sqlQuery = result[0].invoice_sql;
            mssql()
            .then((request) => {
                request
                .input('erpId', sql.VarChar, erpId)
                .query(sqlQuery)
                .then((result) => {
                    const object = result.recordset[0]
                    resolve(object);
                })
                .catch(err => {
                    console.log('err ', err);
                    reject(err);
                })
            })
            .catch(err => {
                console.log('err ', err);
                reject(err);
            })
        })
        .catch(err => {
            console.log('err ', err);
            reject(err);
        })
    })
    
}

module.exports = bodyBuilder;