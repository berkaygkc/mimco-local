

module.exports =  despatchesBuilder = async (data) => {
    if(data) {
        const jsonArr = [];
        for await (despatch of data) {
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