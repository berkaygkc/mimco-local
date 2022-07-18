const {
    mssql,
    sql
} = require('../../../../mssql/mssql-pool');
const db = require('../../../../sqlite/sqlite-db');
const partyIdentifier = require('./partyIdentifier');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const partiesBuilder = (erpId) => {
    return new Promise((resolve, reject) => {
        //db.query('select parties_sql from sql_queries')
        prisma.sqlQueries.findFirst({
            select: {
                parties_sql: true
            }
        })
            .then(result => {
                const sqlQuery = result.parties_sql;
                mssql()
                    .then(request => {
                        request
                            .input('erpId', sql.VarChar, erpId)
                            .query(sqlQuery)
                            .then(async (result) => {
                                let parties = [];
                                if (result.recordset.length == 0) {
                                    prisma.sqlQueries.findFirst({
                                        select: {
                                            invoice_default_customer_json: true
                                        }
                                    }).then(result => {
                                        parties.push(result);
                                    })
                                } else {
                                    for await (party of result.recordset) {
                                        const identify = await partyIdentifier(party.ERPPartyID);
                                        parties.push({
                                            ...party,
                                            Identities: identify
                                        })
                                    }
                                }
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