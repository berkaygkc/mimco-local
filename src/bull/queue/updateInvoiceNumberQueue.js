const Queue = require('bull');
const config = require('config');
const updateInvoiceNumberProcess = require('../process/updateInvoiceNumberProcess');

const updateInvoiceNumberQueue = new Queue('updateInvoiceNumber', {
    redis: config.get('redis.url')
});

updateInvoiceNumberQueue.process(updateInvoiceNumberProcess);

const updateInvoiceNumber = ( (data) => {
    updateInvoiceNumberQueue.add({data}, {
        attempts:1,
        delay:5000
    })
})

updateInvoiceNumberQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    updateInvoiceNumber,
    updateInvoiceNumberQueue
}