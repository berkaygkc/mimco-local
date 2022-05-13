let fd = new Date();
fd.setDate(fd.getDate() - 14);

const fDatePicker = MCDatepicker.create({
    el: '#fdate',
    dateFormat: 'DD.MM.YYYY',
    customWeekDays: ['PZ', 'PZT', 'SL', 'ÇR', 'PR', 'CU', 'CM'],
    selectedDate: fd,
    customMonths: [
        'Ocak',
        'Şubat',
        'Mart',
        'Nisan',
        'Mayıs',
        'Haziran',
        'Temmuz',
        'Ağustos',
        'Eylül',
        'Ekim',
        'Kasım',
        'Aralık'
    ],
    firstWeekday: 1,
    autoClose: true,
    customOkBTN: 'Tamam',
    customClearBTN: '',
    customCancelBTN: 'İptal',
    closeOnBlur: true
});

const lDatePicker = MCDatepicker.create({
    el: '#ldate',
    dateFormat: 'DD.MM.YYYY',
    customWeekDays: ['PZ', 'PZT', 'SL', 'ÇR', 'PR', 'CU', 'CM'],
    selectedDate: new Date(),
    customMonths: [
        'Ocak',
        'Şubat',
        'Mart',
        'Nisan',
        'Mayıs',
        'Haziran',
        'Temmuz',
        'Ağustos',
        'Eylül',
        'Ekim',
        'Kasım',
        'Aralık'
    ],
    firstWeekday: 1,
    autoClose: true,
    customOkBTN: 'Tamam',
    customClearBTN: '',
    customCancelBTN: 'İptal',
    closeOnBlur: true
});

let minDate, maxDate, searchText, filter;

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {

        let searchKey = new RegExp(searchText, 'i')
        let min = minDate._d;
        let max = maxDate._d;
        let date = moment(data[4].split(' ')[3], 'DD-MM-YYYY')._d;
        let text = data[2];
        let statusCode = data[7];

        if (
            (
                (min === null && max === null) ||
                (min === null && date <= max) ||
                (min <= date && max === null) ||
                (min <= date && date <= max)) &&
            (text.search(searchKey) > -1) &&
            (
                (filter == 0) ||
                (filter == 1 && statusCode == 105) ||
                (filter == 2 && (statusCode == 101 || statusCode == 102)) ||
                (filter == 3 && (statusCode == 100 || statusCode == 103))
            )
        ) {
            return true;
        }
        return false;
    }
);

$(document).ready(function () {
    $.noConflict();

    $('#ldate').val(moment().format("DD.MM.YYYY"));
    $('#fdate').val(moment().subtract(14, "days").format("DD.MM.YYYY"));
    $('#filter').val(0);

    minDate = moment($('#fdate').val(), 'DD-MM-YYYY');
    maxDate = moment($('#ldate').val(), 'DD-MM-YYYY');
    searchText = $('#searchBox').val();

    let table = $('#despatches').DataTable({
        'ordering': false,
        'language': {
            'url': '/libs/datatables.net/js/dataTables.tr.json'
        },
        'dom': 't<"row"<"col-sm-12 col-md-5"l><"col-sm-12 col-md-7"p>><"row"<"col-sm-12 col-md-5"i>>r',
        'columnDefs': [{
                'targets': 0,
                'width': '2%'
            },
            {
                "render": function (data, type, row) {
                    return '<b>ERP No : </b>' + data + ' <br> <b>' + row[5] + '</b>';
                },
                'width': '15%',
                'targets': 1
            },
            {
                "render": function (data, type, row) {
                    return '<b>Ünvan : </b>' + data + ' <br>' + row[3];
                },
                'width': '35%',
                'targets': 2
            },
            {
                "render": function (data, type, row) {
                    return '<b>İrsaliye Tarihi : </b>' + data;
                },
                "targets": 4,
                'width': '20%'
            },
            {
                'visible': false,
                "targets": [3, 5, 7]
            },
            {
                'width': '15%',
                'targets': 6
            },
            {
                'width': '7%',
                'targets': 8
            }
        ],
        'select': {
            'style': 'multi'
        },
    });

    const searchTable = () => {
        minDate = moment($('#fdate').val(), 'DD-MM-YYYY');
        maxDate = moment($('#ldate').val(), 'DD-MM-YYYY');
        searchText = $('#searchBox').val();
        filter = $('#filter').val();
        table.draw();
    }

    searchTable();

    $("#searchButton").on("click", function () {
        searchTable();
    });

    $('#searchBox').keypress(function (e) {
        let key = e.which;
        if (key == 13) // the enter key code
        {
            searchTable();
        }
    });

    fDatePicker.onClose(() => {
        searchTable();
    });

    lDatePicker.onClose(() => {
        searchTable();
    });

    $('#despatches tbody').on('click', '#error-button', function () { //irsaliyeleştirildi
        var data = table.row($(this).parents('tr')).data();

        $.ajax({
            url: '/despatches/statusdetail/' + data[0],
            method: 'GET',
            success: function (response) {
                console.log(response);
                if (response) {
                    Swal.fire({
                        icon: 'error',
                        title: JSON.parse(response).description,
                        text: response,
                    })
                } else {
                    swal.fire(
                        'Hata!!',
                        'Hata Detayı : ' + response,
                        'error',
                    )
                }
            },
            error: function (err) {
                swal.fire(
                    'Hata!!',
                    'Hata Detayı : ' + JSON.stringify({
                        status: err.status,
                        description: err.statusText
                    }),
                    'error',
                )
            }
        })

    });

    $('#despatches tbody').on('click', '#info-button', function () { //irsaliyeleştirildi
        var data = table.row($(this).parents('tr')).data();

        $.ajax({
            url: '/despatches/statusdetail/' + data[0],
            method: 'GET',
            success: function (response) {
                console.log(response);
                if (response) {
                    Swal.fire({
                        icon: 'info',
                        title: JSON.parse(response).description,
                        text: response,
                    })
                } else {
                    swal.fire(
                        'Hata!!',
                        'Hata Detayı : ' + response,
                        'error',
                    )
                }
            },
            error: function (err) {
                swal.fire(
                    'Hata!!',
                    'Hata Detayı : ' + JSON.stringify({
                        status: err.status,
                        description: err.statusText
                    }),
                    'error',
                )
            }
        })

    });

    $('#despatches tbody').on('click', '#preview', function () { //irsaliyeleştirildi
        var data = table.row($(this).parents('tr')).data();
        var xml;
        var xslt;
        $.when(
            $.ajax({ // First Request
                url: '/despatches/getxml/' + data[0],
                type: 'get',
                success: function (xmls) {
                    xml = xmls;
                }
            }),

            $.ajax({ // First Request
                url: '/despatches/getxslt/' + data[0],
                type: 'get',
                success: function (xslts) {
                    xslt = xslts;
                }
            })

        ).then(function () {
            parser = new DOMParser();
            let xmlDoc, xslDoc;
            if(typeof xml == 'string'){
                xmlDoc = parser.parseFromString(xml, "application/xml");
            } else {
                xmlDoc = xml;
            }
    
            if(typeof xslt == 'string') {
                xslDoc = parser.parseFromString(xslt, "application/xml");
            } else {
                xslDoc = xslt;
            }
            console.log(xmlDoc);
            processor = new XSLTProcessor();
            processor.importStylesheet(xslDoc);
            result = processor.transformToDocument(xmlDoc);
            var blob = new Blob([new XMLSerializer().serializeToString(result.doctype), result.documentElement.innerHTML], {
                type: "text/html"
            })
            $('#invoiceFrame').attr('src', URL.createObjectURL(blob));
        });
    });

    $("#iframe-print").on("click", function () { //irsaliyeleştirildi
        var myIframe = document.getElementById("invoiceFrame").contentWindow;
        myIframe.focus();
        myIframe.print();

        return false;
    });

    $('#despatches tbody').on('click', '#mark-resolved a', function () { //irsaliyeleştirildi
        let data = table.row($(this).parents('tr')).data();

        Swal.fire({
                title: data[1] + ' numaralı irsaliyeyi çözüldü olarak işaretlemek istediğinize emin misiniz?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: '/despatches/mark/resolved/' + data[0],
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'İrsaliye başarıyla çözüldü olarak işaretlendi!',
                                    icon: 'success',
                                }).then((result) => {
                                    location.reload();
                                });

                            } else {
                                swal.fire(
                                    'Hata!!',
                                    'Hata Detayı : ' + response.message,
                                    'error',
                                )
                            }
                        },
                        error: function (err) {
                            swal.fire(
                                'Hata!!',
                                'Hata Detayı : ' + JSON.stringify({
                                    status: err.status,
                                    description: err.statusText
                                }),
                                'error',
                            )
                        }
                    });
                }
            })
    });

    $('#despatches tbody').on('click', '#check-status a', function () { //irsaliyeleştirildi
        let data = table.row($(this).parents('tr')).data();

        $.ajax({
            type: "GET",
            url: '/despatches/checkstatus/' + data[0],
            success: function (response) {
                if (response.status) {
                    Swal.fire({
                        title: response.summary,
                        text: response.status_code + ' - '+ response.status_description,
                        icon: 'info',
                    })
                } else {
                    swal.fire(
                        'Hata!!',
                        'Hata Detayı : ' + response.message,
                        'error',
                    )
                }
            },
            error: function (err) {
                console.log(err);
                swal.fire(
                    'Hata!!',
                    'Hata Detayı : ' + JSON.stringify({
                        status: err.status,
                        description: err.statusText
                    }),
                    'error',
                )
            }
        });

    });
    
    $('#despatches tbody').on('click', '#mark-notsended a', function () {  //irsaliyeleştirildi
        let data = table.row($(this).parents('tr')).data();

        $.ajax({
            type: "GET",
            url: '/despatches/mark/notsended/' + data[0],
            success: function (response) {
                if (response.status) {
                    Swal.fire({
                        title: 'Başarılı!',
                        text: 'İrsaliye başarıyla gönderilmedi olarak işaretlendi!',
                        icon: 'success',
                    }).then((result) => {
                        location.reload();
                    });
                } else {
                    swal.fire(
                        'Hata!!',
                        'Hata Detayı : ' + JSON.stringify(response),
                        'error',
                    )
                }
            },
            error: function (err) {
                console.log(err);
                swal.fire(
                    'Hata!!',
                    'Hata Detayı : ' + JSON.stringify({
                        status: err.status,
                        description: err.statusText
                    }),
                    'error',
                )
            }
        });

    });


});