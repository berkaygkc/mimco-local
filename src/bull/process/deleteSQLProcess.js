const builders = require('../../builders/index');
const db = require('../../sqlite/sqlite-db');
const fs = require('fs');

const deleteSQLProcess = async (job, done) => {
    const erpId = job.data.data;
    db.query('select * from invoices where erpId = ?', [erpId])
    .then(result => {
        const data = result;
        if(result[0]){
            if(result[0].is_sended && (result[0].status_code == 100 || result[0].status_code == 103 || result[0].status_code == 105)) {
                done(null, {erpId, message: 'Gönderilmiş fatura!'});
            } else {
                db
                .insert('delete from invoices where erpId = ?', [erpId])
                .then(res => {
                    try{
                        if(data[0].xml_path) {
                            fs.unlinkSync(data[0].xml_path, (err) => {
                                console.log(err);
                            })
                        }
                        fs.unlinkSync(data[0].json, (err) => {
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
            done(null, {note: 'fatura bulunmuyor!' ,result});
        }
        
    })
    .catch(err => {
        done(new Error(err));
    })
   
}

module.exports = deleteSQLProcess;