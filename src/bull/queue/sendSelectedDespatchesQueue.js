const Queue = require('bull');
const config = require('config');
const sendSelectedDespatchesProcess = require('../process/sendSelectedDespatchesProcess');

const sendSelectedDespatchesQueue = new Queue('sendSelectedDespatches', {
    redis: config.get('redis.url')
});

sendSelectedDespatchesQueue.process(sendSelectedDespatchesProcess);

const sendSelectedDespatches = ( (list) => {
    sendSelectedDespatchesQueue.add({list}, {
        attempts:1
    })
})

sendSelectedDespatchesQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    sendSelectedDespatches,
    sendSelectedDespatchesQueue
}