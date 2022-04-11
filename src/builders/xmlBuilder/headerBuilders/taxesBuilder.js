

module.exports = (taxes) => {
    return new Promise(async (resolve, reject) => {
        try {
            let taxArray = [];
            for await (tax of taxes) {
                let taxObject = {
                    'cbc:TaxableAmount':{
                        '@currencyID': tax.CurrencyCode,
                        '#text': Math.round(tax.TaxableAmount * 100) / 100 
                    },
                    'cbc:TaxAmount':{
                        '@currencyID': tax.CurrencyCode,
                        '#text': Math.round(tax.TaxAmount * 100) / 100 
                    },
                    'cbc:Percent': tax.TaxPercent,
                }
                if (tax.TaxExemptionReasonCode) {
                    taxObject['cac:TaxCategory'] = {
                        'cbc:TaxExemptionReasonCode': tax.TaxExemptionReasonCode,
                        'cbc:TaxExemptionReason': tax.TaxExemptionReasonCode,
                        'cac:TaxScheme':{
                            'cbc:Name':'KDV',
                            'cbc:TaxTypeCode':tax.TaxCode
                        }
                    }
                } else {
                    taxObject['cac:TaxCategory'] = {
                        'cac:TaxScheme':{
                            'cbc:Name':'KDV',
                            'cbc:TaxTypeCode':tax.TaxCode
                        }
                    }
                }
                taxArray.push(taxObject)
            }
            const taxesObject = {
                'cac:TaxSubtotal': taxArray
            }
            resolve(taxesObject);
        }
        catch(err) {
            reject(err);
        }
    })
}