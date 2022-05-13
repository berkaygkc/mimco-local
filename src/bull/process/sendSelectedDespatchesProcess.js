const {sendDespatch} = require('../queue/sendDespatchQueue');

const sendSelectedDespatchesProcess = async (job, done) => {
    try {
        const list = job.data.list;
        for await  (data of list) {
            sendDespatch(data);
        }
        done(null)
    }
    catch (err) {
        done(new Error(err));
    }
}

module.exports = sendSelectedDespatchesProcess;