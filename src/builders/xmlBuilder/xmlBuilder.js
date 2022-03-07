const builder = require('xmlbuilder');
const orderBuilder = require('./headerBuilders/orderBuilder');
const despatchesBuilder = require('./headerBuilders/despatchesBuilder');
const notesBuilder = require('./headerBuilders/notesBuilder');
const partyBuilder = require('./partiesBuilders/partyBuilder');
const taxesBuilder = require('./headerBuilders/taxesBuilder');
const monetaryBuilder = require('./headerBuilders/monetaryBuilder');
const linesBuilder = require('./linesBuilders/linesBuilder');
const fs = require('fs');

const createXML = (jsonPath) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jsonP = jsonPath.replace('\\', '/');
            const result = JSON.parse(fs.readFileSync(jsonP, 'utf-8'));
            const headerData = result;
            const orderData = await orderBuilder(result)
            const notesData = await notesBuilder(result.Notes);
            const despatchesData = await despatchesBuilder(result.Despatches);
            const taxArrayData = await taxesBuilder(result.Taxes, result.CurrencyCode);
            const taxesData = {
                'cac:TaxTotal': {
                    'cbc:TaxAmount': {
                        '@currencyID': result.CurrencyCode,
                        '#text' : result.TaxAmount
                    },
                    ...taxArrayData
                }
            }
            const monetaryData = await monetaryBuilder(result.Monetary);
            const linesData = await linesBuilder(result.InvoiceLines);
            const addDocData = '';
            const {
                supplierParty,
                SellerSupplierParty,
                AccountingCustomerParty,
                BuyerCustomerParty
            } = await partyBuilder(result.Parties);

            const headerObject = {
                'cbc:UBLVersionID': headerData.UBLVersionID,
                'cbc:CustomizationID': headerData.CustomizationID,
                'cbc:ProfileID': headerData.ProfileID,
                'cbc:ID': '',
                'cbc:CopyIndicator': headerData.CopyIndicator,
                'cbc:UUID': headerData.UUID,
                'cbc:IssueDate': headerData.IssueDate,
                'cbc:IssueTime': headerData.IssueTime,
                'cbc:InvoiceTypeCode': headerData.InvoiceTypeCode,
                ...notesData,
                'cbc:DocumentCurrenyCode': headerData.InvoiceTypeCode,
                'cbc:LineCountNumeric': headerData.LineCountNumeric,
                ...orderData,
                ...despatchesData,
                ...addDocData,
                ...supplierParty,
                ...AccountingCustomerParty,
                ...BuyerCustomerParty,
                ...SellerSupplierParty,
                ...taxesData,
                ...monetaryData,
                ...linesData
            }

            const mainObject = {
                'Invoice': {
                    '@xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
                    '@xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                    '@xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
                    '@xmlns:ccts': 'urn:un:unece:uncefact:documentation:2',
                    '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
                    '@xmlns:ext': 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2',
                    '@xmlns:qdt': 'urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2',
                    '@xmlns:ubltr': 'urn:oasis:names:specification:ubl:schema:xsd:TurkishCustomizationExtensionComponents',
                    '@xmlns:udt': 'urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2',
                    '@xmlns:xades': 'http://uri.etsi.org/01903/v1.3.2#',
                    '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
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
            reject(err);
        }

    })


}

module.exports = createXML;