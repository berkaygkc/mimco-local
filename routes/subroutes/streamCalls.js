const { insertSQL } = require('../../src/bull/queue/insertSQLQueue');

const insert = (req, res) => {
    const erpId = req.params.id;
    insertSQL(erpId);
    res.send(true);
}

module.exports = {
    insert
}