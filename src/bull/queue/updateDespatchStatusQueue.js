const Queue = require('bull');
const config = require('config');
const updateDespatchStatusProcess = require('../process/updateDespatchStatusProcess');

const updateDespatchStatusQueue = new Queue('updateDespatchStatus', {
    redis: config.get('redis.url')
});

updateDespatchStatusQueue.process(updateDespatchStatusProcess);

const updateDespatchStatus = ( (dspId, statusCode, errDetail) => {
    updateDespatchStatusQueue.add({dspId, statusCode, errDetail}, {
        attempts:1
    })
})

updateDespatchStatusQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    updateDespatchStatus,
    updateDespatchStatusQueue
}