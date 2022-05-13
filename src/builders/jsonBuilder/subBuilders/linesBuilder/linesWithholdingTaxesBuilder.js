const { mssql, sql } = require('../../../../mssql/mssql-pool');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const linesWithholdingTaxesBuilder = (lineID) => {
    return new Promise((resolve, reject) => {
        prisma.sqlQueries.findFirst({
            select: {
                lines_withholding_tax_sql: true
            }
        })
        .then(result => {
            const sqlQuery = result.lines_withholding_tax_sql;
            if(sqlQuery) {
                mssql()
                .then(request => {
                    request
                    .input('lineID', sql.VarChar, lineID)
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

module.exports = linesWithholdingTaxesBuilder;