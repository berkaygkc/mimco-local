const Queue = require('bull');
const config = require('config');
const updateRecordProcess = require('../process/updateRecordProcess');

const updateRecordQueue = new Queue('updateRecord', {
    redis: config.get('redis.url')
});

updateRecordQueue.process(updateRecordProcess);

const updateRecord = ( (data) => {
    updateRecordQueue.add({data}, {
        attempts:1
    })
})

updateRecordQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    updateRecordQueue,
    updateRecord
}