const Queue = require('bull');
const config = require('config');
const updateDespatchRecordProcess = require('../process/updateDespatchRecordProcess');

const updateDespatchRecordQueue = new Queue('updateDespatchRecord', {
    redis: config.get('redis.url')
});

updateDespatchRecordQueue.process(updateDespatchRecordProcess);

const updateDespatchRecord = ( (data) => {
    updateDespatchRecordQueue.add({data}, {
        attempts:1
    })
})

updateDespatchRecordQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    updateDespatchRecordQueue,
    updateDespatchRecord
}