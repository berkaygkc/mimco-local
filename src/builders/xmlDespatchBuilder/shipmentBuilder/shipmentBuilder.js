const shipmentStageBuilder = require('./shipmentStageBuilder');
const deliveryBuilder = require('./deliveryBuilder');

module.exports = (shipment) => {
    return new Promise(async (resolve, reject) => {

        try {
            const shipmentStageObject = await shipmentStageBuilder(shipment.PlateID, shipment.Drivers);
            const deliveryObject = await deliveryBuilder(shipment.Others);
            let shipmentObject = {
                'cac:Shipment': {
                    'cbc:ID': '',
                    ...shipmentStageObject,
                    ...deliveryObject
                }
            }
            resolve(shipmentObject);
        } catch (err) {
            reject(err);
        }


    })
}