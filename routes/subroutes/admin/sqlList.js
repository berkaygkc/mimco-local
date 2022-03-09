var express = require('express');
var router = express.Router();
const db = require('../../../src/sqlite/sqlite-db');
const builders = require('../../../src/builders/index');
const {createXML} = require('../../../src/bull/queue/createXMLQueue');
const { create } = require('xmlbuilder');

const sqlList = async (req, res) => {
    const sqlList = await db.query('select * from sql_queries');
    res.render('sql', { title: 'Mimco' , sqlList: sqlList[0]});
}

const sqlUpdate = (req, res) => {
    const returnValue = db.insert('update sql_queries set invoice_sql = ?, invoice_lines_sql = ?, parties_sql = ?, parties_identify_sql = ?, lines_taxes_sql = ?, lines_allowance_sql = ? where id = 1',[req.body.invoice_sql,req.body.invoice_lines_sql, req.body.parties_sql, req.body.parties_identify_sql, req.body.lines_taxes_sql, req.body.lines_allowances_sql]);
    res.redirect('/admin/client/sql');
}

const userInfo = async (req,res) => {
    const userInfos = await db.query('select * from company_info');
    console.log(userInfos);
    res.render('user_info', {title: 'Mimco', userInfo: userInfos[0]});
}

const userInfoUpdate = (req, res) => {
    const returnValue = db.insert('update company_info set entegrator_username = ?, entegrator_password = ?, name = ?, tax_office = ?, address = ?, district = ?, city = ?, country = ?,phone_number = ?, fax_number = ?, email = ?, tax_number = ? where id = 1',[req.body.ent_username,req.body.ent_password, req.body.name, req.body.tax_office, req.body.address, req.body.district, req.body.city, req.body.country, req.body.phone_number, req.body.fax_number, req.body.email, req.body.tax_number]);
    res.redirect('/admin/client/info');
}

const testxml = async (req, res) => {
    const erpId = req.params.id;
    db.query('select * from invoices where erpId = ?', [erpId])
    .then(result =>  {
        
    })
    .catch(err => {
        console.log(err);
        return res.send(err);
    })
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
    userInfo,
    userInfoUpdate,
    testxml,
    testxmls
};
