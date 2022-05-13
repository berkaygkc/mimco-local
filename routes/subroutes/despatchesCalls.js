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

const getEditInfo = async (req, res) => {
    const invId = req.params.id;
    const data = await prisma.invoices.findFirst({
            where: {
                id: Number(invId)
            },
            select: {
                json_path: true
            }
        })
        //db.query('select json from invoices where id = ? LIMIT 1', [invId])
        .catch(err => {
            console.log(err)
        });
    let customer = {};
    let json = {};
    if (data) {
        json = await JSON.parse(fs.readFileSync(data.json_path, 'utf-8'));
        customer = json.Parties[0];
    }
    res.render('layouts/invoices/edit', {
        title: 'Fatura Düzenle',
        pagetitle: 'Faturayı Düzenle',
        apptitle: 'invoices-edit',
        allJson: json,
        customer
    });
}

const updateEditInfo = async (req, res) => {
    const invId = req.params.id;
    const body = req.body;
    const data = await prisma.invoices.findFirst({
            where: {
                id: Number(invId)
            },
            select: {
                json_path: true
            }
        })
        //db.query('select json from invoices where id = ? LIMIT 1', [invId])
        .catch(err => {
            console.log(err)
        });

    let json = {};
    if (data) {
        json = await JSON.parse(fs.readFileSync(data.json_path, 'utf-8'));
    }
    let xsltCode = json.XSLTCode; 
    let serieCode = json.DocumentSerieCode;
    json['InvoiceType'] = body.invoiceType;
    json['ProfileID'] = body.invoiceProfile;
    json['Notes'] = body.notes;

    for (i = 0; i < json.InvoiceLines.length; i++) {
        for (j = 0; j < body.lines.length; j++) {
            if (body.lines[j].id == json.InvoiceLines[i].ERPLineID) {
                json.InvoiceLines[i]['Name'] = body.lines[j].name;
                json.InvoiceLines[i]['GTIP'] = body.lines[j].gtip;
            }
        }
    }

    if (body.invoiceType == 'ISTISNA') {
        json['TaxExemptionReasonCodeGeneral'] = body.kdvMuaf;
        for (j = 0; j < json.InvoiceLines.length; j++) {
            for (i = 0; i < json.InvoiceLines[j].Taxes.length; i++) {
                if (json.InvoiceLines[j].Taxes[i].TaxPercent == 0) {
                    json.InvoiceLines[j].Taxes[i]['TaxExemptionReasonCode'] = body.kdvMuaf;
                }
            }
        }
        for (k = 0; k < json.Taxes.length; k++) {
            if (json.Taxes[k].TaxPercent == 0) {
                json.Taxes[k]['TaxExemptionReasonCode'] = body.kdvMuaf;
            }
        }
    }

    if (body.invoiceProfile == 'IHRACAT') {
        json['ExportInfo'] = {
            TermCode: body.export.termCode,
            TransportMode: body.export.transportMode,
            Delivery: {
                Address: body.export.address.address,
                District: body.export.address.district,
                City: body.export.address.city,
                PostalCode: body.export.address.postalCode,
                Country: body.export.address.country,
            }
        }
        for (i = 0; i < json.InvoiceLines.length; i++) {
            json.InvoiceLines[i]['Delivery'] = {
                Address: body.export.address.address,
                District: body.export.address.district,
                City: body.export.address.city,
                PostalCode: body.export.address.postalCode,
                Country: body.export.address.country,
            }
            json.InvoiceLines[i]['ExportInfo'] = {
                TermCode: body.export.termCode,
                TransportMode: body.export.transportMode,
            }
        }
        isCustomer = 0;
        isBuyer = 0;
        isSeller = 0;
        for (i = 0; i < json.Parties.length; i++) {
            if (json.Parties[i].Type == 2) {
                isCustomer = 1;
            } else if (json.Parties[i].Type == 3) {
                isBuyer = 1;
            } else if (json.Parties[i].Type == 4) {
                isSeller = 1;
            }
        }
        for (i = 0; i < json.Parties.length; i++) {
            if (json.Parties[i].Type == 2 && isBuyer == 0) {
                json.Parties[i]['Type'] = 3;
                const registerNumber = json.Parties[i].Identities[0].Value;
                delete json.Parties[i]['Identities'];
                json.Parties[i].Identities = [{
                    SchemaID: 'PARTYTYPE',
                    Value: 'EXPORT'
                }];
                json.Parties[i]['ExportInfo'] = {
                    Name: json.Parties[i].Name,
                    RegisterNumber: registerNumber
                }
            }
        }

        if (!isBuyer) {
            const GTBObject = {
                Type: 2,
                Website: '',
                Name: 'Gümrük ve Ticaret Bakanlığı Gümrükler Genel Müdürlüğü- Bilgi İşlem Dairesi Başkanlığı',
                Address: ' ',
                Country: [
                    'TÜRKİYE'
                ],
                District: ' ',
                City: 'ANKARA',
                TaxOffice: 'ULUS',
                PhoneNumber: '',
                FaxNumber: '',
                PostalCode: '',
                Mail: '',
                ERPPartyID: '000',
                Identities: [{
                    SchemaID: 'VKN',
                    Value: '1460415308'
                }]
            }
            json.Parties.push(GTBObject);
        }
    }
    let dbInvoiceProfile;
    if (body.invoiceProfile == 'IHRACAT') {
        dbInvoiceProfile = 'İhracat Faturası'
        json['SystemInvTypeCode'] = 1;
        const xsltId = await prisma.documentTemplates.findFirst({
            where:{
                type: 1,
                default: true
            }
        })
        const serieId = await prisma.documentSeries.findFirst({
            where:{
                type: 1,
                default: true
            }
        })
        json['XSLTCode'] = xsltId.id;
        json['DocumentSerieCode'] = serieId.id;
        xsltCode = xsltId.id;
        serieCode = serieId.id;
    } else if (body.invoiceProfile == 'EARSIVFATURA') {
        dbInvoiceProfile = 'e-Arşiv Fatura'
        json['SystemInvTypeCode'] = 2;
        const xsltId = await prisma.documentTemplates.findFirst({
            where:{
                type: 2,
                default: true
            }
        })
        const serieId = await prisma.documentSeries.findFirst({
            where:{
                type: 2,
                default: true
            }
        })
        json['XSLTCode'] = xsltId.id;
        json['DocumentSerieCode'] = serieId.id;
        xsltCode = xsltId.id;
        serieCode = serieId.id;
    } else {
        dbInvoiceProfile = 'e-Fatura'
        
        json['SystemInvTypeCode'] = 1;
        const xsltId = await prisma.documentTemplates.findFirst({
            where:{
                type: 1,
                default: true
            }
        })        
        const serieId = await prisma.documentSeries.findFirst({
            where:{
                type: 1,
                default: true
            }
        })
        json['XSLTCode'] = xsltId.id;
        json['DocumentSerieCode'] = serieId.id;
        xsltCode = xsltId.id;
        serieCode = serieId.id;
    }
    const writeResult = await fs.writeFileSync(data.json_path, JSON.stringify(json), 'utf-8');
    await prisma.invoices.update({
            where: {
                id: Number(invId)
            },
            data: {
                invoice_profile: dbInvoiceProfile,
                invoice_type: body.invoiceType,
                invoice_template_id: xsltCode,
                invoice_serie_id: serieCode
            }
        })
        .then((result) => {
            return res.send({
                status: true,
                message: json
            });
        })
        .catch(err => {
            return res.send({
                status: false,
                message: err
            });
        })
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

const checkLinesInvoice = (req, res) => {  //irsaliyeleştirildi
    const id = req.params.id;
    checkLinesJSON(id)
    .then(result => {
        return res.send(result);
    })
    .catch(err => {
        return res.send({status:false, message: 'Kalemler karşılaştırılırken hata ile karşılaşıldı! Göndermek istediğinize emin misiniz?'})
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