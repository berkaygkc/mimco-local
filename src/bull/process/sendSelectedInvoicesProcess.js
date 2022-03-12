const {sendInvoice} = require('../queue/sendInvoiceQueue');

const sendSelectedInvoicesProcess = async (job, done) => {
    try {
        const list = job.data.list;
        for await  (data of list) {
            sendInvoice(data);
        }
        done(null)
    }
    catch (err) {
        done(new Error(err));
    }
}

module.exports = sendSelectedInvoicesProcess;