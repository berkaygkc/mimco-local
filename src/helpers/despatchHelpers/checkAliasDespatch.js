const getAliases = require('../../entegrator/mimsoft/Aliases/getAliasesDespatch');
const resolveToken = require('../../middlewares/mimsoft/resolveToken');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = (json) => {
    return new Promise(async (resolve, reject) => {
        let object;
        const tax_number = json.Parties[0].Identities[0].Value;
        const token = await resolveToken();
        getAliases(tax_number, token)
            .then(async (result) => {
                if (result.status == 200) {
                    object = {
                        alias: result.alias,
                    }
                } else {
                    object = {
                        alias: null,
                    }
                }
                json['Alias'] = object.alias;
                json['SystemInvTypeCode'] = 3;
                const xsltObject = await prisma.documentTemplates.findFirst({
                    where: {
                        type: 3,
                        default: true
                    }
                });
                json['XSLTCode'] = xsltObject.id;
                const serieObject = await prisma.documentSeries.findFirst({
                    where: {
                        type: 3,
                        default: true
                    }
                });
                json['DocumentSerieCode'] = serieObject.id;
                console.log(json);
                resolve(json);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
    })
}