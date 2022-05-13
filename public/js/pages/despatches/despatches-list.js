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

let minDate, maxDate, searchText;

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {

        let searchKey = new RegExp(searchText, 'i')
        let min = minDate._d;
        let max = maxDate._d;
        let date = moment(data[4].split(' ')[3], 'DD-MM-YYYY')._d;
        let text = data[2];

        if (
            (
                (min === null && max === null) ||
                (min === null && date <= max) ||
                (min <= date && max === null) ||
                (min <= date && date <= max)) &&
            text.search(searchKey) > -1
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
                'checkboxes': {
                    'selectRow': true
                },
                'width': '2%'
            },
            {
                "render": function (data, type, row) {
                    return '<b>No : </b>' + data;
                },
                'width': '10%',
                'targets': 1
            },
            {
                "render": function (data, type, row) {
                    return '<b>Ünvan : </b>' + data + ' <br>' + row[3];
                },
                'width': '45%',
                'targets': 2
            },
            {
                "render": function (data, type, row) {
                    return '<b>İrsaliye Tarihi : </b>' + data;
                },
                "targets": 4,
                'width': '25%'
            },
            {
                'visible': false,
                "targets": [3]
            },
            {
                'width': '10%',
                'targets': 5
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
        table.draw();
    }

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


    $('#list').on('submit', function (e) {

        e.preventDefault();

        var form = $(this);
        var actionUrl = form.attr('action');

        Swal.fire({
                title: 'Seçili irsaliyeleri göndermek istediğinize emin misiniz?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {

                    let rows_selected = table.column(0).checkboxes.selected();
                    // Iterate over all selected checkboxes
                    $.each(rows_selected, function (index, rowId) {
                        // Create a hidden element 
                        form.append(
                            $('<input>')
                            .attr('type', 'hidden')
                            .attr('name', 'list')
                            .val(rowId)
                        );
                    });

                    $.ajax({
                        type: "POST",
                        url: actionUrl,
                        data: form.serialize(),
                        success: function (response) {
                            console.log(response);
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'İrsaliyeleriniz gönderim için sıraya alındı!',
                                    icon: 'success',
                                }).then((result) => {
                                    window.location.pathname = ('/despatches/status');
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
                }
            })
    });

    $('#despatches tbody').on('click', '#send', function () {
        let data = table.row($(this).parents('tr')).data();

        Swal.fire({
                title: data[1] + ' numaralı irsaliyeyi göndermek istediğinize emin misiniz?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                   /* $.ajax({
                        type: 'GET',
                        url: '/despatches/checklines/' + data[0],
                        success: function (response) {
                            if (response.status) {
                               
                            } else {
                                Swal.fire({
                                        title: response.message,
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonText: `Evet`,
                                        cancelButtonText: `Hayır`,
                                    })
                                    .then((result) => {
                                        if (result.isConfirmed) {
                                            $.ajax({
                                                type: 'GET',
                                                url: '/despatches/send/' + data[0],
                                                success: function (response) {
                                                    if (response.status) {
                                                        Swal.fire({
                                                            title: 'Başarılı!',
                                                            text: 'İrsaliyeniz gönderim için sıraya alındı!',
                                                            icon: 'success',
                                                        }).then((result) => {
                                                            window.location.pathname = ('/despatches/status');
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
                                        }
                                    })
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

                    });*/

                    $.ajax({
                        type: 'GET',
                        url: '/despatches/send/' + data[0],
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'İrsaliyeniz gönderim için sıraya alındı!',
                                    icon: 'success',
                                }).then((result) => {
                                    window.location.pathname = ('/despatches/status');
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
                }
            })
    });

    $('#despatches tbody').on('click', '#preview', function () { //irsaliyeleştirildi
        let data = table.row($(this).parents('tr')).data();
        $('#invoiceFrame').attr('src', '');
        let xml;
        let xslt;
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
            if (typeof xml == 'string') {
                xmlDoc = parser.parseFromString(xml, "application/xml");
            } else {
                xmlDoc = xml;
            }
            console.log(xmlDoc);
            if (typeof xslt == 'string') {
                xslDoc = parser.parseFromString(xslt, "application/xml");
            } else {
                xslDoc = xslt;
            }
            processor = new XSLTProcessor();
            processor.importStylesheet(xslDoc);
            result = processor.transformToDocument(xmlDoc);
            var blob = new Blob([new XMLSerializer().serializeToString(result.doctype), result.documentElement.innerHTML], {
                type: "text/html"
            })
            $('#invoiceFrame').attr('src', URL.createObjectURL(blob));
        });
    });

    $("#iframe-print").on("click", function () {
        let myIframe = document.getElementById("invoiceFrame").contentWindow;
        myIframe.focus();
        myIframe.print();

        return false;
    });

    $('#despatches tbody').on('click', '#mark-sended a', function () { //İrsaliyeleştirildi
        let data = table.row($(this).parents('tr')).data();

        Swal.fire({
                title: data[1] + ' numaralı irsaliyeyi gönderildi olarak işaretlemek istediğinize emin misiniz?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: '/despatches/mark/sended/' + data[0],
                        success: function (response) {
                            console.log(response);
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'İrsaliye başarıyla gönderildi olarak işaretlendi!',
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
                }
            })
    });

    $('#despatches tbody').on('click', '#edit-despatch a', function () {
        let data = table.row($(this).parents('tr')).data();
        window.location.pathname = ('/despatches/edit/' + data[0]);
    });

    $('#despatches tbody').on('click', '#refresh-despatch a', function () {
        let data = table.row($(this).parents('tr')).data();
        Swal.fire({
                title: data[1] + ' numaralı irsaliyeyi yenilemek istediğinize emin misiniz?',
                text: 'İrsaliyeyi yenilediğinizde entegre olunan ERP\'den irsaliye yeniden çekilir. Dolayısıyla irsaliye üzerinde yaptığınız düzenlemeler kaybolacaktır!',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: '/despatches/refresh/' + data[0],
                        success: function (response) {
                            console.log(response);
                            if (response) {
                                location.reload();
                            } else {
                                swal.fire(
                                    'Hata!',
                                    'Hata Detayı : ' + response.message,
                                    'error',
                                )
                            }
                        },
                        error: function (err) {
                            console.log(err);
                            swal.fire(
                                'Hata!',
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
});