

module.exports = allowanceBuilder = async (line) => {
    if (line.Allowances&& line.Allowances.length > 0) {
        const jsonArr = [];
        for await (allowance of line.Allowances) {
            if (allowance.Amount > 0) {
                jsonArr.push({
                    'cbc:ChargeIndicator': false,
                    'cbc:MultiplierFactorNumeric': (Math.round(allowance.Percentage * 100) / 100) / 100,
                    'cbc:Amount' : {
                        '@currencyID': allowance.CurrencyCode,
                        '#text': Math.round(allowance.Amount * 100) / 100,
                    },
                    'cbc:BaseAmount' : {
                        '@currencyID': allowance.CurrencyCode,
                        '#text': Math.round(allowance.BaseAmount * 100) / 100,
                    }
                });
            }
        }

        const object = {
            'cac:AllowanceCharge': jsonArr
        }

        if (jsonArr.length > 0) {
            return object;
        } else return '';

    } else return '';

}