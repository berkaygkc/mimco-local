const { mssql, sql } = require('../../../../mssql/mssql-pool');
const db = require('../../../../sqlite/sqlite-db');

const orderBuilder = (erpId) => {
    return new Promise((resolve, reject) => {
        db
        .query('select invoice_order_sql from sql_queries')
        .then(result => {
            const sqlQuery = result[0].invoice_order_sql;
            if(sqlQuery) {
                mssql()
                .then(request => {
                    request
                    .input('erpId', sql.VarChar, erpId)
                    .query(sqlQuery)
                    .then(result => {
                        const object = result.recordset[0];
                        resolve(object);
                    })
                    .catch(err => {
                        reject(err);
                    })
                })
                .catch(err => {
                    reject(err);
                })
            }
            else {
                resolve({});
            }
        })
        .catch(err => {
            reject(err);
        })
    })
}

module.exports = orderBuilder;