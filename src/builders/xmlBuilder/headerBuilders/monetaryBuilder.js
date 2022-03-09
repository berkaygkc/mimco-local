module.exports = (monetary) => {
    return new Promise(async (resolve, reject) => {
        try {
            let monetaryBody = {
                'cbc:LineExtensionAmount': {
                    '@currencyID': monetary.CurrencyCode,
                    '#text': Math.round(monetary.LineExtensionAmount * 100) / 100
                },
                'cbc:TaxExclusiveAmount': {
                    '@currencyID': monetary.CurrencyCode,
                    '#text': Math.round(monetary.TaxExclusiveAmount * 100) / 100
                },
                'cbc:TaxInclusiveAmount': {
                    '@currencyID': monetary.CurrencyCode,
                    '#text': Math.round(monetary.TaxInclusiveAmount * 100) / 100
                },
                'cbc:AllowanceTotalAmount': {
                    '@currencyID': monetary.CurrencyCode,
                    '#text': Math.round(monetary.AllowanceChargeAmount * 100) / 100
                },
                'cbc:PayableAmount': {
                    '@currencyID': monetary.CurrencyCode,
                    '#text': Math.round(monetary.PayableAmount * 100) / 100
                }
            }

            const monetaryObject = {
                'cac:LegalMonetaryTotal': monetaryBody
            }

            resolve(monetaryObject);

        } catch (err) {
            reject(err);
        }
    })
}