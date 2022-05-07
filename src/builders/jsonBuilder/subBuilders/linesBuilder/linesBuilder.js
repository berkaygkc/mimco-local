const {
    mssql,
    sql
} = require('../../../../mssql/mssql-pool');
const db = require('../../../../sqlite/sqlite-db');
const linesTaxesBuilder = require('./linesTaxesBuilder');
const linesAllowancesBuilder = require('./linesAllowancesBuilder');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const linesBuilder = (erpId) => {
    return new Promise((resolve, reject) => {
        //db.query('select invoice_lines_sql from sql_queries')
        prisma.sqlQueries.findFirst({
                select: {
                    invoice_lines_sql: true
                }
            })
            .then(result => {
                const sqlQuery = result.invoice_lines_sql;
                mssql()
                    .then(request => {
                        request
                            .input('erpId', sql.VarChar, erpId)
                            .query(sqlQuery)
                            .then(async (result) => {
                                const linesArray = [];
                                for await (line of result.recordset) {
                                    const lineTaxes = await linesTaxesBuilder(line.ERPLineID).catch(err => console.log('tax builder error ', err));
                                    const allowances = await linesAllowancesBuilder(line.ERPLineID).catch(err => console.log('allowance builder error ', err));;
                                    linesArray.push({
                                        ...line,
                                        Taxes: lineTaxes,
                                        Allowances: allowances,
                                        //Taxes: taxes
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