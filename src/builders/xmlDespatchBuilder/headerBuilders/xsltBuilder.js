const fs = require('fs');
const {Buffer} = require('buffer');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = (uuid, issueDate, xsltCode) => {
    return new Promise((resolve, reject) => {
        prisma.documentTemplates.findFirst({
            where:{
                id: xsltCode
            }
        })
        .then(result => {
            try {
                const xsltPath = result.xslt_path;
                const xsltData = fs.readFileSync(xsltPath, 'utf-8')
                const base64encoded = Buffer.from(xsltData).toString('base64');
                const object = {
                    'cac:AdditionalDocumentReference': {
                        'cbc:ID': uuid,
                        'cbc:IssueDate': issueDate.split('T')[0],
                        'cac:Attachment': {
                            'cbc:EmbeddedDocumentBinaryObject': {
                                '@characterSetCode': 'UTF-8',
                                '@encodingCode': 'Base64',
                                '@mimeCode': 'application/xml',
                                '@filename': uuid + '.xslt',
                                '#text': base64encoded
                            }
                        }
                    }
                }
                resolve(object);

            } catch (err) {
                reject(err)
            }

        })
        .catch(err => {
            reject(err);
        })
    })
    
}