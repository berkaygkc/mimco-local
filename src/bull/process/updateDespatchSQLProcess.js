const builders = require('../../builders/index');
const {
    updateDespatchRecord
} = require('../queue/updateDespatchRecordQueue');
const db = require('../../sqlite/sqlite-db');
const {
    createRecordDespatch
} = require('../queue/createRecordDespatchQueue');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const updateDespatchSQLProcess = async (job, done) => {
    const erpId = job.data.data;
    prisma.despatches.findFirst({
            where: {
                erpId: String(erpId)
            }
        })
        .then(result => {
            if (result) {
                if (result.is_sended && (result.status_code == 100 || result.status_code == 103 || result.status_code == 105)) {
                    done(null, {
                        erpId,
                        message: 'Gönderilmiş irsaliye!'
                    });
                } else {
                    builders.despatchJSONBuilder(erpId)
                        .then(result => {
                            updateDespatchRecord(result);
                            done(null, {
                                note: 'updated',
                                result
                            });
                        })
                        .catch(err => {
                            done(new Error(err));
                        })
                }
            } else {
                builders.despatchJSONBuilder(erpId)
                    .then(result => {
                        createRecordDespatch(result);
                        done(null, {
                            note: 'created',
                            result
                        });
                    })
                    .catch(err => {
                        done(new Error(JSON.stringify(err)));
                    })
            }

        })
        .catch(err => {
            done(new Error(err));
        })

}

module.exports = updateDespatchSQLProcess;