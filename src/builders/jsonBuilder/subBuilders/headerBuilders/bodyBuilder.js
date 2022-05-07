
const { mssql, sql } = require('../../../../mssql/mssql-pool');
const db = require('../../../../sqlite/sqlite-db');
const despatchesBuilder = require('./despatchesBuilder');
const notesBuilder = require('./notesBuilder');
const orderBuilder = require('./orderBuilder');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();


const bodyBuilder = (erpId) => {
    return new Promise((resolve, reject) => {
        //db.query('select invoice_sql from sql_queries')
        prisma.sqlQueries.findFirst({
            select: {
                invoice_sql: true
            }
        })
        .then((result) => {
            console.log(result)
            const sqlQuery = result.invoice_sql;
            console.log(sqlQuery)
            mssql()
            .then((request) => {
                request
                .input('erpId', sql.VarChar, erpId)
                .query(sqlQuery)
                .then(async (result) => {
                    const object = result.recordset[0]
                    if(object) {
                        const despatchObject = await despatchesBuilder(erpId);
                        const notesObject = await notesBuilder(erpId);
                        const orderObject = await orderBuilder(erpId);
                        object['Despatches'] = despatchObject;
                        object['Notes'] = notesObject;
                        object['Order'] = orderObject;
                        resolve(object);
                    } else {
                        reject({status:false, message:'Fatura bulunamıyor!'})
                    }
                })
                .catch(err => {
                    console.log('err ', err);
                    reject(err);
                })
            })
            .catch(err => {
                console.log('err ', err);
                reject(err);
            })
        })
        .catch(err => {
            console.log('err ', err);
            reject(err);
        })
    })
    
}

module.exports = bodyBuilder;