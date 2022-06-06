const builders = require('../../builders/index');
const {updateRecord} = require('../queue/updateRecordQueue');
const db = require('../../sqlite/sqlite-db');
const { createRecord } = require('../queue/createRecordQueue');
const {
    PrismaClient
} = require('@prisma/client');
const updateDespatchNumberSQL = require('../../helpers/despatchHelpers/updateDespatchNumberSQL');

const prisma = new PrismaClient();

const updateDespatchNumberProcess = async (job, done) => {
	try{
		const dspId = job.data.data;
		prisma.despatches.findFirst({
			where:{
				id: Number(dspId)
			},
			select: {
				despatch_number: true,
				erpId: true
			}
		})
		.then(result => {
			if(result.despatch_number){
				updateDespatchNumberSQL(result.erpId, result.despatch_number)
				.then(result => {
					if(result.status){
						done(null, result);
					} else {
						done(new Error(JSON.stringify(result.message)));
					}
				})
				.catch(err => {
					done(new Error(JSON.stringify(err)));
				})
			} else {
				done(new Error('Irsaliye numarası bulunmuyor!'))
			}
		})
		.catch(err => {
			done(new Error(err));
		})
	} catch (e) {
		done(new Error(e));
	}
    
   
}

module.exports = updateDespatchNumberProcess;