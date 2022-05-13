
module.exports = notesBuilder = async (data) => {

    const jsonArr = [];
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