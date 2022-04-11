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
                .input('partyId', sql.VarChar, partyID)
                .query(sqlQuery)
                .then(result => {
                    const object = result.recordset;
                    object[0].Value = object[0].Value.replace(/[^\d]/g, '')
                    if(object[0].Value.length == 10) {
                        object[0].SchemaID = 'VKN'
                    } else {
                        object[0].SchemaID = 'TCKN'
                    }
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