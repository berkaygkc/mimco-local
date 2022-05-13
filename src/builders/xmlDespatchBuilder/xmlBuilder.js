const builder = require('xmlbuilder');
const orderBuilder = require('./headerBuilders/orderBuilder');
const notesBuilder = require('./headerBuilders/notesBuilder');
const partyBuilder = require('./partiesBuilders/partyBuilder');
const linesBuilder = require('./linesBuilders/linesBuilder');
const xsltBuilder = require('./headerBuilders/xsltBuilder');
const shipmentBuilder = require('./shipmentBuilder/shipmentBuilder');
const calculateInvoiceNumber = require('../../helpers/invoiceHelpers/calculateInvoiceNumber');
const fs = require('fs');

const createXML = (jsonPath, config) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jsonP = jsonPath.replace('\\', '/');
            const result = JSON.parse(fs.readFileSync(jsonP, 'utf-8'));
            const headerData = result;
            const orderData = await orderBuilder(result);
            const notesData = await notesBuilder(result);
            let xsltData;

            if(config.type == 'send') {
                xsltData = await xsltBuilder(result.UUID, result.IssueDate, result.XSLTCode)
            } else {
                xsltData = '';
            }
            let despatchNumber;
            if(config.type == 'send') {
                if(!config.despatch_number) {
                    despatchNumber = await calculateInvoiceNumber(result.DocumentSerieCode);
                } else {
                    despatchNumber = config.despatch_number
                }
            }
            else {
                despatchNumber = '';
            }
            const linesData = await linesBuilder(result.DespatchLines);
            const addDocData = '';
            const {
                supplierParty,
                SellerSupplierParty,
                AccountingCustomerParty,
                BuyerCustomerParty
            } = await partyBuilder(result.Parties);
            const shipment = await shipmentBuilder(result.Shipment);

            const headerObject = {
                'cbc:UBLVersionID': '2.1',
                'cbc:CustomizationID': 'TR1.2',
                'cbc:ProfileID': headerData.ProfileID,
                'cbc:ID': despatchNumber,
                'cbc:CopyIndicator': 'false',
                'cbc:UUID': headerData.UUID,
                'cbc:IssueDate': headerData.IssueDate.split('T')[0],
                'cbc:IssueTime': headerData.IssueTime.split('T')[1],
                'cbc:DespatchAdviceTypeCode': headerData.DespatchAdviceTypeCode,
                ...notesData,
                'cbc:LineCountNumeric': linesData['cac:DespatchLine'].length,
                ...orderData,
                ...addDocData,
                ...xsltData,
                ...supplierParty,
                ...AccountingCustomerParty,
                ...BuyerCustomerParty,
                ...SellerSupplierParty,
                ...shipment,
                ...linesData
            }

            const mainObject = {
                'DespatchAdvice': {
                    '@xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:DespatchAdvice-2',
                    '@xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                    '@xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
                    //'@xmlns:ccts': 'urn:un:unece:uncefact:documentation:2',
                    '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
                    '@xmlns:ext': 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2',
                    //'@xmlns:qdt': 'urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2',
                    //'@xmlns:ubltr': 'urn:oasis:names:specification:ubl:schema:xsd:TurkishCustomizationExtensionComponents',
                    //'@xmlns:udt': 'urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2',
                    '@xmlns:xades': 'http://uri.etsi.org/01903/v1.3.2#',
                    '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    '@xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                    ...headerObject
                }
            }
            //console.log(mainObject);
            const xmlr = builder.create(mainObject, {
                encoding: 'utf-8'
            })
            xmls = xmlr.end({
                pretty: true
            });
            resolve(xmls);
        } catch (err) {
            console.log('hata detay ',err);
            reject(err.toString());
        }

    })


}

module.exports = createXML;