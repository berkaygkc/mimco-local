

module.exports = deliveryBuilder = async (line) => {
    if(line.Delivery || line.ExportInfo) {
        const jsonObj = {
            'cac:DeliveryAddress': {
                'cbc:StreetName': line.Delivery.Address,
                'cbc:CitySubdivisionName' : line.Delivery.District,
                'cbc:CityName': line.Delivery.City,
                'cac:Country':{
                    'cbc:Name': line.Delivery.Country
                }
            },
            'cac:DeliveryTerms': {
                'cbc:ID': {
                    '@schemeID':'INCOTERMS',
                    '#text': line.ExportInfo.TermCode
                }
            },
            'cac:Shipment': {
                'cbc:ID':' ',
                'cac:GoodsItem': {
                    'cbc:RequiredCustomsID': line.GTIP
                },
                'cac:ShipmentStage': {
                    'cbc:TransportModeCode': line.ExportInfo.TransportMode
                }
            }
        };
            
        const object = {
            'cac:Delivery': jsonObj
        }

        return object;
    }
    else {
        return '';
    }
}