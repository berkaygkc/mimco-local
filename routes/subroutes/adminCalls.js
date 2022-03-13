var express = require('express');
var router = express.Router();
const db = require('../../src/sqlite/sqlite-db');
const builders = require('../../src/builders/index');
const {createXML} = require('../../src/bull/queue/createXMLQueue');
const { create } = require('xmlbuilder');

const sqlList = async (req, res) => {
    const sqlList = await db.query('select * from sql_queries');
    res.render('layouts/admin/sql',  {title: 'Admin SQL Bilgileri', pagetitle: 'Admin SQL Bilgileri', sqlList: sqlList[0]});
}

const sqlUpdate = (req, res) => {
    const returnValue = db.insert('update sql_queries set invoice_sql = ?, invoice_lines_sql = ?, parties_sql = ?, parties_identify_sql = ?, lines_taxes_sql = ?, lines_allowance_sql = ?, invoice_order_sql = ?, invoice_despatches_sql = ?, invoice_notes_sql = ? where id = 1',[req.body.invoice_sql,req.body.invoice_lines_sql, req.body.parties_sql, req.body.parties_identify_sql, req.body.lines_taxes_sql, req.body.lines_allowance_sql, req.body.invoice_order_sql, req.body.invoice_despatches_sql, req.body.invoice_notes_sql]);
    res.redirect('/admin/sql');
}

const testxmls = async (req, res) => {
    const erpId = req.params.id;
    db.query('select * from invoices where erpId = ?', [erpId])
    .then(result =>  {
        createXML(result[0].json, result[0].uuid, result[0].erpId);
        return res.send(true);
    })
    .catch(err => {
        console.log(err);
        return res.send(err);
    })
}


module.exports = {
    sqlList,
    sqlUpdate,
    testxmls
};
