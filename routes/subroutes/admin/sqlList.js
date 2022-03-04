var express = require('express');
var router = express.Router();
const db = require('../../../src/sqlite/sqlite-db');

const sqlList = async (req, res) => {
    const sqlList = await db.query('select * from sql_queries');
    console.log(sqlList);
    res.render('sql', { title: 'Mimco' , sqlList: sqlList[0]});
}

const sqlUpdate = (req, res) => {
    const returnValue = db.insert('update sql_queries set invoice_sql = ?, invoice_lines_sql = ?, parties_sql = ?, parties_identify_sql = ?, lines_taxes_sql = ?, lines_allowance_sql = ? where id = 1',[req.body.invoice_sql,req.body.invoice_lines_sql, req.body.parties_sql, req.body.parties_identify_sql, req.body.lines_taxes_sql, req.body.lines_allowances_sql]);
    res.redirect('/admin/client/sql');
}

module.exports = {
    sqlList,
    sqlUpdate
};
