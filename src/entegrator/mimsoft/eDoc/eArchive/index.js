module.exports = {
    sendInvoice: require('./sendEArchive'),
    checkStatus: require('./checkEArchiveStatus'),
    exportInvoice: require('./exportEArchive'),
    exportInvoiceOld: require('./exportEArchiveOld'),
    markInvoice: require('./mark'),
    cancel: require('./cancelInvoice'),
    getDetails: require('./getDetails')
}