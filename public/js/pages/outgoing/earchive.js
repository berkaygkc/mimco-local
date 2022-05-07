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

$(document).ready(function () {
    $.noConflict();

    $('#ldate').val(moment().format("DD.MM.YYYY"));
    $('#fdate').val(moment().subtract(14, "days").format("DD.MM.YYYY"));

    minDate = moment($('#fdate').val(), 'DD-MM-YYYY');
    maxDate = moment($('#ldate').val(), 'DD-MM-YYYY');
    searchText = $('#searchBox').val();

    VirtualSelect.init({
        ele: '#filter-select',
        multiple: true,
        options: [{
            label: 'Fatura Durumu',
            options: [{
                    label: 'Belge işleniyor',
                    value: '2001',
                    customData: 'status_codes'
                },
                {
                    label: 'Belge raporu gönderilecek',
                    value: '2007',
                    customData: 'status_codes'
                },
                {
                    label: "Belge raporu gönderildi",
                    value: '2008',
                    customData: 'status_codes'
                },
                {
                    label: 'Belge İPTAL edildi',
                    value: '2009',
                    customData: 'status_codes'
                },

            ],
        }, ],
        placeholder: 'Filtrele',
        optionsSelectedText: ' filtre seçildi.',
        search: false,
        disableSelectAll: true,
        allOptionsSelectedText: 'Hepsi'
    });

    VirtualSelect.init({
        ele: '#order-select',
        options: [{
                label: 'Eklenme Tarihi',
                value: 'received_at',
            },
            {
                label: 'Fatura Tarihi',
                value: 'issue_date',
            },
            {
                label: 'Firma Adı',
                value: 'sender_name',
            }
        ],
        hideClearButton: true,
        autoSelectFirstOption: true,
        search: false,
        disableSelectAll: true,
    });

    const filter_icons = (data) => {
        let icon;
        if (data.value == 'asc') {
            icon = 'sort-alphabetical-ascending'
        } else {
            icon = 'sort-alphabetical-descending'
        }
        const prefix = '<i class="mdi mdi-' + icon + '"></i>'
        return `${prefix} ${data.label}`;
    }

    VirtualSelect.init({
        ele: '#direction-select',
        options: [{
                label: 'Azalan',
                value: 'desc',
            },
            {
                label: 'Artan',
                value: 'asc',
            },
        ],
        hideClearButton: true,
        autoSelectFirstOption: true,
        search: false,
        disableSelectAll: true,
        labelRenderer: filter_icons,
    });

    let table = $('#invoices').DataTable({
        'language': {
            'url': '/libs/datatables.net/js/dataTables.tr.json'
        },
        'dom': '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>t<"row"<"col-sm-12 col-md-5"l><"col-sm-12 col-md-7"p>>r',
        "ordering": false,
        'columnDefs': [{
                "className": 'thStyleVT',
                'targets': 0,
                'name': 'id',
                'checkboxes': {
                    'selectRow': true
                },
                'width': '2%',
            },
            {
                "className": 'thStyleVTF',
                "render": function (data, type, row) {
                    let read = '';
                    let print = ''
                    if (data) {
                        read = `<svg title="Okunma Tarihi : ${data}" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="#02b860" d="M4,8L12,13L20,8V8L12,3L4,8V8M22,8V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V8C2,7.27 2.39,6.64 2.97,6.29L12,0.64L21.03,6.29C21.61,6.64 22,7.27 22,8Z" />
                    </svg>`
                    } else {
                        read = `<svg title="Okunmadı!" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="#f9c851" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                    </svg>`
                    }
                    if (row[2]) {
                        print = `<svg title="Yazdırılma Tarihi : ${row[2]}" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="#02b860" d="M18 7H6V3H18V7M6 21V17H2V11C2 9.34 3.34 8 5 8H19C20.66 8 22 9.34 22 11V13.81C21.12 13.3 20.1 13 19 13C17.77 13 16.64 13.37 15.69 14H8V19H13C13 19.7 13.13 20.37 13.35 21H6M18 11C18 11.55 18.45 12 19 12S20 11.55 20 11 19.55 10 19 10 18 10.45 18 11M23.5 17L22 15.5L18.5 19L16.5 17L15 18.5L18.5 22L23.5 17" />
                    </svg>`
                    } else {
                        print = `<svg title="Yazdırılmadı!" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="#f9c851" d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" />
                    </svg>`
                    }
                    return `${read}|${print}`;
                },
                'width': '7%',
                'targets': 1
            },
            {
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    let type_class;
                    switch (row[4]) {
                        case 'SATIS':
                            type_class = 'success';
                            break;
                        case 'ISTISNA':
                            type_class = 'warning';
                            break;
                        default:
                            type_class = 'info';
                            break;
                    }
                    return '<b>' + data + '</b><br><span class="badge bg-' + type_class + ' rounded-pill">' + row[4] + '</span>';
                },
                'width': '13%',
                'targets': 3
            },
            {
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    return '<b>' + data + ' ' + row[8] + '</b><br><b>Vergi : </b>' + row[7] + ' ' + row[8];
                },
                'width': '13%',
                'targets': 6
            },
            {
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    return '<b>Fatura : </b>' + moment(data.split('T')[0], 'YYYY-MM-DD').format('DD.MM.YYYY') + '<br><b>Zarf : </b>' + moment(row[10].split('T')[0], 'YYYY-MM-DD').format('DD.MM.YYYY');
                },
                'width': '15%',
                'targets': 9
            },
            {
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    let threeDot = '';
                    if (data.length > 40) {
                        threeDot = '...';
                    }
                    return '<b>' + data.substring(0, 40) + threeDot + '</b><br> <b>VKN/TCKN : </b>' + row[12];
                },
                'width': '30%',
                'targets': 11
            },
            {
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    let type_class;
                    if (row[15] == 100 && row[14] == 2009) {
                        type_class = 'danger';
                    } else if (row[15] == 100) {
                        type_class = 'success';
                    } else {
                        type_class = 'warning';
                    }
                    return '<b>' + data + '</b><div class="progress-sm"><div class="progress-bar progress-bar-striped progress-sm bg-' + type_class + '" role="progressbar" style="width: ' + row[15] + '%" aria-valuenow="' + row[15] + '" aria-valuemin="0" aria-valuemax="100"></div></div>';
                },
                'width': '23%',
                'targets': 13
            },
            {
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    let read_button = '';
                    let print_button = '';
                    let cancel_button = '';
                    if(row[14] != 2009){
                        cancel_button = '<div class="dropdown-divider"></div><div id="cancel-invoice"><a class="dropdown-item" href="#"><i class="mdi mdi-sticker-remove-outline"></i>Faturayı İptal Et</a></div>';
                    }
                    if (row[1]) {
                        read_button = `<div id="mark-unreaded"> <a class="dropdown-item" href="#">Okunmadı Olarak İşaretle</a></div>`
                    } else {
                        read_button = '<div id="mark-readed"> <a class="dropdown-item" href="#">Okundu Olarak İşaretle</a></div>'
                    }
                    if (row[2]) {
                        print_button = `<div id="mark-unprinted"><a class="dropdown-item" href="#">Yazdırılmadı Olarak İşaretle</a></div>`
                    } else {
                        print_button = '<div id="mark-printed"><a class="dropdown-item" href="#">Yazdırıldı Olarak İşaretle</a></div>'
                    }
                    let buttons = `${read_button}${print_button}`
                    return `<div class="btn-group"> <button type="button" id="preview" class="btn btn-soft-info waves-effect waves-light" title="Faturayı Önizle" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" data-bs-toggle="modal" data-bs-target="#preview-invoice-modal"> <i class="mdi mdi-magnify"></i></button><button type="button" class="btn btn-soft-warning dropdown-toggle waves-effect waves-light" title="Ek İşlemler" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" data-bs-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></button> <div class="dropdown-menu"><div id="check-status"><a class="dropdown-item" href="#">Fatura Detayları</a></div>${cancel_button}<div class="dropdown-divider"></div><div id="pdf-download"> <a class="dropdown-item" href="#"><i class="mdi mdi-file-pdf-box"></i>PDF İndir</a> </div><div id="xml-download"> <a class="dropdown-item" href="#"><i class="mdi mdi-xml"></i>XML İndir</a></div><div class="dropdown-divider"></div>${buttons}</div></div></div>`;
                },
                'targets': 16
            },
            {
                'visible': false,
                'targets': [2, 4, 5, 7, 8, 10, 12, 14, 15]
            },
        ],
        'select': {
            'style': 'multi'
        },
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/outgoing/earchive/getlist",
            "data": function (d) {
                return $.extend({}, d, {
                    search_keywords: $("#searchBox").val().toLowerCase(),
                    start_date: moment($('#fdate').val(), 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    end_date: moment($('#ldate').val(), 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    filter_array: document.querySelector('#filter-select').getSelectedOptions(),
                    order_value: document.querySelector('#order-select').value,
                    order_direction: document.querySelector('#direction-select').value,
                    read_marked: null,
                    profile_ids: null,
                    type_codes: null,
                });
            }
        }
    });

    const searchTable = () => {
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

    $('#filter-select').on('afterClose', () => {
        searchTable();
    });

    $('#filter-select').on('reset', () => {
        searchTable();
    });

    $('#order-select').on('change', () => {
        searchTable();
    });

    $('#direction-select').on('change', () => {
        searchTable();
    });

    $('#invoices tbody').on('click', '#preview', function () {
        let data = table.row($(this).parents('tr')).data();
        let html;
        $('#invoiceFrame').attr('src', '');
        $('#invoiceUUID').val('');
        uuids = [data[0]];
        value = 'true';
        mark = 'read'
        body = {
            uuids,
            value,
            mark
        }
        $.ajax({
            type: 'POST',
            url: '/outgoing/mark/archive',
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (response) {
                if (response.status) {
                    table.ajax.reload(null, false);
                    $('#invoiceUUID').val(data[0]);
                    $.ajax({
                        url: '/outgoing/earchive/export/html/' + data[0],
                        type: 'get',
                        success: function (htmls) {
                            html = htmls.resultData;
                            var blob = new Blob([html], {
                                type: 'text/html'
                            });
                            $('#invoiceFrame').attr('src', URL.createObjectURL(blob));
                        }
                    })
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    });

    $('#invoices tbody').on('click', '#pdf-download a', function () {
        let data = table.row($(this).parents('tr')).data();
        let html;
        $.ajax({
            url: '/outgoing/earchive/export/pdf/' + data[0],
            type: 'get',
            success: function (result) {
                    const linkSource = `data:application/pdf;base64,${result.content}`;
                    const downloadLink = document.createElement("a");
                    const fileName = `${data[3]}-${data[11]}.pdf`;
                    downloadLink.href = linkSource;
                    downloadLink.download = fileName;
                    downloadLink.click();
            }
        })
    });

    $('#invoices tbody').on('click', '#xml-download a', function () {
        let data = table.row($(this).parents('tr')).data();
        let html;
        $.ajax({
            url: '/outgoing/earchive/export/xml/' + data[0],
            type: 'get',
            success: function (result) {
                    const linkSource = `data:application/xml;base64,${result.content}`;
                    const downloadLink = document.createElement("a");
                    const fileName = `${data[3]}.xml`;
                    downloadLink.href = linkSource;
                    downloadLink.download = fileName;
                    downloadLink.click();
            }
        })
    });

    $('#invoices tbody').on('click', '#check-status a', function () {
        let data = table.row($(this).parents('tr')).data();
        $.ajax({
            url: '/outgoing/earchive/status/' + data[0],
            type: 'get',
            success: function (response) {
                if (response.resultCode) {
                    Swal.fire({
                        title: response.resultData.summary,
                        text: JSON.stringify(response.resultData, null, 4),
                        icon: 'info',
                    })
                } else {
                    swal.fire(
                        'Hata!!',
                        'Hata Detayı : ' + response,
                        'error',
                    )
                }
            }
        })
    });

    $('#invoices tbody').on('click', '#cancel-invoice a', function () {
        let data = table.row($(this).parents('tr')).data();
        Swal.fire({
                title: data[3] + ' numaralı faturayı iptal etmek istediğinize emin misiniz?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: 'GET',
                        url: '/outgoing/earchive/cancel/'+ data[0],
                        success: function (response) {
                            if (response.resultCode == 204) {
                                table.ajax.reload(null, false);
                                swal.fire(
                                    'Başarılı',
                                    'Fatura iptali başarılı!',
                                    'success',
                                )
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

    $('#invoices tbody').on('click', '#mark-unreaded a', function () {
        let data = table.row($(this).parents('tr')).data();
        Swal.fire({
                title: data[3] + ' numaralı faturayı okunmadı olarak işaretlemek istediğinize emin misiniz?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    uuids = [data[0]];
                    value = 'false';
                    mark = 'read'
                    body = {
                        uuids,
                        value,
                        mark
                    }
                    $.ajax({
                        type: 'POST',
                        url: '/outgoing/mark/archive',
                        data: JSON.stringify(body),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        success: function (response) {
                            if (response.status) {
                                table.ajax.reload(null, false);
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

    $('#invoices tbody').on('click', '#mark-readed a', function () {
        let data = table.row($(this).parents('tr')).data();
        Swal.fire({
                title: data[3] + ' numaralı faturayı okundu olarak işaretlemek istediğinize emin misiniz?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    uuids = [data[0]];
                    value = 'true';
                    mark = 'read'
                    body = {
                        uuids,
                        value,
                        mark
                    }
                    $.ajax({
                        type: 'POST',
                        url: '/outgoing/mark/archive',
                        data: JSON.stringify(body),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        success: function (response) {
                            if (response.status) {
                                table.ajax.reload(null, false);
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

    $('#invoices tbody').on('click', '#mark-unprinted a', function () {
        let data = table.row($(this).parents('tr')).data();
        Swal.fire({
                title: data[3] + ' numaralı faturayı yazdırılmadı olarak işaretlemek istediğinize emin misiniz?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    uuids = [data[0]];
                    value = 'false';
                    mark = 'erp'
                    body = {
                        uuids,
                        value,
                        mark
                    }
                    $.ajax({
                        type: 'POST',
                        url: '/outgoing/mark/archive',
                        data: JSON.stringify(body),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        success: function (response) {
                            table.ajax.reload(null, false);
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

    $('#invoices tbody').on('click', '#mark-printed a', function () {
        let data = table.row($(this).parents('tr')).data();
        Swal.fire({
                title: data[3] + ' numaralı faturayı yazdırıldı olarak işaretlemek istediğinize emin misiniz?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    uuids = [data[0]];
                    value = 'true';
                    mark = 'erp'
                    body = {
                        uuids,
                        value,
                        mark
                    }
                    $.ajax({
                        type: 'POST',
                        url: '/outgoing/mark/archive',
                        data: JSON.stringify(body),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        success: function (response) {
                            if (response.status) {
                                table.ajax.reload(null, false);
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

    $("#iframe-print").on("click", function () {
        let myIframe = document.getElementById("invoiceFrame").contentWindow;
        uuids = [$('#invoiceUUID').val()];
        value = 'true';
        mark = 'erp'
        body = {
            uuids,
            value,
            mark
        }
        $.ajax({
            type: 'POST',
            url: '/outgoing/mark/archive',
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (response) {
                table.ajax.reload(null, false);
                myIframe.focus();
                myIframe.print();
            },
            error: function (err) {
                console.log(err);
            }
        });

    });
});