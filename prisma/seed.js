const {
    PrismaClient
} = require('@prisma/client')
const fs = require('fs');

const prisma = new PrismaClient()

const compData = {
    entegrator_username: "kurumbir@mimsoft.com.tr",
    entegrator_password: "12345678",
    name: "MİMSOFT ARGE ARŞİVLEME TEKNOLOJİLERİ AŞ",
    tax_office: "KOCASİNAN",
    address: "MAHMUTBEY MAH. 2455 SK. NO:69",
    district: "Bahçelievler",
    city: "İstanbul",
    country: "Türkiye",
    phone_number: "5434041253",
    fax_number: null,
    email: "bilgi@rahatfatura.com.tr",
    tax_number: "1234567801",
    alias: null
}

const docSeries = [{
        serie: "EFA",
        type: 1,
        default: true
    },
    {
        serie: "EAR",
        type: 2,
        default: true
    },
    {
        serie: "IRS",
        type: 3,
        default: true
    },
    {
        serie: "EMM",
        type: 4,
        default: true
    },
    {
        serie: "SMM",
        type: 5,
        default: true
    }
]

const path = fs.realpathSync('./')

const docTemplates = [{
        xslt_path: path + '/files/xslt/e-invoice.xslt',
        type: 1,
        default: true,
        name: "Varsayılan e-Fatura Şablonu"
    },
    {
        xslt_path: path + '/files/xslt/e-archive.xslt',
        type: 2,
        default: true,
        name: "Varsayılan e-Arşiv Fatura Şablonu"
    },
    {
        xslt_path: path + '/files/xslt/e-despacth.xslt',
        type: 3,
        default: true,
        name: "Varsayılan e-İrsaliye Şablonu"
    },
    {
        xslt_path: path + '/files/xslt/e-mm.xslt',
        type: 4,
        default: true,
        name: "Varsayılan e-Müstahsil Şablonu"
    },
    {
        xslt_path: path + '/files/xslt/e-smm.xslt',
        type: 5,
        default: true,
        name: "Varsayılan e-SMM Şablonu"
    }
]

const queries = {

}

async function main() {
    console.log(`Start seeding ...`)
    const comp = await prisma.companyInfo.create({
        data: compData,
    });
    console.log(`Created company with id: ${comp.id}`)
    for (const serie of docSeries) {
        const s = await prisma.documentSeries.create({
            data: serie,
        })
        console.log(`Created serie with id: ${s.id}`)
    }
    for (const template of docTemplates) {
        const t = await prisma.documentTemplates.create({
            data: template,
        })
        console.log(`Created template with id: ${t.id}`)
    }
    const q = await prisma.sqlQueries.create({
        data: queries,
    });
    console.log(`Seeding finished.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })