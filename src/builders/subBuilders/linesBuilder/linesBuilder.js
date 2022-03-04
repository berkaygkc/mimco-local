const { mssql, sql } = require('../../../mssql/mssql-pool');
const db = require('../../../sqlite/sqlite-db');
const linesTaxesBuilder = require('./linesTaxesBuilder');
const linesAllowancesBuilder = require('./linesAllowancesBuilder');

const linesBuilder = (erpId) => {
    return new Promise((resolve, reject) => {
        db
        .query('select invoice_lines_sql from sql_queries')
        .then(result => {
            const sqlQuery = result[0].invoice_lines_sql;
            mssql()
            .then(request => {
                request
                .input('erpId', sql.VarChar, erpId)
                .query(sqlQuery)
                .then(async (result) => {
                    console.log(result.recordset);
                    const linesArray = [];
                    for await (line of result.recordset) {
                        const lineTaxes = await linesTaxesBuilder(line.ERPLineID).catch(err => console.log('tax builder error ' , err));
                        //const taxes = await linesAllowancesBuilder(line.ERPLineID);
                        linesArray.push({
                            ...line,
                            Taxes: lineTaxes,
                            //Taxes: taxes
                        })
                    }
                    console.log(linesArray[0].Taxes);
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