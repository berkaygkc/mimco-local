const fs = require("fs");
const checkAliasDespatch = require("../../helpers/despatchHelpers/checkAliasDespatch");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const updateDespatchRecordProcess = async (job, done) => {
  try {
    let despatchJson;
    despatchJson = await checkAliasDespatch(job.data.data);
    const erpId = despatchJson.ID;
    const uuid = despatchJson.UUID;
    const ERPRefDocNumber = despatchJson.ERPRefDocNumber;
    const issueDate = despatchJson.IssueDate;
    const issueTime = despatchJson.IssueTime;
    const customerName = despatchJson.Parties[0].Name;
    const customer_tax = despatchJson.Parties[0].Identities[0].Value;
    const despatchTemplate = despatchJson.XSLTCode;
    const despatchSerie = despatchJson.DocumentSerieCode;
    const despatchString = JSON.stringify(despatchJson);
    const jsonPath = __basedir + "/files/jsons/" + erpId + "-" + uuid + ".json";
    prisma.despatches
      .findFirst({
        where: {
          erpId: String(erpId),
        },
      })
      .then((result) => {
        try {
          const deleted = fs.unlinkSync(result.json_path);
        } catch (e) {
          console.log(e);
        }
        prisma.despatches
          .update({
            where: {
              erpId: String(erpId),
            },
            data: {
              erpRefDocNumber: ERPRefDocNumber,
              uuid: uuid,
              despatch_serie_id: despatchSerie,
              despatch_template_id: despatchTemplate,
              issue_date: issueDate,
              issue_time: issueTime,
              customer_name: customerName,
              customer_tax: customer_tax,
              json_path: jsonPath,
              is_sended: false,
              status_code: null,
              status_description: null,
            },
          })
          .then((result) => {
            fs.writeFile(jsonPath, despatchString, (err) => {
              if (err) done(new Error(err));
              done(null, result);
            });
          })
          .catch((err) => {
            console.log(err);
            done(new Error(err));
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

module.exports = updateDespatchRecordProcess;
