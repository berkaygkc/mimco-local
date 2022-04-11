const builder = require('xmlbuilder');
const orderBuilder = require('./headerBuilders/orderBuilder');
const despatchesBuilder = require('./headerBuilders/despatchesBuilder');
const notesBuilder = require('./headerBuilders/notesBuilder');
const partyBuilder = require('./partiesBuilders/partyBuilder');
const taxesBuilder = require('./headerBuilders/taxesBuilder');
const monetaryBuilder = require('./headerBuilders/monetaryBuilder');
const linesBuilder = require('./linesBuilders/linesBuilder');
const fs = require('fs');
const xsltBuilder = require('./headerBuilders/xsltBuilder');
const calculateInvoiceNumber = require('../../helpers/invoiceHelpers/calculateInvoiceNumber');
const exchangeRateBuilder = require('./headerBuilders/exchangeRateBuilder');

const createXML = (jsonPath, config) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jsonP = jsonPath.replace('\\', '/');
            const result = JSON.parse(fs.readFileSync(jsonP, 'utf-8'));
            const headerData = result;
            const orderData = await orderBuilder(result)
            const notesData = await notesBuilder(result);
            const despatchesData = await despatchesBuilder(result);
            const exchangeRateData = await exchangeRateBuilder(result);
            let xsltData;

            if(config.type == 'send') {
                xsltData = await xsltBuilder(result.UUID, result.IssueDate, result.XSLTCode)
            } else {
                xsltData = '';
            }
            let invoiceNumber;
            if(config.type == 'send') {
                if(!config.invoice_number) {
                    invoiceNumber = await calculateInvoiceNumber(result.SystemInvTypeCode);
                } else {
                    invoiceNumber = config.invoice_number
                }
            }
            else {
                invoiceNumber = '';
            }
            const taxArrayData = await taxesBuilder(result.Taxes, result.CurrencyCode);
            const taxesData = {
                'cac:TaxTotal': {
                    'cbc:TaxAmount': {
                        '@currencyID': result.CurrencyCode,
                        '#text' : Math.round(result.TaxAmount * 100) / 100 
                    },
                    ...taxArrayData
                }
            }
            const monetaryData = await monetaryBuilder(result.Monetary);
            const linesData = await linesBuilder(result.InvoiceLines, result.CurrencyCode);
            const addDocData = '';
            const {
                supplierParty,
                SellerSupplierParty,
                AccountingCustomerParty,
                BuyerCustomerParty
            } = await partyBuilder(result.Parties);



            const headerObject = {
                'cbc:UBLVersionID': '2.1',
                'cbc:CustomizationID': 'TR1.2',
                'cbc:ProfileID': headerData.ProfileID,
                'cbc:ID': invoiceNumber,
                'cbc:CopyIndicator': 'false',
                'cbc:UUID': headerData.UUID,
                'cbc:IssueDate': headerData.IssueDate.split('T')[0],
                'cbc:IssueTime': headerData.IssueTime.split('T')[1],
                'cbc:InvoiceTypeCode': headerData.InvoiceType,
                ...notesData,
                'cbc:DocumentCurrencyCode': headerData.CurrencyCode,
                'cbc:LineCountNumeric': linesData['cac:InvoiceLine'].length,
                ...orderData,
                ...despatchesData,
                ...addDocData,
                ...xsltData,
                ...supplierParty,
                ...AccountingCustomerParty,
                ...BuyerCustomerParty,
                ...SellerSupplierParty,
                ...exchangeRateData,
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
            console.log('hata detay ',err);
            reject(err.toString());
        }

    })


}

module.exports = createXML;