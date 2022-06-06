const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

const getDrivers = async (req, res) => {
    res.render('layouts/despatch-definitions/drivers', {
        title: 'Şoförler',
        pagetitle: 'Şoförler',
        apptitle: 'despatch-definitions-drivers',
    });
}

const getDriversList = async (req, res) => {
    const query = req.query;
    const draw = query.draw;
    const drivers = await prisma.despatchDrivers.findMany({});
    const count = drivers.length;
    let data = []
    for await (driver of drivers) {
        const object = {
            name: driver.name,
            surname: driver.surname,
            nationality_id: driver.nationality_id
        }
        data.push(object);
    }
    const returnObject = {
        draw,
        recordsTotal: count,
        recordsFiltered: count,
        data
    }
    return res.send(returnObject);

}

const newDriver = async (req, res) => {
    const {name, surname, tc} = req.body;
    prisma.despatchDrivers.create({
        data:{
            name: String(name),
            surname: String(surname),
            nationality_id: String(tc)
        }
    })
    .then(result => {
        return res.send({
            status: true,
            message: null
        });
    })
    .catch(err => {
        console.log(err);
        return res.send({
            status: false,
            message: err
        });
    })
}

const getPlates = async (req, res) => {
    res.render('layouts/despatch-definitions/plates', {
        title: 'Plakalar',
        pagetitle: 'Plakalar',
        apptitle: 'despatch-definitions-plates',
    });
}

const getPlatesList = async (req, res) => {
    const query = req.query;
    const draw = query.draw;
    const plates = await prisma.despatchPlates.findMany({});
    const count = plates.length;
    let data = []
    for await (plate of plates) {
        const object = {
            plate: plate.plate,
        }
        data.push(object);
    }
    const returnObject = {
        draw,
        recordsTotal: count,
        recordsFiltered: count,
        data
    }
    return res.send(returnObject);

}

const newPlate = async (req, res) => {
    const {plate} = req.body;
    prisma.despatchPlates.create({
        data:{
            plate: String(plate),
        }
    })
    .then(result => {
        return res.send({
            status: true,
            message: null
        });
    })
    .catch(err => {
        console.log(err);
        return res.send({
            status: false,
            message: err
        });
    })
}

const getCarriers = async (req, res) => {
    res.render('layouts/despatch-definitions/carriers', {
        title: 'Taşıyıcı Firmalar',
        pagetitle: 'Taşıyıcı Firmalar',
        apptitle: 'despatch-definitions-carriers',
    });
}

const getCarriersList = async (req, res) => {
    const query = req.query;
    const draw = query.draw;
    const carriers = await prisma.despatchCarriers.findMany({});
    const count = carriers.length;
    let data = []
    for await (carrier of carriers) {
        const object = {
            name: carrier.name,
            id: carrier.register_number,
            address: carrier.address
        }
        data.push(object);
    }
    const returnObject = {
        draw,
        recordsTotal: count,
        recordsFiltered: count,
        data
    }
    return res.send(returnObject);

}

const newCarrier = async (req, res) => {
    const {name, id, tax, address, district, city, country, postal} = req.body;
    prisma.despatchCarriers.create({
        data:{
            name: String(name),
            register_number: String(id),
            tax_office: String(tax),
            address: String(address),
            district: String(district),
            city: String(city),
            country: String(country),
            postal_code: String(postal)
        }
    })
    .then(result => {
        return res.send({
            status: true,
            message: null
        });
    })
    .catch(err => {
        console.log(err);
        return res.send({
            status: false,
            message: err
        });
    })
}




module.exports = {
    getDrivers,
    getDriversList,
    newDriver,
    getPlates,
    getPlatesList,
    newPlate,
    getCarriers,
    getCarriersList,
    newCarrier
};