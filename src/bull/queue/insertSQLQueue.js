const Queue = require('bull');
const config = require('config');
const insertSQLProcess = require('../process/insertSQLProcess');

const insertSQLQueue = new Queue('insertSQL', {
    redis: config.get('redis.url')
});

insertSQLQueue.process(insertSQLProcess);

const insertSQL = ( (data) => {
    insertSQLQueue.add({data}, {
        attempts:1,
        delay:5000
    })
})

insertSQLQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    insertSQL,
    insertSQLQueue
}