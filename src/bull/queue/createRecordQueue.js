const Queue = require('bull');
const config = require('config');
const createRecordProcess = require('../process/createRecordProcess');

const createRecordQueue = new Queue('createRecord', {
    redis: config.get('redis.url')
});

createRecordQueue.process(createRecordProcess);

const createRecord = ( (data) => {
    createRecordQueue.add({data}, {
        attempts:1
    })
})

createRecordQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    createRecordQueue,
    createRecord
}