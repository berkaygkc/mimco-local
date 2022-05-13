const builders = require('./despatchesBuilder/index');

const buildInvoiceObject = (erpId) => {
    return new Promise(async (resolve, reject) => {
        const bodyObject = await builders.bodyBuilder(erpId)
            .catch(err => {
                if (!err.status) {
                    reject(err);
                }
            });
        const Parties = await builders.partiesBuilder(erpId).catch(err => {
            console.log('parties builder error : ', err)
            reject(err);
        });
        const DespatchLines = await builders.linesBuilder(erpId).catch(err => {
            console.log('lines builder error : ', err)
            reject(err);
        });
        const Shipment = await builders.shipmentBuilder(erpId).catch(err => {
            console.log('shipment builer error : ', err)
            reject(err);
        });

        const object = {
            ...bodyObject,
            Parties,
            DespatchLines,
            Shipment
        }
        resolve(object);
    })
}

module.exports = buildInvoiceObject;