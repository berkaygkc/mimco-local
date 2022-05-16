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

const sqlListDespatches = async (req, res) => {
    const sqlList = await prisma.sqlQueries.findFirst({});
    res.render('layouts/admin/sql_despatches', {
        title: 'Admin İrsaliye SQL Bilgileri',
        pagetitle: 'Admin İrsaliye SQL Bilgileri',
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
        lines_withholding_tax_sql,
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
            lines_withholding_tax_sql,
            lines_allowance_sql,
            update_invoice_number_sql
        }
     })
    res.redirect('/admin/sql');
}

const sqlUpdateDespatches = async (req, res) => {
    const {
        despatch_sql,
        despatch_lines_sql,
        despatch_notes_sql,
        despatch_order_sql,
        despatch_shipment_plateid_sql,
        despatch_shipment_driver_sql,
        despatch_shipment_other_sql,
        despatch_parties_identify_sql,
        despatch_parties_sql,
        update_despatch_number_sql
    } = req.body;
    const returnValue = await prisma.sqlQueries.update({
        where: {
            id: 1
        },
        data: {
            despatch_sql,
            despatch_lines_sql,
            despatch_notes_sql,
            despatch_order_sql,
            despatch_shipment_plateid_sql,
            despatch_shipment_driver_sql,
            despatch_shipment_other_sql,
            despatch_parties_sql,
            despatch_parties_identify_sql,
            update_despatch_number_sql
        }
     })
    res.redirect('/admin/sql/despatches');
}


module.exports = {
    sqlList,
    sqlUpdate,
    sqlListDespatches,
    sqlUpdateDespatches,
    //testxmls
};