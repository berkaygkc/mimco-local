const { mssql, sql } = require('../../../../mssql/mssql-pool');
const db = require('../../../../sqlite/sqlite-db');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const linesAllowancesBuilder = (lineID) => {
    return new Promise((resolve, reject) => {
        //db.query('select lines_allowance_sql from sql_queries')
        prisma.sqlQueries.findFirst({
            select: {
                lines_allowance_sql: true
            }
        })
        .then(result => {
            const sqlQuery = result.lines_allowance_sql;
            if(sqlQuery) {
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
            }
            else {
                resolve([]);
            }
            
        })
        .catch(err => {
            reject(err);
        })
    })
}

module.exports = linesAllowancesBuilder;