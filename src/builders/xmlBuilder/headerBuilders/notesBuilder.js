

module.exports =  notesBuilder = async (data) => {
    if(data){
        const jsonArr = [];
        for await (note of data) {
            if(note) {
                jsonArr.push({
                    '#text': note
                });
            }
        }
        
        const object = {
            'cbc:Note': jsonArr
        }
    
        if(jsonArr.length > 0) {
            return object ;
        } else return '';
    }
    else return '';

}