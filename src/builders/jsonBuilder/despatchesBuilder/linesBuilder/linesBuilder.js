const {
    mssql,
    sql
} = require('../../../../mssql/mssql-pool');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const linesBuilder = (erpId) => {
    return new Promise((resolve, reject) => {
        prisma.sqlQueries.findFirst({
                select: {
                    despatch_lines_sql: true
                }
            })
            .then(result => {
                const sqlQuery = result.despatch_lines_sql;
                mssql()
                    .then(request => {
                        request
                            .input('erpId', sql.VarChar, erpId)
                            .query(sqlQuery)
                            .then(async (result) => {
                                const linesArray = [];
                                for await (line of result.recordset) {
                                    linesArray.push({
                                        ...line
                                    })
                                }
                                resolve(linesArray);
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

module.exports = linesBuilder;