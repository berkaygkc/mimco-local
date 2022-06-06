const fs = require("fs");
const db = require("../../sqlite/sqlite-db");
const calculateJsonInvoice = require("../../helpers/invoiceHelpers/calculateInvoice");
const checkAliasInvoice = require("../../helpers/invoiceHelpers/checkAliasInvoice");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createRecordProcess = async (job, done) => {
  try {
    let invoiceJson;
    invoiceJson = await calculateJsonInvoice(job.data.data);
    invoiceJson = await checkAliasInvoice(invoiceJson);
    const erpId = invoiceJson.ID;
    const uuid = invoiceJson.UUID;
    const ERPRefDocNumber = invoiceJson.ERPRefDocNumber;
    const issueDate = invoiceJson.IssueDate;
    const issueTime = invoiceJson.IssueTime;
    const invoiceType = invoiceJson.InvoiceType;
    const currencyCode = invoiceJson.CurrencyCode;
    const customerName = invoiceJson.Parties[0].Name;
    const customer_tax = invoiceJson.Parties[0].Identities[0].Value;
    const payableAmount = invoiceJson.Monetary.PayableAmount;
    const invoiceProfile =
      invoiceJson.SystemInvTypeCode == 1 ? "e-Fatura" : "e-Arşiv Fatura";
    const invoiceTemplate = invoiceJson.XSLTCode;
    const invoiceSerie = invoiceJson.DocumentSerieCode;
    const invoiceString = JSON.stringify(invoiceJson);
    const jsonPath = __basedir + "/files/jsons/" + erpId + "-" + uuid + ".json";
    prisma.invoices
      .create({
        data: {
          erpId: String(erpId),
          erpRefDocNumber: ERPRefDocNumber,
          invoice_profile: invoiceProfile,
          invoice_type: invoiceType,
          uuid: uuid,
          invoice_serie_id: invoiceSerie,
          invoice_template_id: invoiceTemplate,
          issue_date: issueDate,
          issue_time: issueTime,
          customer_name: customerName,
          customer_tax: customer_tax,
          payable_amount: payableAmount,
          currency_code: currencyCode,
          json_path: jsonPath,
        },
      })
      .then((result) => {
        fs.writeFile(jsonPath, invoiceString, (err) => {
          if (err) done(new Error(err));
          done(null, result);
        });
      })
      .catch((err) => {
        console.log(err);
        done(new Error(err));
      });
  } catch (error) {
    done(new Error(error));
  }
};

module.exports = createRecordProcess;
