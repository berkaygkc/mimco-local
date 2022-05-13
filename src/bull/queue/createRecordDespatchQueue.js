const Queue = require('bull');
const config = require('config');
const createRecordDespatchProcess = require('../process/createRecordDespatchProcess');

const createRecordDespatchQueue = new Queue('createRecordDespatch', {
    redis: config.get('redis.url')
});

createRecordDespatchQueue.process(createRecordDespatchProcess);

const createRecordDespatch = ( (data) => {
    createRecordDespatchQueue.add({data}, {
        attempts:1
    })
})

createRecordDespatchQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    createRecordDespatchQueue,
    createRecordDespatch
}