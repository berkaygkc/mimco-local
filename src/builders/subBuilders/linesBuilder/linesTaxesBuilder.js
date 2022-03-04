const { mssql, sql } = require('../../../mssql/mssql-pool');
const db = require('../../../sqlite/sqlite-db');

const linesTaxesBuilder = (lineID) => {
    return new Promise((resolve, reject) => {
        db
        .query('select lines_taxes_sql from sql_queries')
        .then(result => {
            const sqlQuery = result[0].lines_taxes_sql;
            mssql()
            .then(request => {
                request
                .input('lineID', sql.Int, lineID)
                .query(sqlQuery)
                .then(result => {
                    const object = result.recordset;
                    resolve(object);
                })
                .catch(err => {
                    reject(err);
                })
            })
            .catch(err => {
                reject(err);
            })
        })
        .catch(err => {
            reject(err);
        })
    })
}

module.exports = linesTaxesBuilder;