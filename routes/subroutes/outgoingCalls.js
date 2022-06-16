
const listeDoc = require("../../src/entegrator/mimsoft/ui/list_edoc");
const resolveToken = require("../../src/middlewares/mimsoft/resolveToken");
const eDoc = require("../../src/entegrator/mimsoft/eDoc/index");
const json2xls = require('json2xls');
const fs = require('fs')

const listeInvoices = async (req, res) => {
    res.render("layouts/outgoing/einvoice-list", {
        title: "Giden e-Faturalar",
        pagetitle: "Giden e-Fatura Listesi",
        apptitle: "outgoing-einvoices",
    });
};

const getList = async (req, res) => {
    const query = req.query;
    const draw = query.draw;
    const keys = {
        start_date: query.start_date,
        end_date: query.end_date,
        sort_by: "issue_date",
        q: query.search_keywords,
        page_size: query["length"],
        page_index: query.start / query["length"] + 1,
        direction: "out",
        include_erp: true,
        archived: false,
        read_marked: query.read_marked || null,
        profile_ids: query.profile_ids || null,
        type_codes: query.type_codes || null,
    };
    let status_codes = [];
    let reply_status_codes = [];
    if (query.filter_array) {
        for await (filter of query.filter_array) {
            switch (filter.customData) {
                case "status_codes":
                    status_codes.push(parseInt(filter.value));
                    break;
                case "reply_status_codes":
                    reply_status_codes.push(parseInt(filter.value));
                    break;
            }
        }
    }
    const sort_defs = [
        {
            field: query.order_value,
            direction: query.order_direction,
        },
    ];

    keys["status_codes"] = status_codes || null;
    keys["reply_status_codes"] = reply_status_codes || null;
    keys["sort_defs"] = sort_defs;

    listeDoc("einvoice", keys)
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
                        16: data.status.reply.status_code,
                    };
                } else if (data.profile_id == "TEMELFATURA") {
                    reply = {
                        15: "Temel faturalarda cevap bulunmuyor.",
                        16: "",
                    };
                } else {
                    reply = {
                        15: "",
                        16: "",
                    };
                }

                if (data.erp_marked_at) {
                    print = {
                        2: data.erp_marked_at,
                    };
                } else {
                    print = {
                        2: null,
                    };
                }

                if (data.read_at) {
                    read_at = {
                        1: data.read_at,
                    };
                } else {
                    read_at = {
                        1: null,
                    };
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
                    11: data.receiver.name,
                    12: data.receiver.vkn_tckn,
                    13: data.status.message,
                    14: data.status.status_code,
                    ...reply,
                    17: data.status.progress.percentage,
                    18: null,
                };
                dataArr.push(object);
            }
            const returnObject = {
                draw,
                recordsTotal: result.resultData.pagination.count,
                recordsFiltered: result.resultData.pagination.count,
                data: dataArr,
            };
            return res.send(returnObject);
        })
        .catch((err) => {
            if (err.resultCode == 404) {
                const returnObject = {
                    draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: [],
                };
                return res.send(returnObject);
            }
            return res.send({
                error: err,
            });
        });
};

const exportInvoice = async (req, res) => {
    const type = req.params.type;
    const uuid = req.params.uuid;
    const token = await resolveToken();
    if (type == "html") {
        eDoc.eInvoice
            .exportInvoiceOld(uuid, type, token)
            .then((result) => {
                return res.send(result);
            })
            .catch((err) => {
                console.log(err);
                return res.send(err);
            });
    } else {
        eDoc.eInvoice
            .exportInvoice(uuid, type, token)
            .then((result) => {
                return res.send(result.resultData);
            })
            .catch((err) => {
                console.log(err);
                return res.send(err);
            });
    }
};

const checkEInvoiceStatus = async (req, res) => {
    const uuid = req.params.uuid;
    const token = await resolveToken();
    eDoc.eInvoice
        .checkStatus(uuid, token)
        .then((result) => {
            return res.send(result);
        })
        .catch((err) => {
            console.log(err);
            return res.send(err);
        });
};

const listeArchive = async (req, res) => {
    res.render("layouts/outgoing/earchive-list", {
        title: "Giden e-Arşiv Faturalar",
        pagetitle: "Giden e-Arşiv Fatura Listesi",
        apptitle: "outgoing-earchive",
    });
};

const getListArchive = async (req, res) => {
    const query = req.query;
    const draw = query.draw;
    const keys = {
        start_date: query.start_date,
        end_date: query.end_date,
        sort_by: "issue_date",
        q: query.search_keywords,
        page_size: query["length"],
        page_index: query.start / query["length"] + 1,
        direction: "out",
        include_erp: true,
        archived: false,
        read_marked: query.read_marked || null,
        profile_ids: query.profile_ids || null,
        type_codes: query.type_codes || null,
    };
    let status_codes = [];
    if (query.filter_array) {
        for await (filter of query.filter_array) {
            switch (filter.customData) {
                case "status_codes":
                    status_codes.push(parseInt(filter.value));
                    break;
            }
        }
    }
    const sort_defs = [
        {
            field: query.order_value,
            direction: query.order_direction,
        },
    ];

    keys["status_codes"] = status_codes || null;
    keys["sort_defs"] = sort_defs;

    listeDoc("earchive", keys)
        .then(async (result) => {
            let dataArr = [];
            const datas = result.resultData;
            for await (data of datas.items) {
                let read_at = {};
                let print = {};
                if (data.erp_marked_at) {
                    print = {
                        2: data.erp_marked_at,
                    };
                } else {
                    print = {
                        2: null,
                    };
                }
                if (data.read_at) {
                    read_at = {
                        1: data.read_at,
                    };
                } else {
                    read_at = {
                        1: null,
                    };
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
                    11: data.receiver.name,
                    12: data.receiver.vkn_tckn,
                    13: data.status.message,
                    14: data.status.status_code,
                    15: data.status.progress.percentage,
                    16: null,
                };
                dataArr.push(object);
            }
            const returnObject = {
                draw,
                recordsTotal: result.resultData.pagination.count,
                recordsFiltered: result.resultData.pagination.count,
                data: dataArr,
            };
            return res.send(returnObject);
        })
        .catch((err) => {
            if (err.resultCode == 404) {
                const returnObject = {
                    draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: [],
                };
                return res.send(returnObject);
            }
            return res.send({
                error: err,
            });
        });
};

const exportArchive = async (req, res) => {
    const type = req.params.type;
    const uuid = req.params.uuid;
    const token = await resolveToken();
    if (type == "html") {
        eDoc.eArchive
            .exportInvoiceOld(uuid, type, token)
            .then((result) => {
                return res.send(result);
            })
            .catch((err) => {
                console.log(err);
                return res.send(err);
            });
    } else {
        eDoc.eArchive
            .exportInvoice(uuid, type, token)
            .then((result) => {
                return res.send(result.resultData);
            })
            .catch((err) => {
                console.log(err);
                return res.send(err);
            });
    }
};

const checkEArchiveStatus = async (req, res) => {
    const uuid = req.params.uuid;
    const token = await resolveToken();
    eDoc.eArchive
        .checkStatus(uuid, token)
        .then((result) => {
            return res.send(result);
        })
        .catch((err) => {
            console.log(err);
            return res.send(err);
        });
};

const cancelInvoice = async (req, res) => {
    const uuid = req.params.uuid;
    const token = await resolveToken();
    eDoc.eArchive
        .cancel(uuid, token)
        .then((result) => {
            return res.send(result);
        })
        .catch((err) => {
            console.log(err);
            return res.send(err);
        });
};

const markInvoice = async (req, res) => {
    const { uuids, mark, direction, value } = req.body;
    const token = await resolveToken();
    eDoc.eInvoice
        .markInvoice(uuids, mark, value, direction, token)
        .then((result) => {
            if (result.resultCode == 200) {
                return res.send({
                    status: true,
                    message: null,
                });
            } else {
                return res.send({
                    status: false,
                    message: result.resultData,
                });
            }
        })
        .catch((err) => {
            return res.send({
                status: false,
                message: err,
            });
        });
};

const markArchive = async (req, res) => {
    const { uuids, mark, value } = req.body;
    const token = await resolveToken();
    eDoc.eArchive
        .markInvoice(uuids, mark, value, token)
        .then((result) => {
            console.log(result);
            if (result.resultCode == 200) {
                return res.send({
                    status: true,
                    message: null,
                });
            } else {
                return res.send({
                    status: false,
                    message: result.resultData,
                });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.send({
                status: false,
                message: err,
            });
        });
};

const markDespatch = async (req, res) => {
    const { uuids, mark, direction, value } = req.body;
    const token = await resolveToken();
    eDoc.eDespatch
        .markDespatch(uuids, mark, value, direction, token)
        .then((result) => {
            if (result.resultCode == 200) {
                return res.send({
                    status: true,
                    message: null,
                });
            } else {
                return res.send({
                    status: false,
                    message: result.resultData,
                });
            }
        })
        .catch((err) => {
            return res.send({
                status: false,
                message: err,
            });
        });
};

const listeDespatch = async (req, res) => {
    res.render("layouts/outgoing/edespatch-list", {
        title: "Giden e-İrsaliyeler",
        pagetitle: "Giden e-İrsaliye Listesi",
        apptitle: "outgoing-despatches",
    });
};

const getListDespatch = async (req, res) => {
    const query = req.query;
    const draw = query.draw;
    const keys = {
        start_date: query.start_date,
        end_date: query.end_date,
        sort_by: "issue_date",
        q: query.search_keywords,
        page_size: query["length"],
        page_index: query.start / query["length"] + 1,
        direction: "out",
        include_erp: true,
        archived: false,
        read_marked: query.read_marked || null,
        profile_ids: query.profile_ids || null,
        type_codes: query.type_codes || null,
    };
    let status_codes = [];
    let reply_status_codes = [];
    if (query.filter_array) {
        for await (filter of query.filter_array) {
            switch (filter.customData) {
                case "status_codes":
                    status_codes.push(parseInt(filter.value));
                    break;
                case "reply_status_codes":
                    reply_status_codes.push(parseInt(filter.value));
                    break;
            }
        }
    }
    const sort_defs = [
        {
            field: query.order_value,
            direction: query.order_direction,
        },
    ];

    keys["status_codes"] = status_codes || null;
    keys["reply_status_codes"] = reply_status_codes || null;
    keys["sort_defs"] = sort_defs;

    listeDoc("edespatch", keys)
        .then(async (result) => {
            let dataArr = [];
            const datas = result.resultData;
            try {
                for await (data of datas.items) {
                    let reply = {};
                    let read_at = {};
                    let print = {};
                    if (data.status.reply) {
                        reply = {
                            15: data.status.reply.message,
                            16: data.status.reply.status_code,
                        };
                    } else if (data.profile_id == "TEMELFATURA") {
                        reply = {
                            15: "Temel faturalarda cevap bulunmuyor.",
                            16: "",
                        };
                    } else {
                        reply = {
                            15: "",
                            16: "",
                        };
                    }

                    if (data.erp_marked_at) {
                        print = {
                            2: data.erp_marked_at,
                        };
                    } else {
                        print = {
                            2: null,
                        };
                    }

                    if (data.read_at) {
                        read_at = {
                            1: data.read_at,
                        };
                    } else {
                        read_at = {
                            1: null,
                        };
                    }

                    const object = {
                        0: data.uuid,
                        ...read_at,
                        ...print,
                        3: data.id,
                        4: data.type_code,
                        5: data.profile_id,
                        6: 1,
                        7: 2,
                        8: 3,
                        9: data.issue_date,
                        10: data.received_at,
                        11: data.receiver.name,
                        12: data.receiver.vkn_tckn,
                        13: data.status.message,
                        14: data.status.status_code,
                        ...reply,
                        17: data.status.progress.percentage,
                        18: null,
                    };
                    dataArr.push(object);
                }
                const returnObject = {
                    draw,
                    recordsTotal: result.resultData.pagination.count,
                    recordsFiltered: result.resultData.pagination.count,
                    data: dataArr,
                };
                return res.send(returnObject);
            } catch (e) {
                console.log(e);
                return res.send(e);
            }
        })
        .catch((err) => {
            if (err.resultCode == 404) {
                const returnObject = {
                    draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: [],
                };
                return res.send(returnObject);
            }
            return res.send({
                error: err,
            });
        });
};

const exportDespatch = async (req, res) => {
    const type = req.params.type;
    const uuid = req.params.uuid;
    const token = await resolveToken();
    if (type == "html") {
        eDoc.eDespatch
            .exportDespatchOld(uuid, type, token)
            .then((result) => {
                return res.send(result);
            })
            .catch((err) => {
                console.log(err);
                return res.send(err);
            });
    } else {
        eDoc.eDespatch
            .exportDespatch(uuid, type, token)
            .then((result) => {
                return res.send(result.resultData);
            })
            .catch((err) => {
                console.log(err);
                return res.send(err);
            });
    }
};

const checkEDespatchStatus = async (req, res) => {
    const uuid = req.params.uuid;
    const token = await resolveToken();
    eDoc.eDespatch
        .checkStatus(uuid, token)
        .then((result) => {
            return res.send(result);
        })
        .catch((err) => {
            console.log(err);
            return res.send(err);
        });
};

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
                "ÖİV Tutarı": 0
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
                    oivObject['ÖİV Tutarı'] = tax.amount;
                }
                else if (tax.code == '4081') {
                    oivObject['ÖİV Tutarı'] = tax.amount;
                }
            }
            return {
                'UUID': data.uuid,
                'Fatura No': data.id,
                'Fatura Tarihi': data.issue_date,
                'Gönderim Tarihi': data.received_at,
                'Profili': data.profile_id,
                'Tipi': data.type_code,
                'Gönderici Ünvan': data.sender.name,
                'Gönderici VKN/TCKN': data.sender.vkn_tckn,
                'Alıcı Ünvan': data.receiver.name,
                'Alıcı VKN/TCKN': data.receiver.vkn_tckn,
                'Para Birimi': data.payable_currency,
                'Ödenecek Tutar': data.payable,
                'Vergiler Hariç Toplam': data.tax_exclusive,
                'Vergiler Toplamı': data.tax.amount,
                'İndirim Tutarı': data.allowance,
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
    try {
        const list = req.body.uuids;
        const direction = req.body.direction;
        const token = await resolveToken();
        let detailsObject = await eDoc.eInvoice.getDetails(list, direction, token);

        let excelArray = [];

        for (let i = 0; i < detailsObject.length; i++) {
            for (let j = 0; j < detailsObject[i].lines.length; j++) {
                let taxObject = {
                    "KDV Oranı": 0,
                    "KDV Matrahı": 0,
                    "KDV Tutarı": 0
                }
                let oivObject = {
                    "ÖİV Tutarı": 0
                }
                if ('tax' in detailsObject[i].lines[j]) {
                    for (tax of detailsObject[i].lines[j].tax.subtotals) {
                        if (tax.code == '0015') {
                            taxObject['KDV Oranı'] = tax.percent;
                            taxObject['KDV Matrahı'] = tax.taxable;
                            taxObject['KDV Tutarı'] = tax.amount;
                        }
                        else if (tax.code == '4080') {
                            oivObject['ÖİV Tutarı'] = tax.amount;
                        }
                        else if (tax.code == '4081') {
                            oivObject['ÖİV Tutarı'] = tax.amount;
                        }
                    }
                }
                let allowanceObject = {
                    "Kalem İndirim Tutarı": 0
                }
                if('allowances' in detailsObject[i].lines[j]) {
                    allowanceObject['İndirim Tutarı'] = detailsObject[i].lines[j].allowances.amount;
                }

                const lineObject = {
                    'UUID': detailsObject[i].uuid,
                    'Fatura No': detailsObject[i].id,
                    'Fatura Tarihi': detailsObject[i].issue_date,
                    'Gönderim Tarihi': detailsObject[i].received_at,
                    'Profili': detailsObject[i].profile_id,
                    'Tipi': detailsObject[i].type_code,
                    'Gönderici Ünvan': detailsObject[i].sender.name,
                    'Gönderici VKN/TCKN': detailsObject[i].sender.vkn_tckn,
                    'Alıcı Ünvan': detailsObject[i].receiver.name,
                    'Alıcı VKN/TCKN': detailsObject[i].receiver.vkn_tckn,
                    'Para Birimi': detailsObject[i].payable_currency,
                    'Ödenecek Tutar': detailsObject[i].payable,
                    'Vergiler Hariç Toplam': detailsObject[i].tax_exclusive,
                    'Vergiler Toplamı': detailsObject[i].tax.amount,
                    'İndirim Tutarı': detailsObject[i].allowance,
                    'Kalem Adı': detailsObject[i].lines[j].name,
                    'Miktarı': detailsObject[i].lines[j].quantity,
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
    } catch (error) {
        return res.send({
            status: false,
            error
        })
    }

}

const getArchiveUUIDsDetails = async (req, res) => {
    try {
        const list = req.body.uuids;
        const token = await resolveToken();
        let detailsObject = await eDoc.eArchive.getDetails(list, token);
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
                "ÖİV Tutarı": 0
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
                    oivObject['ÖİV Tutarı'] = tax.amount;
                }
                else if (tax.code == '4081') {
                    oivObject['ÖİV Tutarı'] = tax.amount;
                }
            }
            return {
                'UUID': data.uuid,
                'Fatura No': data.id,
                'Fatura Tarihi': data.issue_date,
                'Gönderim Tarihi': data.received_at,
                'Profili': data.profile_id,
                'Tipi': data.type_code,
                'Gönderici Ünvan': data.sender.name,
                'Gönderici VKN/TCKN': data.sender.vkn_tckn,
                'Alıcı Ünvan': data.receiver.name,
                'Alıcı VKN/TCKN': data.receiver.vkn_tckn,
                'Para Birimi': data.payable_currency,
                'Ödenecek Tutar': data.payable,
                'Vergiler Hariç Toplam': data.tax_exclusive,
                'Vergiler Toplamı': data.tax.amount,
                'İndirim Tutarı': data.allowance,
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

const getArchiveUUIDsLineDetails = async (req, res) => {
    try {
        const list = req.body.uuids;
        const token = await resolveToken();
        let detailsObject = await eDoc.eArchive.getDetails(list, token);

        let excelArray = [];

        for (let i = 0; i < detailsObject.length; i++) {
            for (let j = 0; j < detailsObject[i].lines.length; j++) {
                let taxObject = {
                    "KDV Oranı": 0,
                    "KDV Matrahı": 0,
                    "KDV Tutarı": 0
                }
                let oivObject = {
                    "ÖİV Tutarı": 0
                }
                if ('tax' in detailsObject[i].lines[j]) {
                    for (tax of detailsObject[i].lines[j].tax.subtotals) {
                        if (tax.code == '0015') {
                            taxObject['KDV Oranı'] = tax.percent;
                            taxObject['KDV Matrahı'] = tax.taxable;
                            taxObject['KDV Tutarı'] = tax.amount;
                        }
                        else if (tax.code == '4080') {
                            oivObject['ÖİV Tutarı'] = tax.amount;
                        }
                        else if (tax.code == '4081') {
                            oivObject['ÖİV Tutarı'] = tax.amount;
                        }
                    }
                }
                let allowanceObject = {
                    "Kalem İndirim Tutarı": 0
                }
                if('allowances' in detailsObject[i].lines[j]) {
                    allowanceObject['İndirim Tutarı'] = detailsObject[i].lines[j].allowances.amount;
                }

                const lineObject = {
                    'UUID': detailsObject[i].uuid,
                    'Fatura No': detailsObject[i].id,
                    'Fatura Tarihi': detailsObject[i].issue_date,
                    'Gönderim Tarihi': detailsObject[i].received_at,
                    'Profili': detailsObject[i].profile_id,
                    'Tipi': detailsObject[i].type_code,
                    'Gönderici Ünvan': detailsObject[i].sender.name,
                    'Gönderici VKN/TCKN': detailsObject[i].sender.vkn_tckn,
                    'Alıcı Ünvan': detailsObject[i].receiver.name,
                    'Alıcı VKN/TCKN': detailsObject[i].receiver.vkn_tckn,
                    'Para Birimi': detailsObject[i].payable_currency,
                    'Ödenecek Tutar': detailsObject[i].payable,
                    'Vergiler Hariç Toplam': detailsObject[i].tax_exclusive,
                    'Vergiler Toplamı': detailsObject[i].tax.amount,
                    'İndirim Tutarı': detailsObject[i].allowance,
                    'Kalem Adı': detailsObject[i].lines[j].name,
                    'Miktarı': detailsObject[i].lines[j].quantity,
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
    } catch (error) {
        return res.send({
            status: false,
            error
        })
    }

}

module.exports = {
    listeInvoices,
    getList,
    exportInvoice,
    listeArchive,
    getListArchive,
    exportArchive,
    checkEInvoiceStatus,
    markInvoice,
    markArchive,
    checkEArchiveStatus,
    cancelInvoice,
    listeDespatch,
    getListDespatch,
    exportDespatch,
    checkEDespatchStatus,
    markDespatch,
    getUUIDsDetails,
    getUUIDsLineDetails,
    getArchiveUUIDsDetails,
    getArchiveUUIDsLineDetails
};
