$(document).ready(function () {
    $.noConflict();

    const validate = () => {

        let error = "";

        const linesTable = $('#despatch-lines')[0];
        const notesTable = $('#despatch-notes')[0];
        const driversTable = $('#despatch-drivers')[0];

        let data = [];
        for (var i = 1; i < linesTable.rows.length; i++) {
            var tableRow = linesTable.rows[i];
            var rowData = {};
            for (var j = 0; j < tableRow.cells.length; j++) {
                if (j == 0) {
                    rowData['id'] = tableRow.cells[j].children[0].value;
                } else if (j == 1) {
                    rowData['name'] = tableRow.cells[j].children[0].value;
                }
                data.push(rowData);
            }
        }

        let notesData = [];
        for (var i = 1; i < notesTable.rows.length; i++) {
            var tableRow = notesTable.rows[i];
            var rowData = {};
            for (var j = 0; j < tableRow.cells.length; j++) {
                if (j == 0) {
                    rowData['Note'] = tableRow.cells[j].children[0].value;
                }
            }
            notesData.push(rowData);
        }

        let driversData = [];
        for (var i = 1; i < driversTable.rows.length; i++) {
            var tableRow = driversTable.rows[i];
            var rowData = {};
            for (var j = 0; j < tableRow.cells.length; j++) {
                if (j == 0) {
                    rowData['Name'] = tableRow.cells[j].children[0].value;
                } else if (j == 1) {
                    rowData['Surname'] = tableRow.cells[j].children[0].value;
                } else if (j == 2) {
                    rowData['NationalityID'] = tableRow.cells[j].children[0].value;
                }
            }
            driversData.push(rowData);
        }

        if (!(driversData.length > 0)) {
            error += '<li>En az 1 adet şoför girilmesi zorunludur!</li>'
        }

        const plateID = $('#plateID').val();
        const sevkIssueDate = $('#others_issuedate').val();
        const sevkIssueTime = $('#others_issuetime').val();

        if (!plateID) {
            error += '<li>Plaka girilmesi zorunludur!</li>'
        }

        if (!sevkIssueDate) {
            error += '<li>Sevk Tarihi girilmesi zorunludur!</li>'
        }

        if (!sevkIssueTime) {
            error += '<li>Sevk Saati girilmesi zorunludur!</li>'
        }

        if (error) {
            return ({
                status: false,
                message: error
            })
        } else {
            const message = {
                lines: data,
                notes: notesData,
                drivers: driversData,
                plateID,
                others: {
                    address: $('#others_address').val(),
                    district: $('#others_district').val(),
                    city: $('#others_city').val(),
                    country: $('#others_country').val(),
                    postalcode: $('#others_postalcode').val(),
                    sevkIssueDate,
                    sevkIssueTime
                },
            };
            return ({
                status: true,
                message
            })
        }
    }

    $('#add-note').click(e => {
        $('#despatch-notes tr:last')
            .after('<tr><td><input type="text" class="form-control"></td><td><button id="delete-note" type="button" class="btn btn-sm btn-danger">Sil</button></td></tr>');
    });

    $('#add-driver').click(e => {
        $('#despatch-drivers tr:last')
            .after(`<tr><td><input type="text" class="form-control"></td><td><input type="text" class="form-control"></td><td><input type="text" class="form-control"></td><td><button id="delete-driver" type="button"class="btn btn-sm btn-danger">Sil</button></td></tr>`);
    });

    $("#despatch-notes").on("click", "#delete-note", function () {
        $(this).closest("tr").remove();
    });

    $("#despatch-drivers").on("click", "#delete-driver", function () {
        $(this).closest("tr").remove();
    });

    $('#edit-form').submit((event) => {
        event.preventDefault();
        const validation = validate();
        const body = JSON.stringify(validation.message);
        if (!validation.status) {
            Swal.fire({
                title: 'Hata',
                icon: 'error',
                html: '<ul>' + validation.message + '</ul>'
            })
        } else {
            Swal.fire({
                    title: 'İrsaliyeyi kaydetmek istediğinize emin misiniz?',
                    showCancelButton: true,
                    confirmButtonText: 'Kaydet',
                    cancelButtonText: 'İptal',
                })
                .then((result) => {
                    console.log(result);
                    if (result.isConfirmed) {
                        $.ajax({
                            type: 'POST',
                            contentType: 'application/json',
                            data: body,
                            success: function (response) {
                                if (response.status) {
                                    Swal.fire({
                                        title: 'Başarılı!',
                                        text: 'İrsaliyeniz başarı ile kaydedildi!',
                                        icon: 'success',
                                    }).then((result) => {
                                        window.location.pathname = ('/despatches');
                                    });

                                } else {
                                    swal.fire(
                                        'Kaydedilirken bir hata oluştu!',
                                        'Hata Detayı : ' + JSON.stringify(response.message),
                                        'error',
                                    )
                                }
                            },
                        })
                    }
                })
        }
    });
});