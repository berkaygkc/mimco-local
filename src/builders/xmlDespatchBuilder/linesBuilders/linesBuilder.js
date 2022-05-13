module.exports = (lines) => {
    return new Promise(async (resolve, reject) => {

        try {
            let linesArray = [];
            let lineIndex = 1;
            for await (line of lines) {
                let lineObject = {
                    'cbc:ID': lineIndex,
                    'cbc:DeliveredQuantity': {
                        '@unitCode': line.UnitCode,
                        '#text': line.Quantity
                    },
                    'cac:OrderLineReference': {
                        'cbc:LineID': lineIndex
                    },
                    'cac:Item': {
                        'cbc:Name': line.Name
                    },
                }
                linesArray.push(lineObject)
                lineIndex += 1;
            }
            const linesObject = {
                'cac:DespatchLine': linesArray
            }
            resolve(linesObject);
        } catch (err) {
            reject(err);
        }


    })
}