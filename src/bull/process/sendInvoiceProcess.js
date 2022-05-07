const builders = require('../../builders/index');
const db = require('../../sqlite/sqlite-db');
const fs = require('fs');
const {updateInvoiceStatus} = require('../queue/updateInvoiceStatusQueue');
const sendEDoc = require('../../entegrator/mimsoft/eDoc/sendEDoc');
const { XMLParser } = require('fast-xml-parser');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const sendInvoiceProcess = async (job, done) => {
    const invId = job.data.invId;
    updateInvoiceStatus(invId, 100);
    //db.query('select * from invoices where id = ?', [invId])
    prisma.invoices.findFirst({
        where:{
            id: Number(invId)
        }
    })
    .then(async (result) => {
        const xmlPath =  __basedir + '/files/xmls/' + result.uuid + '.xml';
        const xml = await builders.invoiceXMLBuilder(result.json_path, { type: 'send' , invoice_number: result.invoice_number})
        const parser = new XMLParser();
        const parsedXML = parser.parse(xml);
        fs.writeFile( xmlPath , xml, (err) => {
            if(err) {
                updateInvoiceStatus(invId, 101, JSON.stringify(err));
                done(new Error(err));
            }
            //db.insert('update invoices set xml_path = ?, invoice_number = ? where id = ?', [xmlPath, parsedXML.Invoice['cbc:ID'],invId])
            prisma.invoices.update({
                where:{
                    id: Number(invId)
                },
                data:{
                    xml_path: xmlPath,
                    invoice_number: parsedXML.Invoice['cbc:ID']
                }
            })
            .then(result => {
                sendEDoc(invId)
                .then(result => {
                    if(result.resultCode == 201){
                        updateInvoiceStatus(invId, 105);
                        done(null, result);
                    } else {
                        updateInvoiceStatus(invId, 102, JSON.stringify(result));
                        done(null, result);
                    }
                })
                .catch(err => {
                    updateInvoiceStatus(invId, 101, err);
                    console.log(err);
                    done(new Error(err));
                })
            })
            .catch(err => {
                updateInvoiceStatus(invId, 101, err);
                done(new Error(err));
            })
           
        })
    })
    .catch(err => {
        console.log(err);
        updateInvoiceStatus(invId, 101, JSON.stringify(err));
        done(new Error(err));
    })
}

module.exports = sendInvoiceProcess;