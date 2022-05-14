const Queue = require('bull');
const config = require('config');
const deleteDespatchSQLProcess = require('../process/deleteDespatchSQLProcess');

const deleteDespatchSQLQueue = new Queue('deleteDespatchSQL', {
    redis: config.get('redis.url')
});

deleteDespatchSQLQueue.process(deleteDespatchSQLProcess);

const deleteDespatchSQL = ( (data) => {
    deleteDespatchSQLQueue.add({data}, {
        attempts:1
    })
})

deleteDespatchSQLQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    deleteDespatchSQL,
    deleteDespatchSQLQueue
}