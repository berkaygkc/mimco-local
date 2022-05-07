module.exports = {
    sendInvoice: require('./sendEInvoice'),
    checkStatus: require('./checkEInvoiceStatus'),
    exportInvoice: require('./exportEInvoice'),
    exportInvoiceOld: require('./exportEInvoiceOld'),
    markInvoice: require('./mark'),
    accept: require('./acceptInvoice'),
    reject: require('./rejectInvoice')
}