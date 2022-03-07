const { mssql, sql } = require('../../../../mssql/mssql-pool');
const db = require('../../../../sqlite/sqlite-db');

const partyIdentifier = (partyID) => {
    return new Promise((resolve, reject) => {
        db
        .query('select parties_identify_sql from sql_queries')
        .then(result => {
            const sqlQuery = result[0].parties_identify_sql;
            mssql()
            .then(request => {
                request
                .input('partyId', sql.Int, partyID)
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

module.exports = partyIdentifier;