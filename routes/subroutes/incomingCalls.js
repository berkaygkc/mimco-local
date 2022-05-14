const listeDoc = require('../../src/entegrator/mimsoft/ui/list_edoc');
const resolveToken = require('../../src/middlewares/mimsoft/resolveToken');
const eDoc = require('../../src/entegrator/mimsoft/eDoc/index');

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
                        15: 'Temel faturalar için cevap verilmemektedir.',
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
            resultData: 'Cevap geçersiz'
        })
    }
}

const listeDespatch = async (req, res) => {

    res.render('layouts/incoming/edespatch-list', {
        title: 'Gelen e-İrsaliyeler',
        pagetitle: 'Gelen e-İrsaliye Listesi',
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
                        15: 'Temel faturalar için cevap verilmemektedir.',
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
            resultData: 'Cevap geçersiz'
        })
    }
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
    replyDespatch
};