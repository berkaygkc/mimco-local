const builders = require('../../builders/index');
const db = require('../../sqlite/sqlite-db');
const fs = require('fs');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const deleteDespatchSQLProcess = async (job, done) => {
    const erpId = job.data.data;
    prisma.despatches.findFirst({
        where:{
            erpId: String(erpId)
        }
    })
    .then(result => {
        const data = result;
        if(result){
            if(result.is_sended && (result.status_code == 100 || result.status_code == 103 || result.status_code == 105)) {
                done(null, {erpId, message: 'Gönderilmiş irsaliye!'});
            } else {
                prisma.despatches.delete({
                    where:{
                        erpId: String(erpId)
                    }
                })
                .then(res => {
                    try{
                        if(data.xml_path) {
                            fs.unlinkSync(data.xml_path, (err) => {
                                console.log(err);
                            })
                        }
                        fs.unlinkSync(data.json_path, (err) => {
                            console.log(err);
                        })
                        done(null, 'Başarıyla silindi!')
                    }
                    catch (e) {
                        done(new Error(e));
                    }
                })
                .catch(err => {
                    done(new Error(err));
                })
            }
        } else {
            done(null, {note: 'İrsaliye bulunamıyor!' ,result});
        }
        
    })
    .catch(err => {
        done(new Error(err));
    })
   
}

module.exports = deleteDespatchSQLProcess;