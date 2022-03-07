const taxBuilder = require('../headerBuilders/taxesBuilder');

module.exports = (lines, CurrencyCode) => {
    return new Promise(async (resolve, reject) => {

        try {
            let linesArray = [];
            for await (line of lines) {

                const taxesTotal = await taxBuilder(line.Taxes);
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
                    'cbc:InvoicedQuantity' : {
                        '@unitCode': line.UnitCode,
                        '#text': line.Quantity
                    },
                    'cbc:LineExtensionAmount': {
                        '@currencyID': CurrencyCode,
                        '#text': line.Price * line.Quantity
                    },
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