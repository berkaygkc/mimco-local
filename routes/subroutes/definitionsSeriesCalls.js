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

const getSeries = async (req, res) => {
    res.render('layouts/edoc-definition/series', {
        title: 'e-Belge Serilerim',
        pagetitle: 'e-Belge Serilerim',
        apptitle: 'definitons-series',
    });
}

const getSeriesFilterType = async (req, res) => {
    const query = req.query;
    const draw = query.draw;
    const type = req.params.type;
    const series = await prisma.documentSeries.findMany({
        where: {
            type: Number(type)
        }
    });
    const count = series.length;
    let data = []
    for await (serie of series) {
        const object = {
            serie: serie.serie,
            serial: serie.serial + 1,
            default: serie.default,
            active: serie.active,
            action: null
        }
        data.push(object);
    }
    const returnObject = {
        draw,
        recordsTotal: count,
        recordsFiltered: count,
        data
    }
    return res.send(returnObject);

}

const beDefault = async (req, res) => {
    const serie = req.params.serie;
    const type = req.params.type;
    const dedefault = await prisma.documentSeries.updateMany({
        where: {
            type: Number(type),
            default: true
        },
        data: {
            default: false
        }
    })
    prisma.documentSeries.updateMany({
            where: {
                serie,
                type: Number(type)
            },
            data: {
                default: true
            }
        })
        .then(result => {
            return res.send({
                status: true,
                message: null
            });
        })
        .catch(err => {
            console.log(err);
            return res.send({
                status: false,
                message: err
            });
        })
}

const activate = async (req, res) => {
    const serie = req.params.serie;
    const type = req.params.type;

    prisma.documentSeries.updateMany({
            where: {
                serie,
                type: Number(type)
            },
            data: {
                active: true
            }
        })
        .then(result => {
            return res.send({
                status: true,
                message: null
            });
        })
        .catch(err => {
            console.log(err);
            return res.send({
                status: false,
                message: err
            });
        })
}

const deactivate = async (req, res) => {
    const serie = req.params.serie;
    const type = req.params.type;

    prisma.documentSeries.updateMany({
            where: {
                serie,
                type: Number(type)
            },
            data: {
                active: false
            }
        })
        .then(result => {
            return res.send({
                status: true,
                message: null
            });
        })
        .catch(err => {
            console.log(err);
            return res.send({
                status: false,
                message: err
            });
        })
}

const addSerie = async (req, res) => {
    const serie = req.params.serie;
    const type = req.params.type;

    prisma.documentSeries.create({
            data: {
                type: Number(type),
                serie
            }
        })
        .then(result => {
            return res.send({
                status: true,
                message: null
            });
        })
        .catch(err => {
            console.log(err);
            return res.send({
                status: false,
                message: err
            });
        })
}




module.exports = {
    getSeries,
    getSeriesFilterType,
    beDefault,
    activate,
    deactivate,
    addSerie
};