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

    let table = $('#invoices').DataTable({
        'ordering': false,
        'language': {
            'url': '/libs/datatables.net/js/dataTables.tr.json'
        },
        'dom': 'ltipr',
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
                    return '<b>Fatura Tarihi : </b>' + data + ' <br><b>Fatura Tutarı : </b>' + row[5] + ' ' + row[6] + ' / ' + row[7];
                },
                "targets": 4,
                'width': '25%'
            },
            {
                'visible': false,
                "targets": [3, 5, 6, 7]
            },
            {
                'width': '8%',
                'targets': 8
            },
            {
                'width': '10%',
                'targets': 9
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
                title: 'Seçili faturaları göndermek istediğinize emin misiniz?',
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
                                    text: 'Faturalarınız gönderim için sıraya alındı!',
                                    icon: 'success',
                                }).then((result) => {
                                    window.location.pathname = ('/invoices/status');
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

    $('#invoices tbody').on('click', '#send', function () {
        let data = table.row($(this).parents('tr')).data();

        Swal.fire({
                title: data[1] + ' numaralı faturayı göndermek istediğinize emin misiniz?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: 'GET',
                        url: '/invoices/send/' + data[0],
                        success: function (response) {
                            console.log(response);
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'Faturanız gönderim için sıraya alındı!',
                                    icon: 'success',
                                }).then((result) => {
                                    window.location.pathname = ('/invoices/status');
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

    $('#invoices tbody').on('click', '#preview', function () {
        let data = table.row($(this).parents('tr')).data();
        let xml;
        let xslt;
        $.when(
            $.ajax({ // First Request
                url: '/invoices/getxml/' + data[0],
                type: 'get',
                success: function (xmls) {
                    xml = xmls;
                }
            }),

            $.ajax({ // First Request
                url: '/invoices/getxslt/' + data[0],
                type: 'get',
                success: function (xslts) {
                    xslt = xslts;
                }
            })

        ).then(function () {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(xml, "text/xml");
            xslDoc = parser.parseFromString(xslt, "text/xml");
            result = new XSLTProcessor();
            result.importStylesheet(xslDoc);
            result = result.transformToDocument(xmlDoc);
            //$('#invoiceFrame').contents().find('body').html(result);
            //html = htmls.resultData;
            var blob = new Blob([result.documentElement.innerHTML], {
                type: 'text/html'
            });
            $('#invoiceFrame').attr('src', URL.createObjectURL(blob));
        });
    });

    $("#iframe-print").on("click", function () {
        let myIframe = document.getElementById("invoiceFrame").contentWindow;
        myIframe.focus();
        myIframe.print();

        return false;
    });

    $('#invoices tbody').on('click', '#mark-sended a', function () {
        let data = table.row($(this).parents('tr')).data();

        Swal.fire({
                title: data[1] + ' numaralı faturayı gönderildi olarak işaretlemek istediğinize emin misiniz?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: '/invoices/mark/sended/' + data[0],
                        success: function (response) {
                            console.log(response);
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'Fatura başarıyla gönderildi olarak işaretlendi!',
                                    icon: 'success',
                                }).then((result) => {
                                    window.location.pathname = ('/invoices');
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

    $('#invoices tbody').on('click', '#edit-invoice a', function () {
        let data = table.row($(this).parents('tr')).data();
        window.location.pathname = ('/invoices/edit/' + data[0]);
    });

    $('#invoices tbody').on('click', '#refresh-invoice a', function () {
        let data = table.row($(this).parents('tr')).data();
        Swal.fire({
                title: data[1] + ' numaralı faturayı yenilemek istediğinize emin misiniz?',
                text: 'Faturayı yenilediğinizde entegre olunan ERP\'den fatura yeniden çekilir. Dolayısıyla fatura üzerinde yaptığınız düzenlemeler kaybolacaktır!',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: '/invoices/refresh/' + data[0],
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