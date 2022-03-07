
module.exports = partyIdentifier = async (parties) => {
    return new Promise(async (resolve, reject) => {
        const identifyArray = [];
        let partyTypeText = '';
        for await (identity of parties.Identities) {
            if (identity.SchemaID && identity.Value) {
                if (identity.SchemaID == 'VKN' || identity.SchemaID == 'TCKN') {
                    partyTypeText = identity.SchemaID;
                }
                identifyArray.push({
                    'cbc:ID': {
                        '@schemeID': identity.SchemaID,
                        '#text': identity.Value
                    }
                });
            }
        }
        const partyId = {
            'cac:PartyIdentification': identifyArray
        }
        let partyName = '';
        let personName = '';
        if (partyTypeText == 'VKN') {
            partyName = {
                'cac:PartyName': {
                    'cbc:Name': parties.Name
                }
            }
        } else {
            personName = {
                'cac:Person': {
                    'cbc:FirstName': parties.Name.split(' ').slice(0, -1).join(' '),
                    'cbc:FamilyName': parties.Name.split(' ').slice(-1).join(' ')
                }
            }
        }
        const object = {
            partyId,
            partyName,
            personName
        }
        resolve(object);

    })
}