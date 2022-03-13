
const { mssql, sql } = require('../../../../mssql/mssql-pool');
const db = require('../../../../sqlite/sqlite-db');
const despatchesBuilder = require('./despatchesBuilder');
const notesBuilder = require('./notesBuilder');
const orderBuilder = require('./orderBuilder');


const bodyBuilder = (erpId) => {
    return new Promise((resolve, reject) => {
        db.query('select invoice_sql from sql_queries')
        .then((result) => {
            const sqlQuery = result[0].invoice_sql;
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
                        reject({status:false, message:'fatura bulunmuyor!'})
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