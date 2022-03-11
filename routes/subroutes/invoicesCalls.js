const db = require('../../src/sqlite/sqlite-db');
const {sendInvoice} = require('../../src/bull/queue/sendInvoiceQueue');



 


const listInvoices = async (req,res) => {
    const data = await db.query('select STRFTIME(\'%d.%m.%Y\', issue_date) as readable_date,* from invoices ORDER BY issue_date ASC').catch(err => {console.log(err)});
    //console.log(data);
    res.render('layouts/invoices/list', {title: 'Faturalar', pagetitle: 'Gönderim Bekleyen Fatura Listesi', apptitle: 'invoices-list', invoices: data});
}

const sendInvoices = async (req, res) => {
    const invId = req.body.list;
    sendInvoice(invId);
    res.redirect('/');
}

const previewInvoice = async(req, res) => {
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
module.exports = {
    listInvoices,
    sendInvoices,
    previewInvoice
};
