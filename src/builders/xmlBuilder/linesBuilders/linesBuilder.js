const taxBuilder = require('../headerBuilders/taxesBuilder');
const allowanceBuilder = require('./allowanceBuilder');
const deliveryBuilder = require('./deliveryBuilder');
const withholdingTaxesBuilder = require('../headerBuilders/withholdingTaxesBuilder');

module.exports = (lines, CurrencyCode) => {
    return new Promise(async (resolve, reject) => {

        try {
            let linesArray = [];
            let lineIndex = 1 ;
            for await (line of lines) {

                const deliveryData = await deliveryBuilder(line);
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

                let withholdingTaxesObject = '';
                let withholdingTaxesData = '';
                if('TaxAmount' in line.WithholdingTaxes){
                    withholdingTaxesObject = await withholdingTaxesBuilder(line.WithholdingTaxes);
                    withholdingTaxesData = {
                        'cac:WithholdingTaxTotal': {
                            'cbc:TaxAmount': {
                                '@currencyID': CurrencyCode,
                                '#text' : Math.round(line.WithholdingTaxAmount * 100) / 100 
                            },
                            ...withholdingTaxesObject
                        }
                    } 
                }
                let sellerObject = ''
                if('SellerCode' in line) {
                    if(line.SellerCode != '' && line.SellerCode != null && line.SellerCode != undefined ) {
                        sellerObject = {
                            'cac:SellersItemIdentification': {
                                'cbc:ID': line.SellerCode
                            }
                        }
                    }
                }
                let buyerObject = ''
                if('BuyerCode' in line) {
                    if(line.BuyerCode != '' && line.BuyerCode != null && line.BuyerCode != undefined ) {
                        buyerObject = {
                            'cac:BuyersItemIdentification': {
                                'cbc:ID': line.BuyerCode
                            }
                        }
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
                    ...deliveryData,
                    ...allowanceData,
                    ...taxTotal,
                    ...withholdingTaxesData,
                    'cac:Item': {
                        'cbc:Name':line.Name,
                        ...buyerObject,
                        ...sellerObject
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