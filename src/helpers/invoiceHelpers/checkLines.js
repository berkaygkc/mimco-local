const {
    PrismaClient
} = require('@prisma/client');
const LinesBuilder = require('../../builders/jsonBuilder/subBuilders/linesBuilder/linesBuilder');

const prisma = new PrismaClient();
const fs = require('fs');

function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
    return true;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}

module.exports = (invId) => {
    return new Promise((resolve, reject) => {
        prisma.invoices.findFirst({
                where: {
                    id: Number(invId)
                }
            })
            .then(async (result) => {
                if (result) {
                    let json = await fs.readFileSync(result.json_path, 'utf-8');
                    json = JSON.parse(json);
                    if (json) {
                        const jsonLines = json.InvoiceLines;
                        const dbLines = await LinesBuilder(result.erpId);
                        console.log(jsonLines, dbLines);
                        if (deepEqual(jsonLines, dbLines)) {
                            resolve({
                                status: true
                            });
                        } else {
                            resolve({
                                status: false,
                                message: 'Kalemler Muhasebe Yazılımından farklılık gösteriyor! Göndermek istediğinize emin misiniz?'
                            })
                        }
                    } else {
                        reject('JSON bulunmuyor!')
                    }
                } else {
                    reject('Fatura bulunamadı!')
                }
            })
            .catch(err => {
                console.log(err);
                reject(err)
            })
    })
}