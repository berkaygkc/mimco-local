var express = require('express');
const db = require('../../src/sqlite/sqlite-db');

const userInfo = async (req,res) => {
    const userInfos = await db.query('select * from company_info');
    res.render('layouts/client/info', {title: 'Firma Bilgilerim', pagetitle: 'Firma Bilgilerim', userInfo: userInfos[0]});
}

const userInfoUpdate = (req, res) => {
    const returnValue = db.insert('update company_info set name = ?, tax_office = ?, address = ?, district = ?, city = ?, country = ?,phone_number = ?, fax_number = ?, email = ?, tax_number = ? where id = 1',[ req.body.name, req.body.tax_office, req.body.address, req.body.district, req.body.city, req.body.country, req.body.phone_number, req.body.fax_number, req.body.email, req.body.tax_number]);
    res.redirect('/client/info');
}

const entegratorInfo = async (req,res) => {
    const userInfos = await db.query('select * from company_info');
    res.render('layouts/client/entegrator', {title: 'Entegratör Bilgilerim', pagetitle: 'Entegratör Bilgilerim', userInfo: userInfos[0]});
}

const entegratorInfoUpdate = (req, res) => {
    const returnValue = db.insert('update company_info set entegrator_username = ?, entegrator_password = ? where id = 1',[req.body.ent_username,req.body.ent_password]);
    res.redirect('/client/entegrator');
}

module.exports = {
    userInfo,
    userInfoUpdate,
    entegratorInfo,
    entegratorInfoUpdate
};
