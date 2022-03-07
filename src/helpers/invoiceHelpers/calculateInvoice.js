

const calculateJsonInvoice = (json) => {
    return new Promise (async (resolve, reject) => {
        try {
            const currenyCode = json.CurrencyCode;
            const lines = json.InvoiceLines;
            let invoiceTaxAmount = 0;
            let invoiceTaxableAmount = 0;
        
            let taxExemptionReasonCode = 0;
            let kdv1Amount = 0;
            let kdv8Amount = 0;
            let kdv18Amount = 0;
        
            let kdv0TaxableAmount = 0;
            let kdv1TaxableAmount = 0;
            let kdv8TaxableAmount = 0;
            let kdv18TaxableAmount = 0;
        
            for await(line of lines) {
                invoiceTaxAmount += line.TaxAmount;
                for await (tax of line.Taxes) {
                    invoiceTaxableAmount += tax.TaxableAmount;
                    if(tax.TaxPercent == 0) {
                        kdv0TaxableAmount += tax.TaxableAmount;
                        taxExemptionReasonCode = tax.TaxExemptionReasonCode;
                    } else if (tax.TaxPercent == 1) {
                        kdv1Amount += tax.TaxAmount;
                        kdv1TaxableAmount += tax.TaxableAmount;
                    } else if (tax.TaxPercent == 8) {
                        kdv8Amount += tax.TaxAmount;
                        kdv8TaxableAmount += tax.TaxableAmount;
                    } else if (tax.TaxPercent == 18) {
                        kdv18Amount += tax.TaxAmount;
                        kdv18TaxableAmount += tax.TaxableAmount;
                    }
                }
            }

            let invoiceTaxArray = [];
            if(kdv0TaxableAmount > 0) {
                invoiceTaxArray.push({
                    'TaxableAmount': kdv0TaxableAmount,
                    'TaxAmount' : 0,
                    'TaxPercent': 0,
                    'TaxCode' : '0015',
                    'TaxExemptionReasonCode': taxExemptionReasonCode,
                    'CurrenyCode': currenyCode
                })
            }

            if(kdv1TaxableAmount > 0) {
                invoiceTaxArray.push({
                    'TaxableAmount': kdv1TaxableAmount,
                    'TaxAmount' : kdv1Amount,
                    'TaxPercent': 1,
                    'TaxCode' : '0015',
                    'CurrenyCode': currenyCode
                })
            }

            if(kdv8TaxableAmount > 0) {
                invoiceTaxArray.push({
                    'TaxableAmount': kdv8TaxableAmount,
                    'TaxAmount' : kdv8Amount,
                    'TaxPercent': 8,
                    'TaxCode' : '0015',
                    'CurrenyCode': currenyCode
                })
            }

            if(kdv18TaxableAmount > 0) {
                invoiceTaxArray.push({
                    'TaxableAmount': kdv18TaxableAmount,
                    'TaxAmount' : kdv18Amount,
                    'TaxPercent': 18,
                    'TaxCode' : '0015',
                    'CurrenyCode': currenyCode
                })
            }

            json['Taxes'] = invoiceTaxArray;

            monetary = {
                TaxExclusiveAmount: invoiceTaxableAmount,
                TaxInclusiveAmount: invoiceTaxAmount+invoiceTaxableAmount,
                AllowanceChargeAmount: 0,
                PayableAmount: invoiceTaxAmount+invoiceTaxableAmount,
                CurrenyCode: currenyCode
            }

            json['Monetary'] = monetary;

            resolve(json);
        } catch (err) {
            reject(err);
        }
    })
}

module.exports = calculateJsonInvoice;