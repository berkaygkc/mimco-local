module.exports = {
    sendDespatch: require('./sendDespatch'),
    checkStatus: require('./checkEDespatchStatus'),
    exportInvoice: require('./exportEInvoice'),
    exportInvoiceOld: require('./exportEInvoiceOld'),
    markInvoice: require('./mark'),
    accept: require('./acceptInvoice'),
    reject: require('./rejectInvoice')
}