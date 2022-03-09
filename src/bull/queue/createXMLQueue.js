const Queue = require('bull');
const config = require('config');
const createXMLProcess = require('../process/createXMLProcess');

const createXMLQueue = new Queue('createXML', {
    redis: config.get('redis.url')
});

createXMLQueue.process(createXMLProcess);

const createXML = ( (data, uuid, erpId) => {
    createXMLQueue.add({data, uuid, erpId}, {
        attempts:1
    })
})

createXMLQueue.on('error', err => {
    console.log(err);
})

module.exports = {
    createXMLQueue,
    createXML
}