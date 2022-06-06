module.exports = deliveryBuilder = async (shipment) => {
  let deliveryAddressObject = "";
  let carrierObject = "";
  const others = shipment.Others;
  if (others.Address) {
    deliveryAddressObject = {
      "cac:DeliveryAddress": {
        "cbc:StreetName": others.Address || null,
        "cbc:CitySubdivisionName": others.District || null,
        "cbc:CityName": others.City || null,
        "cbc:PostalZone": others.PostalCode || null,
        "cac:Country": {
          "cbc:Name": others.Country || null,
        },
      },
    };
  }

  if ("RegisterNumber" in shipment.Carrier) {
    if (shipment.Carrier.RegisterNumber) {
      carrierObject = {
        "cac:CarrierParty": {
          "cac:PartyIdentification": {
            "cbc:ID": {
              "@schemeID":
                shipment.Carrier.RegisterNumber.length == 10 ? "VKN" : "TCKN",
                "#text": shipment.Carrier.RegisterNumber
            },
          },
          "cac:PartyName": {
            "cbc:Name": shipment.Carrier.Name,
          },
          "cac:PostalAddress": {
            "cbc:StreetName": shipment.Carrier.Address,
            "cbc:CitySubdivisionName": shipment.Carrier.District,
            "cbc:CityName": shipment.Carrier.City,
            "cbc:PostalZone": shipment.Carrier.PostalCode,
            "cac:Country": {
              "cbc:Name": shipment.Carrier.Country,
            }
          },
        },
      };
    }
  }
  const despatchObject = {
    "cbc:ActualDespatchDate": others.SevkIssueDate || null,
    "cbc:ActualDespatchTime": others.SevkIssueTime || null,
  };
  const deliveryObject = {
    "cac:Delivery": {
      ...deliveryAddressObject,
      ...carrierObject,
      "cac:Despatch": despatchObject,
    },
  };

  return deliveryObject;
};
