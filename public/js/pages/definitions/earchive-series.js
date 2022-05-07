$(document).ready(function () {
    let eArchiveTable = $('#earchive').DataTable({
        'language': {
            'url': '/libs/datatables.net/js/dataTables.tr.json'
        },
        'columns': [{
                data: "serie"
            },
            {
                data: "serial"
            },
            {
                data: "default"
            },
            {
                data: "active"
            },
            {
                data: "action"
            }
        ],
        'columnDefs': [{
                "targets": 2,
                "render": function (data, type, row) {
                    let icon;
                    let color;
                    let text;
                    if (data) {
                        icon = 'sticker-check-outline';
                        color = 'text-success';
                        text = 'Varsayılan';
                    } else {
                        icon = 'sticker-remove-outline';
                        color = 'text-danger';
                        text = 'Varsayılan Değil'
                    }
                    return '<i class="mdi mdi-' + icon + ' ' + color + '"></i><b class="' + color + '"> ' + text + '</b>';
                },

            },
            {
                "targets": 3,
                "render": function (data, type, row) {
                    let icon;
                    let color;
                    let text;
                    if (data) {
                        icon = 'sticker-check-outline';
                        color = 'text-success';
                        text = 'Aktif';
                    } else {
                        icon = 'sticker-remove-outline';
                        color = 'text-danger';
                        text = 'Pasif'
                    }
                    return '<i class="mdi mdi-' + icon + ' ' + color + '"></i><b class="' + color + '"> ' + text + '</b>';
                },

            },
            {
                "render": function (data, type, row) {
                    let buttons = '';
                    if (!row.default && row.active) {
                        buttons += `<div id="be-default"><a class="dropdown-item" href="#"><i class="mdi mdi-check"></i>Varsayılan Yap</a></div>`
                    }
                    if (row.active && !row.default) {
                        buttons += `<div id="deactivate"><a class="dropdown-item" href="#"><i class="mdi mdi-close"></i>Pasif Et</a></div>`
                    }
                    if (!row.active) {
                        buttons += `<div id="activate"><a class="dropdown-item" href="#"><i class="mdi mdi-check"></i>Aktif Et</a></div>`
                    }
                    const html = `<div class="btn-group"><button type="button" class="btn btn-soft-warning dropdown-toggle waves-effect waves-light" title="İşlemler" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" data-bs-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></button><div class="dropdown-menu">${buttons}</div></div>`
                    return html;
                },
                'targets': 4,
                'width': '3%'
            },
        ],
        'dom': 't<"row"<"col-sm-12 col-md-5"i>>',
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/definitions/series/2",
        }
    });

    $('#earchive tbody').on('click', '#be-default', function () {
        let data = eArchiveTable.row($(this).parents('tr')).data();
        Swal.fire({
                title: `${data.serie} serisini varsayılan yapmak istediğinize emin misiniz?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: `/definitions/series/2/default/${data.serie}`,
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'İlgili seri başarı ile varsayılan yapıldı!',
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

    $('#earchive tbody').on('click', '#activate', function () {
        let data = eArchiveTable.row($(this).parents('tr')).data();
        Swal.fire({
                title: `${data.serie} serisini aktif etmek istediğinize emin misiniz?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: `/definitions/series/2/activate/${data.serie}`,
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'İlgili seri başarı ile aktif edildi!',
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

    $('#earchive tbody').on('click', '#deactivate', function () {
        let data = eArchiveTable.row($(this).parents('tr')).data();
        Swal.fire({
                title: `${data.serie} serisini pasif etmek istediğinize emin misiniz?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: `/definitions/series/2/deactivate/${data.serie}`,
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'İlgili seri başarı ile pasif edildi!',
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
    $('#new-earchive-serie').click((e) => {
        Swal.fire({
            title: "Yeni e-Arşiv Fatura serinizi giriniz!",
            input: "text",
            inputAttributes: {
                autocapitalize: "characters",
                maxlength: 3,
                pattern:"[a-zA-Z0-9-]+"
            },
            showCancelButton: true,
            confirmButtonText: "Ekle",
            cancelButtonText: "İptal",
            showLoaderOnConfirm: true,
            preConfirm: (serie) => {
                return fetch('/definitions/series/2/add/' + serie)
                    .then((response) => {
                        if (!response.status) {
                            throw new Error(response.message);
                        }
                        return response.json();
                    })
                    .catch((error) => {
                        Swal.showValidationMessage(`Ekleme hatası: ${error}`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Başarılı",
                    text: "e-Arşiv Fatura serisi başarı ile eklendi.",
                })
                .then(result => {
                    location.reload();
                })
            }
        });

    })

});