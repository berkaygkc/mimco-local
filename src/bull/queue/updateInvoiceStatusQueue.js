const Queue = require('bull');
const config = require('config');
const updateInvoiceStatusProcess = require('../process/updateInvoiceStatusProcess');

const updateInvoiceStatusQueue = new Queue('updateInvoiceStatus', {
    redis: config.get('redis.url')
});

updateInvoiceStatusQueue.process(updateInvoiceStatusProcess);

const updateInvoiceStatus = ( (invId, statusCode, errDetail) => {
    updateInvoiceStatusQueue.add({invId, statusCode, errDetail}, {
        attempts:1
    })
})

updateInvoiceStatusQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    updateInvoiceStatus,
    updateInvoiceStatusQueue
}