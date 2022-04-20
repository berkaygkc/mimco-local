const {
    ToWords
} = require('to-words');

module.exports = notesBuilder = async (data) => {

    const toWords = new ToWords({
        localeCode: 'tr-TR',
        converterOptions: {
            currency: true,
        }

    });
    console.log(data.Monetary.PayableAmount.toFixed(2));
    console.log(toWords.convert(data.Monetary.PayableAmount.toFixed(2)))
    const textAmount = 'YALNIZ : ' + toWords.convert(data.Monetary.PayableAmount.toFixed(2)).toLocaleUpperCase() + ' ' + data.Monetary.CurrencyCode;
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