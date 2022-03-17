const db = require('../../src/sqlite/sqlite-db');
const listeDoc = require('../../src/entegrator/mimsoft/ui/list_edoc');
const resolveToken = require('../../src/middlewares/mimsoft/resolveToken');
const eDoc = require('../../src/entegrator/mimsoft/eDoc/index');

const listeInvoices = async (req, res) => {

    res.render('layouts/outgoing/einvoice-list', {
        title: 'Giden e-Faturalar',
        pagetitle: 'Giden e-Fatura Listesi',
        apptitle: 'outgoing-einvoices',
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
        direction: 'out',
        include_erp: true,
        archived: false,
        read_marked: query.read_marked || null,
        profile_ids: query.profile_ids || null,
        type_codes: query.type_codes || null,
        
    }
    let status_codes = [];
    let reply_status_codes = [];
    if(query.filter_array) {
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
                if(data.status.reply){
                    reply = {
                        13 : data.status.reply.message,
                        14 : data.status.reply.status_code
                    }
                } else if(data.profile_id == 'TEMELFATURA'){
                    reply = {
                        13 : 'Temel faturalar için cevap verilmemektedir.',
                        14 : ''
                    }
                } else {
                    reply = {
                        13 : '',
                        14 : ''
                    }
                }
                const object = {
                    0: data.uuid,
                    1: data.id,
                    2: data.type_code,
                    3: data.profile_id,
                    4: data.payable,
                    5: data.tax.amount,
                    6: data.payable_currency,
                    7: data.issue_date,
                    8: data.received_at,
                    9: data.receiver.name,
                    10: data.receiver.vkn_tckn,
                    11: data.status.message,
                    12: data.status.status_code,
                    ...reply,
                    15: data.status.progress.percentage,
                    16: null
                }
                dataArr.push(object);
            }
            const returnObject = {
                draw,
                recordsTotal: result.resultData.pagination.count,
                recordsFiltered: result.resultData.pagination.count,
                data : dataArr
            }
            return res.send(returnObject);
        })
        .catch(err => {
            if(err.resultCode == 404) {
                const returnObject = {
                    draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data : []
                }
                return res.send(returnObject);
            }
            return res.send({error : err});
        })

}

const exportInvoice = async (req, res) => {
    const type = req.params.type;
    const uuid = req.params.uuid;
    const token = await resolveToken();
    eDoc.eInvoice.exportInvoice(uuid, type, token)
    .then(result => {
        return res.send(result);
    })
    .catch(err => {
        console.log(err);
        return res.send(err);
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

const listeArchive = async (req, res) => {

    res.render('layouts/outgoing/earchive-list', {
        title: 'Giden e-Arşiv Faturalar',
        pagetitle: 'Giden e-Arşiv Fatura Listesi',
        apptitle: 'outgoing-earchive',
    });

}

const getListArchive = async (req, res) => {

    const query = req.query;
    const draw = query.draw;
    const keys = {
        start_date: query.start_date,
        end_date: query.end_date,
        sort_by: 'issue_date',
        q: query.search_keywords,
        page_size: query['length'],
        page_index: (query.start / query['length']) + 1,
        direction: 'out',
        include_erp: true,
        archived: false,
        read_marked: query.read_marked || null,
        profile_ids: query.profile_ids || null,
        type_codes: query.type_codes || null,
        
    }
    let status_codes = [];
    if(query.filter_array) {
        for await (filter of query.filter_array) {
            switch (filter.customData) {
                case 'status_codes':
                    status_codes.push(parseInt(filter.value));
                    break;
                }
        }
    }
    const sort_defs = [{
        field: query.order_value,
        direction: query.order_direction
    }]

    keys['status_codes'] = status_codes || null;
    keys['sort_defs'] = sort_defs;

    listeDoc('earchive', keys)
        .then(async (result) => {
            let dataArr = [];
            const datas = result.resultData;
            for await (data of datas.items) {
                const object = {
                    0: data.uuid,
                    1: data.id,
                    2: data.type_code,
                    3: data.profile_id,
                    4: data.payable,
                    5: data.tax.amount,
                    6: data.payable_currency,
                    7: data.issue_date,
                    8: data.received_at,
                    9: data.receiver.name,
                    10: data.receiver.vkn_tckn,
                    11: data.status.message,
                    12: data.status.status_code,
                    13: data.status.progress.percentage,
                    14: null
                }
                dataArr.push(object);
            }
            const returnObject = {
                draw,
                recordsTotal: result.resultData.pagination.count,
                recordsFiltered: result.resultData.pagination.count,
                data : dataArr
            }
            return res.send(returnObject);
        })
        .catch(err => {
            if(err.resultCode == 404) {
                const returnObject = {
                    draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data : []
                }
                return res.send(returnObject);
            }
            return res.send({error : err});
        })

}

const exportArchive = async (req, res) => {
    const type = req.params.type;
    const uuid = req.params.uuid;
    const token = await resolveToken();
    eDoc.eArchive.exportInvoice(uuid, type, token)
    .then(result => {
        return res.send(result);
    })
    .catch(err => {
        console.log(err);
        return res.send(err);
    })
}


module.exports = {
    listeInvoices,
    getList,
    exportInvoice,
    listeArchive,
    getListArchive,
    exportArchive,
    checkEInvoiceStatus
};