const Queue = require('bull');
const config = require('config');
const sendInvoiceProcess = require('../process/sendInvoiceProcess');

const sendInvoiceQueue = new Queue('sendInvoice', {
    redis: config.get('redis.url')
});

sendInvoiceQueue.process(sendInvoiceProcess);

const sendInvoice = ( (invId) => {
    sendInvoiceQueue.add({invId}, {
        attempts:1
    })
})

sendInvoiceQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    sendInvoice,
    sendInvoiceQueue
}