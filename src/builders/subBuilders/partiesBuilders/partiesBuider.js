const { mssql, sql } = require('../../../mssql/mssql-pool');
const db = require('../../../sqlite/sqlite-db');
const partyIdentifier = require('./partyIdentifier');

const partiesBuilder = (erpId) => {
    return new Promise((resolve, reject) => {
        db
        .query('select parties_sql from sql_queries')
        .then(result => {
            const sqlQuery = result[0].parties_sql;
            mssql()
            .then(request => {
                request
                .input('erpId', sql.VarChar, erpId)
                .query(sqlQuery)
                .then(async (result) => {
                    console.log(result.recordset[0]);
                    let parties = [];
                    for await (party of result.recordset) {
                        const identify = await partyIdentifier(party.ERPPartyID);
                        parties.push({
                            ...party,
                            Identities: identify
                        })
                    }
                    console.log('identify object : ',parties[0].Identities)
                    resolve(parties);
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

module.exports = partiesBuilder;