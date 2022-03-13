const Queue = require('bull');
const config = require('config');
const updateSQLProcess = require('../process/updateSQLProcess');

const updateSQLQueue = new Queue('updateSQL', {
    redis: config.get('redis.url')
});

updateSQLQueue.process(updateSQLProcess);

const updateSQL = ( (data) => {
    updateSQLQueue.add({data}, {
        attempts:1
    })
})

updateSQLQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    updateSQL,
    updateSQLQueue
}