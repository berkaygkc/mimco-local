const Queue = require('bull');
const config = require('config');
const sendSelectedInvoicesProcess = require('../process/sendSelectedInvoicesProcess');

const sendSelectedInvoicesQueue = new Queue('sendSelectedInvoices', {
    redis: config.get('redis.url')
});

sendSelectedInvoicesQueue.process(sendSelectedInvoicesProcess);

const sendSelectedInvoices = ( (list) => {
    sendSelectedInvoicesQueue.add({list}, {
        attempts:1
    })
})

sendSelectedInvoicesQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    sendSelectedInvoices,
    sendSelectedInvoicesQueue
}