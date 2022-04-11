module.exports = exchangeRateBuilder = async (data) => {
    if (data.CurrencyCode != 'TRY') {
        const object = {
            'cac:PricingExchangeRate': {
                'cbc:SourceCurrencyCode': data.CurrencyCode,
                'cbc:TargetCurrencyCode': 'TRY',
                'cbc:CalculationRate': data.ExchangeRate
            }
        }
        return object;
    } else return ''
}