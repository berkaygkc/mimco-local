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
        'columnDefs': [
            {
                'targets': 0,
                'checkboxes': {
                    'selectRow': true
                },
                'width': '2%'
            },
            {
                "render": function ( data, type, row ) {
                    return '<b>No : </b>'+data;
                },
                'width': '10%', 'targets':1
            },
            {
                "render": function ( data, type, row ) {
                    return '<b>Ünvan : </b>'+data +' <br>'+ row[3];
                },
                'width':'45%', 'targets':2
            },
            {
                "render": function ( data, type, row ) {
                    return '<b>Fatura Tarihi : </b>'+data +' <br><b>Fatura Tutarı : </b>'+ row[5]+' '+row[6]+ ' / '+ row[7];
                },
                "targets": 4,
                'width': '25%'
            },
            {
                'visible' : false,  "targets": [ 3,5,6,7 ]
            },
            {
                'width': '8%', 'targets':8
            },
            {
                'width': '10%', 'targets':9
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


    // Handle form submission event 
    $('#list').on('submit', function (e) {

        let form = this;

        let rows_selected = table.column(0).checkboxes.selected();
        console.log(form);
        // Iterate over all selected checkboxes
        $.each(rows_selected, function (index, rowId) {
            // Create a hidden element 
            $(form).append(
                $('<input>')
                .attr('type', 'hidden')
                .attr('name', 'list')
                .val(rowId)
            );
        });

        // Prevent actual form submission
        //e.preventDefault();
    });

    $('#invoices tbody').on( 'click', '#preview', function () {
        var data = table.row( $(this).parents('tr') ).data();
        alert( data[0] +"'s salary is: "+ data[ 5 ] );
    } );

});