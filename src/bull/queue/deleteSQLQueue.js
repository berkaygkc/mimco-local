const Queue = require('bull');
const config = require('config');
const deleteSQLProcess = require('../process/deleteSQLProcess');

const deleteSQLQueue = new Queue('deleteSQL', {
    redis: config.get('redis.url')
});

deleteSQLQueue.process(deleteSQLProcess);

const deleteSQL = ( (data) => {
    deleteSQLQueue.add({data}, {
        attempts:1
    })
})

deleteSQLQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    deleteSQL,
    deleteSQLQueue
}