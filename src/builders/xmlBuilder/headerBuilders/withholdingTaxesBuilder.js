module.exports = (withholdingTax) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(withholdingTax.TaxAmount){
                const taxObject = {
                    'cac:TaxSubtotal': {
                        'cbc:TaxableAmount': {
                            '@currencyID': withholdingTax.CurrencyCode,
                            '#text': Math.round(withholdingTax.TaxableAmount * 100) / 100
                        },
                        'cbc:TaxAmount': {
                            '@currencyID': withholdingTax.CurrencyCode,
                            '#text': Math.round(withholdingTax.TaxAmount * 100) / 100
                        },
                        'cbc:Percent': withholdingTax.TaxPercent,
                        'cac:TaxCategory': {
                            'cac:TaxScheme': {
                                'cbc:Name': withholdingTax.TaxCode,
                                'cbc:TaxTypeCode': withholdingTax.TaxCode
                            }
                        }
                    }
                }
                resolve(taxObject);
            } else {
                resolve('')
            }
        } catch (err) {
            reject(err);
        }
    })
}