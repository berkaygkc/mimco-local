
module.exports = partyIdentifier = async (parties) => {
    return new Promise(async (resolve, reject) => {
        const identifyArray = [];
        let partyTypeText = '';
        let isExport = '';
        for await (identity of parties.Identities) {
            if (identity.SchemaID && identity.Value) {
                if (identity.SchemaID == 'VKN' || identity.SchemaID == 'TCKN') {
                    partyTypeText = identity.SchemaID;
                } else if (identity.SchemaID == 'PARTYTYPE') {
                    isExport = 1;
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
        let partyLegal = '';
        if (partyTypeText == 'TCKN') {
            personName = {
                'cac:Person': {
                    'cbc:FirstName': parties.Name.split(' ').slice(0, -1).join(' '),
                    'cbc:FamilyName': parties.Name.split(' ').slice(-1).join(' ')
                }
            }
        } else {
            partyName = {
                'cac:PartyName': {
                    'cbc:Name': parties.Name
                }
            }
        }
        if(isExport) {
            partyLegal = {
                'cac:PartyLegalEntity': {
                    'cbc:RegistrationName': parties.ExportInfo.Name,
                    'cbc:CompanyID': parties.ExportInfo.RegisterNumber
                }
            }
        }
        const object = {
            partyId,
            partyName,
            personName,
            partyLegal
        }
        resolve(object);

    })
}