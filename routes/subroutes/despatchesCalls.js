const db = require('../../src/sqlite/sqlite-db');
const {
    sendDespatch
} = require('../../src/bull/queue/sendDespatchQueue');
const {
    sendSelectedDespatches
} = require('../../src/bull/queue/sendSelectedDespatchesQueue');
const builders = require('../../src/builders/index');
const checkStatus = require('../../src/entegrator/mimsoft/eDoc/checkStatusDespatch');
const fs = require('fs');
const {
    updateDespatchRecord
} = require('../../src/bull/queue/updateDespatchRecordQueue');
const {
    PrismaClient
} = require('@prisma/client');
const calculateXSLT = require('../../src/helpers/invoiceHelpers/calculateXslt');
const checkLinesJSON = require('../../src/helpers/invoiceHelpers/checkLinesDespatch');
const prisma = new PrismaClient();

const listDespatches = async (req, res) => { //irsaliyeleştirildi
    const data = await prisma.$queryRaw `SELECT STRFTIME(\'%d.%m.%Y\', issue_date) as readable_date,* FROM Despatches WHERE is_sended = 0 ORDER BY issue_date ASC`
    res.render('layouts/despatches/list', {
        title: 'İrsaliyeler',
        pagetitle: 'Gönderim Bekleyen İrsaliye Listesi',
        apptitle: 'despatches-list',
        despatches: data
    });
}

const sendDespatchRoute = async (req, res) => { //irsaliyeleştirildi
    const dspId = req.params.id;
    sendDespatch(dspId);
    return res.send({
        status: true
    })
}

const sendSelectedInvoicesRouter = async (req, res) => { //irsaliyeleştirildi
    const list = req.body.list;
    if (Array.isArray(list)) {
        sendSelectedDespatches(list);
    } else {
        sendDespatch(list);
    }
    return res.send({
        status: true
    })
}

const despatchesDetail = async (req, res) => { //irsaliyeleştirildi
    const dspId = req.params.id;
    const data = await prisma.despatches.findFirst({
            where: {
                id: Number(dspId)
            },
            select: {
                status_description: true
            }
        })
        .catch(err => {
            console.log(err)
        });
    return res.send(data.status_description);
}

const listDespatchesStatus = async (req, res) => { //irsaliyeleştirildi
    const data = await prisma.$queryRaw `SELECT STRFTIME(\'%d.%m.%Y\', issue_date) as readable_date,* FROM Despatches WHERE is_sended = 1 ORDER BY updated_at DESC`
    res.render('layouts/despatches/status', {
        title: 'İrsaliyeler',
        pagetitle: 'Gönderilmiş İrsaliye Listesi',
        apptitle: 'despatches-status',
        despatches: data
    });
}

const getXML = async (req, res) => { //irsaliyeleştirildi
    const dspId = req.params.id;
    const data = await prisma.despatches.findFirst({
            where: {
                id: Number(dspId)
            }
        })
        .catch(err => {
            console.log(err)
        });
    let xml;
    if (data.xml_path) {
        xml = fs.readFileSync(data.xml_path, 'utf-8');
    } else if (!data.is_sended) {
        xml = await builders.despatchXMLBuilder(data.json_path, {
            type: 'preview'
        });
    }
    return res.send(xml);
}

const getXSLT = async (req, res) => { //irsaliyeleştirildi
    const dspId = req.params.id;
    const data = await prisma.despatches.findFirst({
            where: {
                id: Number(dspId)
            },
            select: {
                despatch_template: {
                    select: {
                        xslt_path: true
                    }
                }
            }
        })
        .catch(err => {
            console.log(err)
        });
    const xslt = fs.readFileSync(data.despatch_template.xslt_path, 'utf-8');
    return res.send(xslt);
}

const markSended = async (req, res) => { //irsaliyeleştirildi
    const dspId = req.params.id;
    await prisma.despatches.update({
            where: {
                id: Number(dspId)
            },
            data: {
                is_sended: true,
                despatch_number: 'Gönderildi Olarak İşaretlendi!',
                status_code: 105
            }
        })
        .then(result => {
            return res.send({
                status: true
            })
        })
        .catch(err => {
            return res.send({
                status: false,
                message: err
            });
        })
}

const markNotSended = async (req, res) => { //irsaliyeleştirildi
    const dspId = req.params.id;
    await prisma.despatches.update({
            where: {
                id: Number(dspId)
            },
            data: {
                is_sended: false,
                status_code: null,
                status_description: null,
                xml_path: null
            }
        })
        .then(result => {
            return res.send({
                status: true
            })
        })
        .catch(err => {
            console.log(err);
            return res.send({
                status: false,
                message: err
            });
        })
}

const markResolved = async (req, res) => { //irsaliyeleştirildi
    const dspId = req.params.id;
    await prisma.despatches.update({
            where: {
                id: Number(dspId)
            },
            data: {
                is_sended: true,
                despatch_number: 'Çözüldü olarak işaretlendi!',
                status_code: 105
            }
        })
        .then(result => {
            return res.send({
                status: true
            })
        })
        .catch(err => {
            return res.send({
                status: false,
                message: err
            });
        })
}

const checkDespatchStatus = async (req, res) => { //irsaliyeleştirildi
    const invId = req.params.id;
    checkStatus(invId)
        .then(result => {
            console.log(result);
            const object = {
                status: true,
                summary: result.resultData.summary,
                status_code: result.resultData.status_code,
                status_description: result.resultData.message
            }
            return res.send(object);
        })
        .catch(err => {
            console.log(err);
            return res.send({
                status: false,
                message: err
            })
        })
}

const getInvoiceLines = async (req, res) => {

    const invId = req.params.id;
    const data = await prisma.invoices.findFirst({
            where: {
                id: Number(invId)
            },
            select: {
                json_path: true
            }
        })
        .catch(err => {
            console.log(err)
        });
    const json = await JSON.parse(fs.readFileSync(data.json_path, 'utf-8'));
    let linesData = [];
    for await (line of json.InvoiceLines) {
        linesData.push({
            'invId': invId,
            'lineId': line.ERPLineID,
            'name': line.Name
        });
    }
    return res.send({
        status: true,
        data: linesData
    })

}

const getEditInfo = async (req, res) => { //irsaliyeleştirildi
    const dspId = req.params.id;
    const data = await prisma.despatches.findFirst({
            where: {
                id: Number(dspId)
            },
            select: {
                json_path: true
            }
        })
        .catch(err => {
            console.log(err)
        });
    let customer = {};
    let json = {};
    if (data) {
        json = await JSON.parse(fs.readFileSync(data.json_path, 'utf-8'));
        customer = json.Parties[0];
    }
    res.render('layouts/despatches/edit', {
        title: 'İrsaliye Düzenle',
        pagetitle: 'İrsaliyeyi Düzenle',
        apptitle: 'despatches-edit',
        allJson: json,
        customer
    });
}

const updateEditInfo = async (req, res) => {
    const dspId = req.params.id;
    const body = req.body;
    const data = await prisma.despatches.findFirst({
            where: {
                id: Number(dspId)
            },
            select: {
                json_path: true
            }
        })
        .catch(err => {
            console.log(err)
        });

    let json = {};
    if (data) {
        json = await JSON.parse(fs.readFileSync(data.json_path, 'utf-8'));
    }

    json['Notes'] = body.notes;

    for (i = 0; i < json.DespatchLines.length; i++) {
        for (j = 0; j < body.lines.length; j++) {
            if (body.lines[j].id == json.DespatchLines[i].ERPLineID) {
                json.DespatchLines[i]['Name'] = body.lines[j].name;
            }
        }
    }

    json.Shipment['Drivers'] = body.drivers;
    json.Shipment['PlateID'] = body.plateID;
    json.Shipment.Others['Address'] = body.others.address;
    json.Shipment.Others['District'] = body.others.district;
    json.Shipment.Others['City'] = body.others.city;
    json.Shipment.Others['Country'] = body.others.country;
    json.Shipment.Others['PostalCode'] = body.others.postalcode;
    json.Shipment.Others['SevkIssueDate'] = body.others.sevkIssueDate;
    json.Shipment.Others['SevkIssueTime'] = body.others.sevkIssueTime;

    const writeResult = await fs.writeFileSync(data.json_path, JSON.stringify(json), 'utf-8');
    const updateData = await prisma.despatches.update({
        where:{
            id: Number(dspId)
        },
        data:{
            need_change: false
        }
    })
    return res.send({
        status: true,
        message: json
    });

}

const refreshDespatch = async (req, res) => { //irsaliyeleştirildi
    const dspId = req.params.id;
    const data = await prisma.despatches.findFirst({
            where: {
                id: Number(dspId)
            }
        })
        .catch(err => {
            console.log(err)
        });
    const erpId = data.erpId;
    builders.despatchJSONBuilder(erpId)
        .then(result => {
            updateDespatchRecord(result);
            return res.send({
                status: true,
                message: null
            });
        })
        .catch(err => {
            return res.send({
                status: false,
                message: err
            });
        })
}

const checkLinesInvoice = (req, res) => { //irsaliyeleştirildi
    const id = req.params.id;
    checkLinesJSON(id)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.send({
                status: false,
                message: 'Kalemler karşılaştırılırken hata ile karşılaşıldı! Göndermek istediğinize emin misiniz?'
            })
        })

}


module.exports = {
    listDespatches,
    sendDespatchRoute,
    sendSelectedInvoicesRouter,
    listDespatchesStatus,
    despatchesDetail,
    getXML,
    getXSLT,
    markSended,
    markResolved,
    checkDespatchStatus,
    markNotSended,
    getInvoiceLines,
    getEditInfo,
    updateEditInfo,
    refreshDespatch,
    checkLinesInvoice
};