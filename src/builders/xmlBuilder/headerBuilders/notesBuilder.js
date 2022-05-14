const {
    ToWords
} = require('to-words');

module.exports = notesBuilder = async (data) => {

    const toWords = new ToWords({
        localeCode: 'tr-TR',
        converterOptions: {
            currency: false,
        }

    });
    console.log(data.Monetary.PayableAmount.toFixed(2));
    let bigOne = '';
    let littleOne = '';
    const bigValue = data.Monetary.PayableAmount.toFixed(2).split('.')[0];
    const littleValue = data.Monetary.PayableAmount.toFixed(2).split('.')[1];
    if(data.Monetary.CurrencyCode == 'TRY') {
        bigOne = 'LİRA';
        littleOne = 'KURUŞ';
    } else if(data.Monetary.CurrencyCode == 'EUR') {
        bigOne = 'EURO';
        littleOne = 'SENT';
    } else if(data.Monetary.CurrencyCode == 'USD') {
        bigOne = 'DOLAR';
        littleOne = 'SENT';
    }
    console.log(toWords.convert(bigValue), bigOne, toWords.convert(littleValue), littleOne);
    const textAmount = `YALNIZ: ${toWords.convert(bigValue).toLocaleUpperCase()} ${bigOne}, ${toWords.convert(littleValue).toLocaleUpperCase()} ${littleOne} `;
    const jsonArr = [];
    jsonArr.push({
        '#text': textAmount
    });

    if (data.Notes && data.Notes.length > 0) {
        for await (note of data.Notes) {
            if (note.Note) {
                jsonArr.push({
                    '#text': note.Note
                });
            }
        }
    }

    const object = {
        'cbc:Note': jsonArr
    }

    if (jsonArr.length > 0) {
        return object;
    } else return '';


}