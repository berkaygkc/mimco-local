const builders = require('./subBuilders/index');

const buildInvoiceObject = (erpId) => {
    return new Promise (async (resolve, reject) => {
        const bodyObject = await builders.bodyBuilder(erpId).catch(err => console.log(err));
        const despatchesObject = builders.despatchesBuilder(erpId);
        const Parties = await builders.partiesBuilder(erpId);

        const object = {
            ...bodyObject,
            ...despatchesObject,
            Parties,
        }
        resolve(object);
    })
}

module.exports = buildInvoiceObject;