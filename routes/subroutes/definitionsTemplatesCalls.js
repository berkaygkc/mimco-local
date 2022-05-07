var express = require('express');
var router = express.Router();
const fs = require('fs');
const {
    uuid
} = require('uuidv4');
const {
    PrismaClient
} = require('@prisma/client');

const prisma = new PrismaClient();

const getTemplates = async (req, res) => {
    res.render('layouts/edoc-definition/templates', {
        title: 'e-Belge Şablonlarım',
        pagetitle: 'e-Belge Şablonlarım',
        apptitle: 'definitons-templates',
    });
}

const getTemplatesFilterType = async (req, res) => {
    const query = req.query;
    const draw = query.draw;
    const type = req.params.type;
    const templates = await prisma.documentTemplates.findMany({
        where: {
            type: Number(type),
            deleted: false
        }
    });
    const count = templates.length;
    let data = []
    for await (template of templates) {
        const object = {
            id: template.id,
            name: template.name,
            default: template.default,
            active: template.active,
            action: null
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

const beDefault = async (req, res) => {
    const id = req.params.id;
    const type = req.params.type;
    const dedefault = await prisma.documentTemplates.updateMany({
        where: {
            type: Number(type),
            default: true
        },
        data: {
            default: false
        }
    })
    prisma.documentTemplates.update({
            where: {
                id: Number(id)
            },
            data: {
                default: true
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

const activate = async (req, res) => {
    const id = req.params.id;

    prisma.documentTemplates.update({
            where: {
                id: Number(id)
            },
            data: {
                active: true
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

const deactivate = async (req, res) => {
    const id = req.params.id;

    prisma.documentTemplates.update({
            where: {
                id: Number(id)
            },
            data: {
                active: false
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

const getXML = async (req, res) => {
    const param = req.query.param;
    const path = fs.realpathSync('files/');
    const xml = fs.readFileSync(`${path}/xslt/defaults/${param}`, 'utf-8');
    return res.send(xml);
}

const getXSLT = async (req, res) => {
    const id = req.params.id;
    const data = await prisma.documentTemplates.findFirst({
        where: {
            id: Number(id)
        }
    })
    let xslt = '';
    if (data.xslt_path) {
        xslt = fs.readFileSync(data.xslt_path, 'utf-8');
    }
    res.set('Content-Type', 'text/xml');
    return res.send(xslt);
}

const uploadTemplate = async (req, res) => {

    const type = req.params.type;
    const name = req.body.name;
    if (!req.files) {
        return res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
        let template = req.files.template;
        if (template.size > 1000000) {
            return res.send({
                status: false,
                message: 'Şablon boyutu 1 MBtan büyük olamaz!'
            });
        }
        if (template.mimetype != 'application/xslt+xml' && template.mimetype != 'application/xslt' && template.mimetype != 'application/xml') {
            return res.send({
                status: false,
                message: 'Şablon dosyası XSLT uzantılı olmaz zorundadır!'
            });
        }
        if (name == null || name == undefined) {
            return res.send({
                status: false,
                message: 'Şablon ismi bulunmak zorundadır!'
            });
        }

        const nameuuid = uuid()
        template.mv('./files/xslt/' + nameuuid + '.xslt');
        const filePath = fs.realpathSync(`./files/xslt/`);
        await prisma.documentTemplates.create({
                data: {
                    type: Number(type),
                    name: name,
                    xslt_path: `${filePath}/${nameuuid}.xslt`
                }
            })
            .then(result => {
                return res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: template.name,
                        mimetype: template.mimetype,
                        size: template.size
                    }
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
}

const downloadTemplate = async (req, res) => {
    const id = req.params.id;
    await prisma.documentTemplates.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                xslt_path: true
            }
        })
        .then(result => {
            console.log(result);
            const path = result.xslt_path;
            return res.download(path);
        })
        .catch(err => {
            return res.send({
                status: false,
                message: err
            })
        })
}

const deleteTemplate = async (req, res) => {
    const id = req.params.id;
    await prisma.documentTemplates.update({
        where:{
            id: Number(id)
        },
        data:{
            deleted: true
        }
    })
    .then(result => {
        return res.send({status:true, message:null});
    })
    .catch(err => {
        return res.send({status:false, message:err});
    })
}


module.exports = {
    getTemplates,
    getTemplatesFilterType,
    beDefault,
    activate,
    deactivate,
    getXML,
    getXSLT,
    uploadTemplate,
    downloadTemplate,
    deleteTemplate
};