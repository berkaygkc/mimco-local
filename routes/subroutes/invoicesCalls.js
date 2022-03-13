const db = require('../../src/sqlite/sqlite-db');
const {
    sendInvoice
} = require('../../src/bull/queue/sendInvoiceQueue');
const {
    sendSelectedInvoices
} = require('../../src/bull/queue/sendSelectedInvoicesQueue');
const builders = require('../../src/builders/index');
const checkStatus = require('../../src/entegrator/mimsoft/eDoc/checkStatus');
const fs = require('fs');

const listInvoices = async (req, res) => {
    const data = await db.query('select STRFTIME(\'%d.%m.%Y\', issue_date) as readable_date,* from invoices where is_sended = 0 ORDER BY issue_date ASC').catch(err => {
        console.log(err)
    });
    //console.log(data);
    res.render('layouts/invoices/list', {
        title: 'Faturalar',
        pagetitle: 'Gönderim Bekleyen Fatura Listesi',
        apptitle: 'invoices-list',
        invoices: data
    });
}

const sendInvoiceRouter = async (req, res) => {
    const invId = req.params.id;
    sendInvoice(invId);
    return res.send({
        status: true
    })
}

const sendSelectedInvoicesRouter = async (req, res) => {
    const list = req.body.list;
    if (Array.isArray(list)) {
        sendSelectedInvoices(list);
    } else {
        sendInvoice(list);
    }
    return res.send({
        status: true
    })
}

const previewInvoice = async (req, res) => {
    /*SaxonJS.transform({
        stylesheetFileName: "C:/Users/ikcloud/Documents/mimco-local/files/xslt/earchive.sef.json",
        sourceFileName: "C:/Users/ikcloud/Documents/mimco-local/files/xmls/152-223C5627-8025-4DC2-9E0A-CBE537AE1B7C.xml",
        destination: "serialized"
    }, "async")
    .then (output => {
        return res.send(output);
    })
    .catch(err => {
        return res.send(err);
    })*/
    /*const xmlString = fs.readFileSync('C:/Users/ikcloud/Documents/mimco-local/files/xmls/152-223C5627-8025-4DC2-9E0A-CBE537AE1B7C.xml', 'utf-8');
    const xsltString = fs.readFileSync('C:/Users/ikcloud/Documents/mimco-local/files/xslt/e-archive.xsl', 'utf-8')
    // xmlString: string of xml file contents
    // xsltString: string of xslt file contents
    // outXmlString: output xml string.
    install(new DOMParserImpl(), new XMLSerializerImpl(), new DOMImplementationImpl());
    const outXmlString = xsltProcess(xsltProcessor.xmlParse(xmlString), xsltProcessor.xmlParse(xsltString));*/

    let xsltOutput = await execute({
        xml: 'C:/Users/ikcloud/Documents/mimco-local/files/xmls/152-223C5627-8025-4DC2-9E0A-CBE537AE1B7C.xml',
        xsltPath: 'C:/Users/ikcloud/Documents/mimco-local/files/xslt/e-archive.xsl'
    });
    console.log(xsltOutput.toString());
    return res.send(xsltOutput.toString());
}

const invoiceDetail = async (req, res) => {
    const invId = req.params.id;
    const data = await db.query('select status_description from invoices where id = ? LIMIT 1', [invId]).catch(err => {
        console.log(err)
    });
    return res.send(data[0].status_description);

}

const listInvoicesStatus = async (req, res) => {
    const data = await db.query('select STRFTIME(\'%d.%m.%Y\', issue_date) as readable_date,* from invoices where is_sended = 1 ORDER BY updated_at DESC').catch(err => {
        console.log(err)
    });
    res.render('layouts/invoices/status', {
        title: 'Faturalar',
        pagetitle: 'Gönderilmiş Fatura Listesi',
        apptitle: 'invoices-status',
        invoices: data
    });
}

const getXML = async (req, res) => {
    const invId = req.params.id;
    const data = await db.query('select * from invoices where id = ? LIMIT 1', [invId]).catch(err => {
        console.log(err)
    });
    let xml;
    if (data[0].xml_path) {
        xml = fs.readFileSync(data[0].xml_path, 'utf-8');
    } else if (!data[0].is_sended) {
        xml = await builders.invoiceXMLBuilder(data[0].json, {
            type: 'preview'
        });
    }
    return res.send(xml);
}

const getXSLT = async (req, res) => {
    const invId = req.params.id;
    const data = await db.query('select json from invoices where id = ? LIMIT 1', [invId]).catch(err => {
        console.log(err)
    });
    const json = await JSON.parse(fs.readFileSync(data[0].json, 'utf-8'));
    const xsltId = json.XSLTCode;
    const xsltPath = await db.query('select xslt_path from invoice_xslt where id = ? LIMIT 1', [xsltId]).catch(err => {
        console.log(err)
    });
    const xslt = fs.readFileSync(xsltPath[0].xslt_path, 'utf-8');
    return res.send(xslt);
}

const markSended = async (req, res) => {
    const invId = req.params.id;
    db
        .insert('update invoices set is_sended = 1, status_code = 105, invoice_number = ? where id = ?', ['Gönderildi Olarak İşaretlendi!', invId])
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


const markNotSended = async (req, res) => {
    const invId = req.params.id;
    db
        .insert('update invoices set is_sended = 0, status_code = \'\', status_description = \'\' where id = ?', [invId])
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

const markResolved = async (req, res) => {
    const invId = req.params.id;
    db
        .insert('update invoices set is_sended = 1, status_code = 105, invoice_number = ? where id = ?', ['Çözüldü olarak işaretlendi!', invId])
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


const checkInvoiceStatus = async (req, res) => {
    const invId = req.params.id;
    console.log(invId);
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





module.exports = {
    listInvoices,
    sendInvoiceRouter,
    sendSelectedInvoicesRouter,
    previewInvoice,
    listInvoicesStatus,
    invoiceDetail,
    getXML,
    getXSLT,
    markSended,
    markResolved,
    checkInvoiceStatus,
    markNotSended
};