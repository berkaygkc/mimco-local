const { insertSQL } = require('../../src/bull/queue/insertSQLQueue');
const { updateSQL } = require('../../src/bull/queue/updateSQLQueue');
const { deleteSQL } = require('../../src/bull/queue/deleteSQLQueue');
const { insertDespatchSQL } = require('../../src/bull/queue/insertDespatchSQLQueue');
const { updateDespatchSQL } = require('../../src/bull/queue/updateDespatchSQLQueue');

const insert = (req, res) => {
    const erpId = req.params.id;
    insertSQL(erpId);
    res.send(true);
}

const insertDespatch = (req, res) => {
    const erpId = req.params.id;
    insertDespatchSQL(erpId);
    res.send(true);
}


const update = (req, res) => {
    const erpId = req.params.id;
    updateSQL(erpId);
    res.send(true);
}

const updateDespatch = (req, res) => {
    const erpId = req.params.id;
    updateDespatchSQL(erpId);
    res.send(true);
}

const deleteRecord = (req, res) => {
    const erpId = req.params.id;
    deleteSQL(erpId);
    res.send(true);
}


module.exports = {
    insert,
    update,
    deleteRecord,
    insertDespatch,
    updateDespatch
}