const connectRedis = require('../../src/redis/redis-pool');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const userInfo = async (req, res) => {
    const userInfo = await prisma.companyInfo.findFirst({});
    res.render('layouts/client/info', { title: 'Firma Bilgilerim', pagetitle: 'Firma Bilgilerim', userInfo: userInfo });
}

const userInfoUpdate = async (req, res) => {
    const {
        name,
        tax_office,
        address,
        district,
        city,
        country,
        phone_number,
        fax_number,
        email,
        tax_number
    } = req.body;
    const returnValue = await prisma.companyInfo.update({
        where: {
            id: 1
        },
        data: {
            name,
            tax_number,
            tax_office,
            address,
            district,
            city,
            country,
            phone_number,
            fax_number,
            email
        }
    });
    res.redirect('/client/info');
}

const entegratorInfo = async (req, res) => {
    const userInfo = await prisma.companyInfo.findFirst({});
    res.render('layouts/client/entegrator', { title: 'Entegratör Bilgilerim', pagetitle: 'Entegratör Bilgilerim', userInfo: userInfo });
}

const entegratorInfoUpdate = async (req, res) => {
    const {
        ent_username,
        ent_password
    } = req.body;
    const returnValue = await prisma.companyInfo.update({
        where: {
            id: 1
        },
        data: {
            entegrator_username: ent_username,
            entegrator_password: ent_password
        }
    });
    connectRedis()
        .then(client => {
            client.del('entegratorToken')
                .then(result => {
                    res.redirect('/client/entegrator');
                })
                .catch(e => {
                    res.redirect('/client/entegrator');
                })
        })
        .catch(e => {
            res.redirect('/client/entegrator');
        })
}

const getLogin = async (req, res) => {
    res.render('layouts/login/login', { title: 'Giriş Yap', pagetitle: 'Giriş Yap'});
}


module.exports = {
    userInfo,
    userInfoUpdate,
    entegratorInfo,
    entegratorInfoUpdate,
    getLogin
};
