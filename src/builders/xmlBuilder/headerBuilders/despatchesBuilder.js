

module.exports =  despatchesBuilder = async (data) => {
    if (data.Despatches && data.Despatches.length > 0) {
        const jsonArr = [];
        for await (despatch of data.Despatches) {
            if(despatch.Value && despatch.Date) {
                jsonArr.push({
                    'cbc:ID': despatch.Value ,
                    'cbc:IssueDate': despatch.Date
                });
            }
        }
        const object = {
            'cac:DespatchDocumentReference': jsonArr
        }
    
        if(jsonArr.length > 0) {
            return object ;
        } else return '';
    } else return '';

}