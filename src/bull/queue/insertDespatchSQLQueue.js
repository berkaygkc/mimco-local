const Queue = require('bull');
const config = require('config');
const insertDespatchSQLProcess = require('../process/insertDespatchSQLProcess');

const insertDespatchSQLQueue = new Queue('insertDespatchSQL', {
    redis: config.get('redis.url')
});

insertDespatchSQLQueue.process(insertDespatchSQLProcess);

const insertDespatchSQL = ( (data) => {
    insertDespatchSQLQueue.add({data}, {
        attempts:1,
        delay:30000
    })
})

insertDespatchSQLQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    insertDespatchSQL,
    insertDespatchSQLQueue
}