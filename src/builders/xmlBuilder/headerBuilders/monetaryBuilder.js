module.exports = (monetary) => {
    return new Promise(async (resolve, reject) => {
        try {
            let monetaryBody = {
                'cbc:TaxExclusiveAmount': {
                    '@currencyID': monetary.CurrenyCode,
                    '#text': monetary.TaxExclusiveAmount
                },
                'cbc:TaxInclusiveAmount': {
                    '@currencyID': monetary.CurrenyCode,
                    '#text': monetary.TaxInclusiveAmount
                },
                'cbc:AllowanceTotalAmount': {
                    '@currencyID': monetary.CurrenyCode,
                    '#text': monetary.AllowanceChargeAmount
                },
                'cbc:PayableAmount': {
                    '@currencyID': monetary.CurrenyCode,
                    '#text': monetary.PayableAmount
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