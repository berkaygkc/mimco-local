const db = require('../../../sqlite/sqlite-db');
const partyIdentifier = require('./customerIdentifyBuilder');


module.exports = partyBuilder = async (partiesData) => {
    return new Promise((resolve, reject) => {
        db
            .query('select * from company_info')
            .then(async (result) => {
                const company = result[0];
                const supplierParty = {
                    'cac:AccountingSupplierParty': {
                        'cac:Party': {
                            'cac:PartyIdentification': {
                                'cbc:ID': {
                                    '@schemeID': 'VKN',
                                    '#text': company.tax_number
                                }
                            },
                            'cac:PartyName': {
                                'cbc:Name': company.name
                            },
                            'cac:PostalAddress': {
                                'cbc:StreetName': company.address,
                                'cbc:CitySubdivisionName': company.district,
                                'cbc:CityName': company.city,
                                'cac:Country': {
                                    'cbc:Name': company.country,
                                }
                            },
                            'cac:PartyTaxScheme': {
                                'cac:TaxScheme': {
                                    'cbc:Name': company.tax_office,
                                }
                            },
                            'cac:Contact': {
                                'cbc:Telephone': company.phone_number,
                                'cbc:ElectronicMail': company.email
                            }
                        }
                    }
                }

                let AccountingCustomerParty = '';
                let BuyerCustomerParty = '';
                let SellerSupplierParty = '';
                for await (index of partiesData) {
                    const partyDataLine = index;
                    await partyIdentifier(partyDataLine)
                        .then(result => {
                            const party = {
                                'cac:Party': {
                                    ...result.partyId,
                                    ...result.partyName,
                                    'cac:PostalAddress': {
                                        'cbc:StreetName': partyDataLine.Address,
                                        'cbc:CitySubdivisionName': partyDataLine.District,
                                        'cbc:CityName': partyDataLine.City,
                                        'cbc:PostalZone': partyDataLine.PostalCode,
                                        'cac:Country': {
                                            'cbc:Name': partyDataLine.Country,
                                        }
                                    },
                                    'cac:PartyTaxScheme': {
                                        'cac:TaxScheme': {
                                            'cbc:Name': partyDataLine.TaxOffice,
                                        }
                                    },
                                    'cac:Contact': {
                                        'cbc:Telephone': partyDataLine.PhoneNumber,
                                        'cbc:ElectronicMail': partyDataLine.Mail
                                    },
                                    ...result.personName
                                }
                            }
                            if (partyDataLine.Type == 2) {
                                AccountingCustomerParty = {
                                    'cac:AccountingCustomerParty': party
                                }
                            } else if (partyDataLine.Type == 3) {
                                BuyerCustomerParty = {
                                    'cac:BuyerCustomerParty': party
                                }
                            } else if (partyDataLine.Type == 4) {
                                SellerSupplierParty = {
                                    'cac:SellerSupplierParty': party
                                }
                            } else {
                                AccountingCustomerParty = '13213';
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                const object = {
                    supplierParty,
                    SellerSupplierParty,
                    AccountingCustomerParty,
                    BuyerCustomerParty
                }
                resolve(object);
            })
            .catch(err => {
                reject(err);
            })
    })

    //Supplier yapısı

}