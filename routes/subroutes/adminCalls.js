var express = require('express');
var router = express.Router();
const db = require('../../src/sqlite/sqlite-db');
const {
    createXML
} = require('../../src/bull/queue/createXMLQueue');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const sqlList = async (req, res) => {
    const sqlList = await prisma.sqlQueries.findFirst({});
    res.render('layouts/admin/sql', {
        title: 'Admin SQL Bilgileri',
        pagetitle: 'Admin SQL Bilgileri',
        sqlList: sqlList
    });
}

const sqlUpdate = async (req, res) => {
    const {
        invoice_sql,
        invoice_lines_sql,
        invoice_notes_sql,
        invoice_despatches_sql,
        invoice_order_sql,
        parties_sql,
        parties_identify_sql,
        lines_taxes_sql,
        lines_allowance_sql,
        update_invoice_number_sql
    } = req.body;
    const returnValue = await prisma.sqlQueries.update({
        where: {
            id: 1
        },
        data: {
            invoice_sql,
            invoice_lines_sql,
            invoice_despatches_sql,
            invoice_notes_sql,
            invoice_order_sql,
            parties_sql,
            parties_identify_sql,
            lines_taxes_sql,
            lines_allowance_sql,
            update_invoice_number_sql
        }
     })
    res.redirect('/admin/sql');
}


module.exports = {
    sqlList,
    sqlUpdate,
    //testxmls
};