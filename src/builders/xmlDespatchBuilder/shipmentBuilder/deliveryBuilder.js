
module.exports = deliveryBuilder = async (others) => {
    const deliveryAddressObject = {
        'cbc:StreetName': others.Address || null,
        'cbc:CitySubdivisionName': others.District ||null,
        'cbc:CityName': others.City || null,
        'cbc:PostalZone': others.PostalCode || null,
        'cac:Country':{
            'cbc:Name': others.Country || null
        }
    };
    const despatchObject = {
        'cbc:ActualDespatchDate': others.SevkIssueDate || null,
        'cbc:ActualDespatchTime': others.SevkIssueTime ||null
    }
    const deliveryObject = {
        'cac:Delivery': {
            'cac:DeliveryAddress': deliveryAddressObject,
            'cac:Despatch': despatchObject
        }
    }

    return deliveryObject;
}