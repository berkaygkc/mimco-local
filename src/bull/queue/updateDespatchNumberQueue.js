const Queue = require('bull');
const config = require('config');
const updateDespatchNumberProcess = require('../process/updateDespatchNumberProcess');

const updateDespatchNumberQueue = new Queue('updateDespatchNumber', {
    redis: config.get('redis.url')
});

updateDespatchNumberQueue.process(updateDespatchNumberProcess);

const updateDespatchNumber = ( (data) => {
    updateDespatchNumberQueue.add({data}, {
        attempts:1,
        delay:5000
    })
})

updateDespatchNumberQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    updateDespatchNumber,
    updateDespatchNumberQueue
}