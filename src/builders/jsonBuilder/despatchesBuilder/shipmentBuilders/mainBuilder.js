
const { mssql, sql } = require('../../../../mssql/mssql-pool');
const driversBuilder = require('./driversBuilder');
const othersBuilder = require('./othersBuilder');
const plateIDBuilder = require('./plateidBuilder');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();


const shipmentBuilder = (erpId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const driversObject = await driversBuilder(erpId);
            const othersObject = await othersBuilder(erpId);
            const plateIDObject = await plateIDBuilder(erpId);
            const object = {
                ID: null,
                Drivers: driversObject,
                ...plateIDObject,
                Others: othersObject 
            }
            resolve(object);
        } catch (err) {
            reject(err);
        }
    })
    
}

module.exports = shipmentBuilder;