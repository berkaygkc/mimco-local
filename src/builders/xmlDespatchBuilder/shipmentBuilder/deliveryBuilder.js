
module.exports = deliveryBuilder = async (others) => {
    let deliveryAddressObject = ''
    if(others.Address) {
        deliveryAddressObject = {
            'cac:DeliveryAddress': {
                'cbc:StreetName': others.Address || null,
                'cbc:CitySubdivisionName': others.District ||null,
                'cbc:CityName': others.City || null,
                'cbc:PostalZone': others.PostalCode || null,
                'cac:Country':{
                    'cbc:Name': others.Country || null
                }
            }
        };
    }
    const despatchObject = {
        'cbc:ActualDespatchDate': others.SevkIssueDate || null,
        'cbc:ActualDespatchTime': others.SevkIssueTime ||null
    }
    const deliveryObject = {
        'cac:Delivery': {
            ...deliveryAddressObject,
            'cac:Despatch': despatchObject
        }
    }

    return deliveryObject;
}