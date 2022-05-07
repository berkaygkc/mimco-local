const builders = require('../../builders/index');
const db = require('../../sqlite/sqlite-db');
const fs = require('fs');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const deleteSQLProcess = async (job, done) => {
    const erpId = job.data.data;
    //db.query('select * from invoices where erpId = ?', [erpId])
    prisma.invoices.findFirst({
        where:{
            erpId: erpId
        }
    })
    .then(result => {
        const data = result;
        if(result){
            if(result.is_sended && (result.status_code == 100 || result.status_code == 103 || result.status_code == 105)) {
                done(null, {erpId, message: 'Gönderilmiş fatura!'});
            } else {
                //db.insert('delete from invoices where erpId = ?', [erpId])
                prisma.invoices.delete({
                    where:{
                        erpId: erpId
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
            done(null, {note: 'Fatura bulunamıyor!' ,result});
        }
        
    })
    .catch(err => {
        done(new Error(err));
    })
   
}

module.exports = deleteSQLProcess;