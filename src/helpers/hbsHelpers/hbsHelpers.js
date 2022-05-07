module.exports = {
    isInvoicesList(apptitle) {
        if (apptitle == 'invoices-list') {
            return true;
        } else {
            return false;
        }
    },
    isInvoicesStatusList(apptitle) {
        if(apptitle == 'invoices-status') {
            return true;
        } else {
            return false;
        }
    },
    isInvoicesEdit(apptitle) {
        if(apptitle == 'invoices-edit') {
            return true;
        } else {
            return false;
        }
    },
    isOutgoingEInvoices(apptitle) {
        if(apptitle == 'outgoing-einvoices') {
            return true;
        } else {
            return false;
        }
    },
    isOutgoingEArchive(apptitle) {
        if(apptitle == 'outgoing-earchive') {
            return true;
        } else {
            return false;
        }
    },
    isIncomingEInvoices(apptitle) {
        if(apptitle == 'incoming-einvoices') {
            return true;
        } else {
            return false;
        }
    },    
    isDefinitionsSeries(apptitle) {
        if(apptitle == 'definitons-series') {
            return true;
        } else {
            return false;
        }
    },
    isDefinitionsTemplates(apptitle) {
        if(apptitle == 'definitons-templates') {
            return true;
        } else {
            return false;
        }
    },
    isEInvoice(profile) {
        if (profile == 'e-Fatura') {
            return true;
        } else {
            return false;
        }
    },
    isIncorrectInvoice(statusCode) {
        if (statusCode == 101 || statusCode == 102 || statusCode == 999) {
            return true;
        } else {
            return false;
        }
    },
    isCorrectInvoice(statusCode) {
        if (statusCode == 105 ) {
            return true;
        } else {
            return false;
        }
    },
    isVKN(data) {
        if (data.length == 10) {
            return true;
        } else {
            return false;
        }
    }
}