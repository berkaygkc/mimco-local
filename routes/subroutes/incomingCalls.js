const listeDoc = require('../../src/entegrator/mimsoft/ui/list_edoc');
const resolveToken = require('../../src/middlewares/mimsoft/resolveToken');
const eDoc = require('../../src/entegrator/mimsoft/eDoc/index');
const json2xls = require('json2xls');
const fs = require('fs')

const listeInvoices = async (req, res) => {

    res.render('layouts/incoming/einvoice-list', {
        title: 'Gelen e-Faturalar',
        pagetitle: 'Gelen e-Fatura Listesi',
        apptitle: 'incoming-einvoices',
    });

}

const getList = async (req, res) => {

    const query = req.query;
    const draw = query.draw;
    const keys = {
        start_date: query.start_date,
        end_date: query.end_date,
        sort_by: 'issue_date',
        q: query.search_keywords,
        page_size: query['length'],
        page_index: (query.start / query['length']) + 1,
        direction: 'in',
        include_erp: true,
        archived: false,
        read_marked: query.read_marked || null,
        profile_ids: query.profile_ids || null,
        type_codes: query.type_codes || null,

    }
    let status_codes = [];
    let reply_status_codes = [];
    if (query.filter_array) {
        for await (filter of query.filter_array) {
            switch (filter.customData) {
                case 'status_codes':
                    status_codes.push(parseInt(filter.value));
                    break;
                case 'reply_status_codes':
                    reply_status_codes.push(parseInt(filter.value));
                    break;
            }
        }
    }
    const sort_defs = [{
        field: query.order_value,
        direction: query.order_direction
    }]

    keys['status_codes'] = status_codes || null;
    keys['reply_status_codes'] = reply_status_codes || null;
    keys['sort_defs'] = sort_defs;

    listeDoc('einvoice', keys)
        .then(async (result) => {
            let dataArr = [];
            const datas = result.resultData;
            for await (data of datas.items) {
                let reply = {};
                let read_at = {};
                let print = {};
                if (data.status.reply) {
                    reply = {
                        15: data.status.reply.message,
                        16: data.status.reply.status_code
                    }
                } else if (data.profile_id == 'TEMELFATURA') {
                    reply = {
                        15: 'Temel faturalar i??in cevap verilmemektedir.',
                        16: ''
                    }
                } else {
                    reply = {
                        15: '',
                        16: ''
                    }
                }

                if (data.erp_marked_at) {
                    print = {
                        2: data.erp_marked_at,
                    }
                } else {
                    print = {
                        2: null
                    }
                }

                if (data.read_at) {
                    read_at = {
                        1: data.read_at,
                    }
                } else {
                    read_at = {
                        1: null
                    }
                }

                const object = {
                    0: data.uuid,
                    ...read_at,
                    ...print,
                    3: data.id,
                    4: data.type_code,
                    5: data.profile_id,
                    6: data.payable,
                    7: data.tax.amount,
                    8: data.payable_currency,
                    9: data.issue_date,
                    10: data.received_at,
                    11: data.sender.name,
                    12: data.sender.vkn_tckn,
                    13: data.status.message,
                    14: data.status.status_code,
                    ...reply,
                    17: data.status.progress.percentage,
                    18: null
                }
                dataArr.push(object);
            }
            const returnObject = {
                draw,
                recordsTotal: result.resultData.pagination.count,
                recordsFiltered: result.resultData.pagination.count,
                data: dataArr
            }
            return res.send(returnObject);
        })
        .catch(err => {
            if (err.resultCode == 404) {
                const returnObject = {
                    draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: []
                }
                return res.send(returnObject);
            }
            return res.send({
                error: err
            });
        })

}

const checkEInvoiceStatus = async (req, res) => {
    const uuid = req.params.uuid;
    const token = await resolveToken();
    eDoc.eInvoice.checkStatus(uuid, token)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            console.log(err);
            return res.send(err);
        })

}

const exportInvoice = async (req, res) => {
    const type = req.params.type;
    const uuid = req.params.uuid;
    const token = await resolveToken();
    if (type == 'html') {
        eDoc.eInvoice.exportInvoiceOld(uuid, type, token)
            .then(result => {
                return res.send(result);
            })
            .catch(err => {
                console.log(err);
                return res.send(err);
            })
    } else {
        eDoc.eInvoice.exportInvoice(uuid, type, token)
            .then(result => {
                return res.send(result.resultData);
            })
            .catch(err => {
                console.log(err);
                return res.send(err);
            })
    }


}

const replyInvoice = async (req, res) => {
    const uuid = req.params.uuid;
    const {
        reply,
        reject_reason
    } = req.body;
    const token = await resolveToken();
    console.log(req.body, reply, reject_reason);
    if (reply == 'accept') {
        eDoc.eInvoice.accept(uuid, token)
            .then(result => {
                console.log(result);
                return res.send(result)
            })
            .catch(err => {
                console.log(err);
                return res.send(err);
            })
    } else if (reply == 'reject') {
        eDoc.eInvoice.reject(uuid, reject_reason, token)
            .then(result => {
                if (result.resultCode == 204) {
                    return res.send(result);
                } else {
                    return res.status(500).send({
                        status: false,
                        message: result
                    });
                }

            })
            .catch(err => {
                console.log(err);
                return res.send(err);
            })
    } else {
        return res.send({
            resultCode: 500,
            resultData: 'Cevap ge??ersiz'
        })
    }
}

const listeDespatch = async (req, res) => {

    res.render('layouts/incoming/edespatch-list', {
        title: 'Gelen e-??rsaliyeler',
        pagetitle: 'Gelen e-??rsaliye Listesi',
        apptitle: 'incoming-despatches',
    });

}

const getListDespatch = async (req, res) => {

    const query = req.query;
    const draw = query.draw;
    const keys = {
        start_date: query.start_date,
        end_date: query.end_date,
        sort_by: 'issue_date',
        q: query.search_keywords,
        page_size: query['length'],
        page_index: (query.start / query['length']) + 1,
        direction: 'in',
        include_erp: true,
        archived: false,
        read_marked: query.read_marked || null,
        profile_ids: query.profile_ids || null,
        type_codes: query.type_codes || null,

    }
    let status_codes = [];
    let reply_status_codes = [];
    if (query.filter_array) {
        for await (filter of query.filter_array) {
            switch (filter.customData) {
                case 'status_codes':
                    status_codes.push(parseInt(filter.value));
                    break;
                case 'reply_status_codes':
                    reply_status_codes.push(parseInt(filter.value));
                    break;
            }
        }
    }
    const sort_defs = [{
        field: query.order_value,
        direction: query.order_direction
    }]

    keys['status_codes'] = status_codes || null;
    keys['reply_status_codes'] = reply_status_codes || null;
    keys['sort_defs'] = sort_defs;

    listeDoc('edespatch', keys)
        .then(async (result) => {
            let dataArr = [];
            const datas = result.resultData;
            for await (data of datas.items) {
                let reply = {};
                let read_at = {};
                let print = {};
                if (data.status.reply) {
                    reply = {
                        15: data.status.reply.message,
                        16: data.status.reply.status_code
                    }
                } else if (data.profile_id == 'TEMELFATURA') {
                    reply = {
                        15: 'Temel faturalar i??in cevap verilmemektedir.',
                        16: ''
                    }
                } else {
                    reply = {
                        15: '',
                        16: ''
                    }
                }

                if (data.erp_marked_at) {
                    print = {
                        2: data.erp_marked_at,
                    }
                } else {
                    print = {
                        2: null
                    }
                }

                if (data.read_at) {
                    read_at = {
                        1: data.read_at,
                    }
                } else {
                    read_at = {
                        1: null
                    }
                }

                const object = {
                    0: data.uuid,
                    ...read_at,
                    ...print,
                    3: data.id,
                    4: data.type_code,
                    5: data.profile_id,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: data.issue_date,
                    10: data.received_at,
                    11: data.sender.name,
                    12: data.sender.vkn_tckn,
                    13: data.status.message,
                    14: data.status.status_code,
                    ...reply,
                    17: data.status.progress.percentage,
                    18: null
                }
                dataArr.push(object);
            }
            const returnObject = {
                draw,
                recordsTotal: result.resultData.pagination.count,
                recordsFiltered: result.resultData.pagination.count,
                data: dataArr
            }
            return res.send(returnObject);
        })
        .catch(err => {
            if (err.resultCode == 404) {
                const returnObject = {
                    draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: []
                }
                return res.send(returnObject);
            }
            return res.send({
                error: err
            });
        })

}

const checkEDespatchStatus = async (req, res) => {
    const uuid = req.params.uuid;
    const token = await resolveToken();
    eDoc.eDespatch.checkStatus(uuid, token)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            console.log(err);
            return res.send(err);
        })

}

const exportDespatch = async (req, res) => {
    const type = req.params.type;
    const uuid = req.params.uuid;
    const token = await resolveToken();
    console.log(type, uuid, token)
    if (type == 'html') {
        eDoc.eDespatch.exportDespatchOld(uuid, type, token)
            .then(result => {
                return res.send(result);
            })
            .catch(err => {
                console.log(err);
                return res.send(err);
            })
    } else {
        eDoc.eDespatch.exportDespatch(uuid, type, token)
            .then(result => {
                return res.send(result.resultData);
            })
            .catch(err => {
                console.log(err);
                return res.send(err);
            })
    }


}

const replyDespatch = async (req, res) => {
    const uuid = req.params.uuid;
    const {
        reply,
        reject_reason
    } = req.body;
    const token = await resolveToken();
    console.log(req.body, reply, reject_reason);
    if (reply == 'accept') {
        eDoc.eDespatch.accept(uuid, token)
            .then(result => {
                console.log(result);
                return res.send(result)
            })
            .catch(err => {
                console.log(err);
                return res.send(err);
            })
    } else if (reply == 'reject') {
        eDoc.eDespatch.reject(uuid, reject_reason, token)
            .then(result => {
                if (result.resultCode == 204) {
                    return res.send(result);
                } else {
                    return res.status(500).send({
                        status: false,
                        message: result
                    });
                }

            })
            .catch(err => {
                console.log(err);
                return res.send(err);
            })
    } else {
        return res.send({
            resultCode: 500,
            resultData: 'Cevap ge??ersiz'
        })
    }
}

const getUUIDsDetails = async (req, res) => {
    try {
        const list = req.body.uuids;
        const direction = req.body.direction;
        const token = await resolveToken();
        let detailsObject = await eDoc.eInvoice.getDetails(list, direction, token);
        const details = detailsObject.map(data => {
            let taxObject = {
                "KDV0 Matrah": 0,
                "KDV0 Tutar": 0,
                "KDV1 Matrah": 0,
                "KDV1 Tutar": 0,
                "KDV8 Matrah": 0,
                "KDV8 Tutar": 0,
                "KDV18 Matrah": 0,
                "KDV18 Tutar": 0,

            };
            let oivObject = {
                "????V Tutar??": 0
            }
            for (tax of data.tax.subtotals) {
                if (tax.code == '0015') {
                    if (tax.percent == 0) {
                        taxObject['KDV0 Matrah'] = tax.taxable;
                        taxObject['KDV0 Tutar'] = tax.amount;
                    } else if (tax.percent == 1) {
                        taxObject['KDV1 Matrah'] = tax.taxable;
                        taxObject['KDV1 Tutar'] = tax.amount;
                    } else if (tax.percent == 8) {
                        taxObject['KDV8 Matrah'] = tax.taxable;
                        taxObject['KDV8 Tutar'] = tax.amount;
                    } else if (tax.percent == 18) {
                        taxObject['KDV18 Matrah'] = tax.taxable;
                        taxObject['KDV18 Tutar'] = tax.amount;
                    }
                }
                else if (tax.code == '4080') {
                    oivObject['????V Tutar??'] = tax.amount;
                }
                else if (tax.code == '4081') {
                    oivObject['????V Tutar??'] = tax.amount;
                }
            }
            return {
                'UUID': data.uuid,
                'Fatura No': data.id,
                'Fatura Tarihi': data.issue_date,
                'G??nderim Tarihi': data.received_at,
                'Profili': data.profile_id,
                'Tipi': data.type_code,
                'G??nderici ??nvan': data.sender.name,
                'G??nderici VKN/TCKN': data.sender.vkn_tckn,
                'Al??c?? ??nvan': data.receiver.name,
                'Al??c?? VKN/TCKN': data.receiver.vkn_tckn,
                'Para Birimi': data.payable_currency,
                '??denecek Tutar': data.payable,
                'Vergiler Hari?? Toplam': data.tax_exclusive,
                'Vergiler Toplam??': data.tax.amount,
                '??ndirim Tutar??': data.allowance,
                ...taxObject,
                ...oivObject
            }
        })
        const xls = json2xls(details);
        const xlsxPath = __basedir + "/files/xlsx/TopluExcel-" + Math.round(+new Date() / 1000) + ".xlsx";
        const result = fs.writeFileSync(xlsxPath, xls, 'binary');
        const base64 = fs.readFileSync(xlsxPath, 'base64');
        const deletedProcess = fs.unlinkSync(xlsxPath);
        return res.send({
            status: true,
            data: base64
        })
    } catch (error) {
        return res.send({
            status: false,
            error
        })
    }
}

const getUUIDsLineDetails = async (req, res) => {
    //try {
        const list = req.body.uuids;
        const direction = req.body.direction;
        const token = await resolveToken();
        let detailsObject = await eDoc.eInvoice.getDetails(list, direction, token);

        let excelArray = [];

        for (let i = 0; i < detailsObject.length; i++) {
            for (let j = 0; j < detailsObject[i].lines.length; j++) {
                console.log(i,j)
                let taxObject = {
                    "Kalem Vergiler Toplam??": 0,
                    "KDV Oran??": 0,
                    "KDV Matrah??": 0,
                    "KDV Tutar??": 0
                }
                let oivObject = {
                    "????V Tutar??": 0
                }
                if ('tax' in detailsObject[i].lines[j]) {
                    taxObject['Kalem Vergiler Toplam??'] = detailsObject[i].lines[j].tax.amount;
                    for (tax of detailsObject[i].lines[j].tax.subtotals) {
                        if (tax.code == '0015') {
                            taxObject['KDV Oran??'] = tax.percent;
                            taxObject['KDV Matrah??'] = tax.taxable;
                            taxObject['KDV Tutar??'] = tax.amount;
                        }
                        else if (tax.code == '4080') {
                            oivObject['????V Tutar??'] = tax.amount;
                        }
                        else if (tax.code == '4081') {
                            oivObject['????V Tutar??'] = tax.amount;
                        }
                    }
                }
                let allowanceObject = {
                    "Kalem ??ndirim Tutar??": 0
                }
                if('allowances' in detailsObject[i].lines[j]) {
                    allowanceObject['??ndirim Tutar??'] = detailsObject[i].lines[j].allowances.amount;
                }

                const lineObject = {
                    'UUID': detailsObject[i].uuid,
                    'Fatura No': detailsObject[i].id,
                    'Fatura Tarihi': detailsObject[i].issue_date,
                    'G??nderim Tarihi': detailsObject[i].received_at,
                    'Profili': detailsObject[i].profile_id,
                    'Tipi': detailsObject[i].type_code,
                    'G??nderici ??nvan': detailsObject[i].sender.name,
                    'G??nderici VKN/TCKN': detailsObject[i].sender.vkn_tckn,
                    'Al??c?? ??nvan': detailsObject[i].receiver.name,
                    'Al??c?? VKN/TCKN': detailsObject[i].receiver.vkn_tckn,
                    'Para Birimi': detailsObject[i].payable_currency,
                    '??denecek Tutar': detailsObject[i].payable,
                    'Vergiler Hari?? Toplam': detailsObject[i].tax_exclusive,
                    'Vergiler Toplam??': detailsObject[i].tax.amount,
                    '??ndirim Tutar??': detailsObject[i].allowance,
                    'Kalem Ad??': detailsObject[i].lines[j].name,
                    'Miktar??': detailsObject[i].lines[j].quantity,
                    'Birimi': detailsObject[i].lines[j].quantity_unit,
                    'Birim Fiyat': detailsObject[i].lines[j].price,
                    'Tutar': detailsObject[i].lines[j].extension_amount,
                    ...allowanceObject,
                    ...taxObject,
                    ...oivObject
                }
                excelArray.push(lineObject);
            }
        }

        const xls = json2xls(excelArray);
        const xlsxPath = __basedir + "/files/xlsx/TopluExcel-" + Math.round(+new Date() / 1000) + ".xlsx";
        const result = fs.writeFileSync(xlsxPath, xls, 'binary');
        const base64 = fs.readFileSync(xlsxPath, 'base64');
        const deletedProcess = fs.unlinkSync(xlsxPath);
        return res.send({
            status: true,
            data: base64
        })
    // } catch (error) {
    //     return res.send({
    //         status: false,
    //         error
    //     })
    // }

}

module.exports = {
    listeInvoices,
    getList,
    exportInvoice,
    replyInvoice,
    checkEInvoiceStatus,
    listeDespatch,
    getListDespatch,
    exportDespatch,
    checkEDespatchStatus,
    replyDespatch,
    getUUIDsDetails,
    getUUIDsLineDetails
};