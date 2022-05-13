const Queue = require('bull');
const config = require('config');
const sendDespatchProcess = require('../process/sendDespatchProcess');

const sendDespatchQueue = new Queue('sendDespatch', {
    redis: config.get('redis.url')
});

sendDespatchQueue.process(sendDespatchProcess);

const sendDespatch = ( (dspId) => {
    sendDespatchQueue.add({dspId}, {
        attempts:1
    })
})

sendDespatchQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    sendDespatch,
    sendDespatchQueue
}