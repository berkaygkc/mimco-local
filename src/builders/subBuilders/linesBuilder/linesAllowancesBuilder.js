const { mssql, sql } = require('../../../mssql/mssql-pool');
const db = require('../../../sqlite/sqlite-db');

const linesAllowancesBuilder = (lineID) => {
    return new Promise((resolve, reject) => {
        db
        .query('select lines_allowances_sql from sql_queries')
        .then(result => {
            const sqlQuery = result[0].lines_allowances_sql;
            mssql()
            .then(request => {
                request
                .input('lineID', sql.VarChar, lineID)
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

module.exports = linesAllowancesBuilder;