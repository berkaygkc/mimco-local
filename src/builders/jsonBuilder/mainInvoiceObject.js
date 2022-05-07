const builders = require('./subBuilders/index');

const buildInvoiceObject = (erpId) => {
    return new Promise (async (resolve, reject) => {
        const bodyObject = await builders.bodyBuilder(erpId)
        .catch(err => {
            if(!err.status) {
                reject(err);
            }
        });
        const Parties = await builders.partiesBuilder(erpId).catch(err => console.log('parties builder error : ',err));
        const InvoiceLines = await builders.linesBuilder(erpId).catch(err => console.log('lines builder error : ',err));

        const object = {
            ...bodyObject,
            Parties,
            InvoiceLines
        }
        resolve(object);
    })
}

module.exports = buildInvoiceObject;