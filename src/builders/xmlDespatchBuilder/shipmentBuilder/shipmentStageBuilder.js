module.exports = shipmentStageBuilder = async (plateID, drivers) => {
    let plateObject = {};
    if (plateID) {
        plateObject = {
            'cac:TransportMeans': {
                'cac:RoadTransport': {
                    'cbc:LicensePlateID': {
                        '@schemeID': 'PLAKA',
                        '#text': plateID
                    }
                }
            }
        }
    } else {
        plateObject = {
            'cac:TransportMeans': {
                'cac:RoadTransport': {
                    'cbc:LicensePlateID': {
                        '@schemeID': 'PLAKA',
                        '#text': null
                    }
                }
            }
        }
    }
    let driverArr = [];
    if (drivers.length > 0) {
        for await (driver of drivers) {
            const driverObject = {
                "cbc:FirstName": driver.Name,
                "cbc:FamilyName": driver.Surname,
                "cbc:Title": "Şoför",
                "cbc:NationalityID": driver.NationalityID
            }
            driverArr.push(driverObject);
        }
    }

    const shipmentStageObject = {
        'cac:ShipmentStage': {
            ...plateObject,
            'cac:DriverPerson': driverArr
        }
    }

    return shipmentStageObject;
}