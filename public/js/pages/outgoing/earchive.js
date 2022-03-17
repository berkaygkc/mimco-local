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
            },
        ],
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
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    let type_class;
                    switch (row[2]) {
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
                    return '<b>' + data + '</b><br><span class="badge bg-' + type_class + ' rounded-pill">' + row[2] + '</span> / <span class="badge badge-outline-secondary">' + row[3] + '</span>';
                },
                'width': '13%',
                'targets': 1
            },
            {
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    return '<b>' + data + ' ' + row[6] + '</b><br><b>Vergi : </b>' + row[5] + ' ' + row[6];
                },
                'width': '13%',
                'targets': 4
            },
            {
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    return '<b>Fatura Tarihi : </b>' + moment(data.split('T')[0], 'YYYY-MM-DD').format('DD.MM.YYYY') + '<br><b>Zarf Tarihi : </b>' + moment(row[8].split('T')[0], 'YYYY-MM-DD').format('DD.MM.YYYY');
                },
                'width': '15%',
                'targets': 7
            },
            {
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    let threeDot = '';
                    if (data.length > 40) {
                        threeDot = '...';
                    }
                    return '<b>' + data.substring(0, 40) + threeDot + '</b><br> <b>VKN/TCKN : </b>' + row[10];
                },
                'width': '30%',
                'targets': 9
            },
            {
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    let type_class;
                    if (row[13] == 100 && row[12] == 2009) {
                        type_class = 'danger';
                    } else if (row[13] == 100) {
                        type_class = 'success';
                    } else {
                        type_class = 'warning';
                    }
                    return '<b>' + data + '</b><div class="progress-sm"><div class="progress-bar progress-bar-striped progress-sm bg-' + type_class + '" role="progressbar" style="width: ' + row[13] + '%" aria-valuenow="' + row[13] + '" aria-valuemin="0" aria-valuemax="100"></div></div>';
                },
                'width': '23%',
                'targets': 11
            },
            {
                "className": 'thStyleV',
                "render": function (data, type, row) {
                    return '<div class="btn-group"> <button type="button" id="preview" class="btn btn-soft-info waves-effect waves-light" title="Faturayı Önizle" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" data-bs-toggle="modal" data-bs-target="#preview-invoice-modal"> <i class="mdi mdi-magnify"></i> </button><div class="btn-group"> <button type="button" class="btn btn-soft-success dropdown-toggle waves-effect waves-light" title="Faturayı İndir" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" data-bs-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-download"></i> </button> <div class="dropdown-menu"><div id="pdf-download"> <a class="dropdown-item" href="#">PDF</a> </div><div id="xml-download"> <a class="dropdown-item" href="#">XML</a> </div></div></div><div class="btn-group"> <button type="button" class="btn btn-soft-warning dropdown-toggle waves-effect waves-light" title="Ek İşlemler" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" data-bs-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i> </button> <div class="dropdown-menu"></div></div></div>';
                },
                'targets': 14
            },
            {
                'visible': false,
                'targets': [2, 3, 5, 6, 8, 10, 12, 13]
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
        $.ajax({
            url: '/outgoing/earchive/export/html/' + data[0],
            type: 'get',
            success: function (htmls) {
                html = htmls.resultData;
                var blob = new Blob([html], {type: 'text/html'});
                console.log(blob)
                //var iframe = document.querySelector("invoiceFrame");
                //iframe.src = URL.createObjectURL(blob);
                $('#invoiceFrame').attr('src',URL.createObjectURL(blob));
            }
        })

    });

    /*$('#invoices tbody').on('click', '#pdf-download a', function () {
        let data = table.row($(this).parents('tr')).data();
        let html;
        $.ajax({
            url: '/outgoing/einvoice/export/pdf/' + data[0],
            type: 'get',
            responseType: 'blob',
            success: function (data) {
                console.log(data.resultData);
                var blob = new Blob([data.resultData], {type: 'application/pdf'});
                console.log(URL.createObjectURL(blob));
            }
        })
    });*/

    
    $("#iframe-print").on("click", function () {
        let myIframe = document.getElementById("invoiceFrame").contentWindow;
        myIframe.focus();
        myIframe.print();

        return false;
    });
});