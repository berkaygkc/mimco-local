const taxBuilder = require('../headerBuilders/taxesBuilder');
const allowanceBuilder = require('./allowanceBuilder');

module.exports = (lines, CurrencyCode) => {
    return new Promise(async (resolve, reject) => {

        try {
            let linesArray = [];
            let lineIndex = 1 ;
            for await (line of lines) {

                const taxesTotal = await taxBuilder(line.Taxes);
                const allowanceData = await allowanceBuilder(line);
                const taxTotal = {
                    'cac:TaxTotal': {
                        'cbc:TaxAmount': {
                            '@currencyID': CurrencyCode,
                            '#text': line.TaxAmount
                        },
                        ...taxesTotal
                    }
                }

                let lineObject = {
                    'cbc:ID': lineIndex,
                    'cbc:InvoicedQuantity' : {
                        '@unitCode': line.UnitCode,
                        '#text': line.Quantity
                    },
                    'cbc:LineExtensionAmount': {
                        '@currencyID': CurrencyCode,
                        '#text': line.Price * line.Quantity
                    },
                    ...allowanceData,
                    ...taxTotal,
                    'cac:Item': {
                        'cbc:Name':line.Name
                    },
                    'cac:Price': {
                        'cbc:PriceAmount': {
                            '@currencyID': CurrencyCode,
                            '#text': line.Price
                        }
                    }
                }
                linesArray.push(lineObject)

                lineIndex += 1;
            }
            const linesObject = {
                'cac:InvoiceLine': linesArray
            }
            resolve(linesObject);
        } catch (err) {
            reject(err);
        }


    })
}