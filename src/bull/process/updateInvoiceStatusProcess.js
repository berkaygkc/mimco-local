const db = require('../../sqlite/sqlite-db');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const updateInvoiceStatusProcess = async (job, done) => {
    const invId = job.data.invId;
    const statusCode = job.data.statusCode;
    const errDetail = job.data.errDetail;
    let statusDetail = {};
    switch(statusCode) {
        case 100:
            statusDetail['status'] = true;
            statusDetail['description'] = 'Belge gönderilmek için sıraya alındı!';
            statusDetail['description_detail'] = '';
            break;
        case 101:
            statusDetail['status'] = false;
            statusDetail['description'] = 'Belge gönderilirken hata aldı!';
            statusDetail['description_detail'] = errDetail;
            break;
        case 102:
            statusDetail['status'] = false;
            statusDetail['description'] = 'Belge gönderildikten sonra hata aldı!';
            statusDetail['description_detail'] = errDetail;
            break;
        case 103:
            statusDetail['status'] = true;
            statusDetail['description'] = 'Belge başarıyla gönderildi! Sistem tarafından işlenmesi bekleniyor!';
            statusDetail['description_detail'] = '';
            break;
        case 105:
            statusDetail['status'] = true;
            statusDetail['description'] = 'Belge başarıyla gönderildi! Sistem tarafından başarıyla işlendi!';
            statusDetail['description_detail'] = '';
            break;
        default:
            statusDetail['status'] = false;
            statusDetail['description'] = 'Belgenin durumu bilinmiyor';
            statusDetail['description_detail'] = errDetail;
            break;
    }
    console.log('statusdetail : ', statusDetail)
    //db.insert('update invoices set is_sended = 1, status_code = ?, status_description = ? where id = ?', [statusCode, JSON.stringify(statusDetail), invId])
    prisma.invoices.update({
        where:{
            id: Number(invId)
        },
        data:{
            is_sended: true,
            status_code: statusCode,
            status_description: JSON.stringify(statusDetail)
        }
    })
    .then(result => {
        done(null, result);
    })
    .catch(err => {
        done(new Error(err));
    })
}

module.exports = updateInvoiceStatusProcess;