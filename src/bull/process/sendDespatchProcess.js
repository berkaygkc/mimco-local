const builders = require('../../builders/index');
const fs = require('fs');
const {updateDespatchStatus} = require('../queue/updateDespatchStatusQueue');
const sendEDocDespatch = require('../../entegrator/mimsoft/eDoc/sendEDocDespatch');
const { XMLParser } = require('fast-xml-parser');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const sendDespatchProcess = async (job, done) => {
    const dspId = job.data.dspId;
    updateDespatchStatus(dspId, 100);
    prisma.despatches.findFirst({
        where:{
            id: Number(dspId)
        }
    })
    .then(async (result) => {
        const xmlPath =  __basedir + '/files/xmls/' + result.uuid + '.xml';
        const xml = await builders.despatchXMLBuilder(result.json_path, { type: 'send' , despatch_number: result.despatch_number})
        const parser = new XMLParser();
        const parsedXML = parser.parse(xml);
        fs.writeFile( xmlPath , xml, (err) => {
            if(err) {
                updateDespatchStatus(dspId, 101, JSON.stringify(err));
                done(new Error(err));
            }
            prisma.despatches.update({
                where:{
                    id: Number(dspId)
                },
                data:{
                    xml_path: xmlPath,
                    despatch_number: parsedXML.DespatchAdvice['cbc:ID']
                }
            })
            .then(result => {
                sendEDocDespatch(dspId)
                .then(result => {
                    if(result.resultCode == 201){
                        updateDespatchStatus(dspId, 105);
                        done(null, result);
                    } else {
                        updateDespatchStatus(dspId, 102, JSON.stringify(result));
                        done(null, result);
                    }
                })
                .catch(err => {
                    updateDespatchStatus(dspId, 101, err);
                    console.log(err);
                    done(new Error(err));
                })
            })
            .catch(err => {
                updateDespatchStatus(dspId, 101, err);
                done(new Error(err));
            })
           
        })
    })
    .catch(err => {
        console.log(err);
        updateDespatchStatus(dspId, 101, JSON.stringify(err));
        done(new Error(err));
    })
}

module.exports = sendDespatchProcess;