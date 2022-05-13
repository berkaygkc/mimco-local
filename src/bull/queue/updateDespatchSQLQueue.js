const Queue = require('bull');
const config = require('config');
const updateDespatchSQLProcess = require('../process/updateDespatchSQLProcess');

const updateDespatchSQLQueue = new Queue('updateDespatchSQL', {
    redis: config.get('redis.url')
});

updateDespatchSQLQueue.process(updateDespatchSQLProcess);

const updateDespatchSQL = ( (data) => {
    updateDespatchSQLQueue.add({data}, {
        attempts:1,
        delay:30000
    })
})

updateDespatchSQLQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    updateDespatchSQL,
    updateDespatchSQLQueue
}