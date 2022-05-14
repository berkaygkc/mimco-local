const previewDespatch = (type, id) => {
    let xml;
    let xslt;
    $('#despatchFrame').attr('src', '');
    $.when(
        $.ajax({
            url: `/definitions/templates/xml?param=${type}`,
            type: 'get',
            success: function (xmls) {
                xml = xmls;
            }
        }),

        $.ajax({
            url: '/definitions/templates/detail/' + id,
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
        $('#despatchFrame').attr('src', URL.createObjectURL(blob));
    });
}
$(document).ready(function () {
    let eDespatchTable = $('#edespatch').DataTable({
        'language': {
            'url': '/libs/datatables.net/js/dataTables.tr.json'
        },
        'columns': [{
                data: "id"
            },
            {
                data: "name"
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
                targets: 1,
                width: '40%'
            },
            {
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
                    let buttons = '<div id="download"><a class="dropdown-item" href="#"><i class="mdi mdi-download"></i>İndir</a></div><div id="delete"><a class="dropdown-item" href="#"><i class="mdi mdi-delete"></i>Sil</a></div>';
                    if (!row.default && row.active) {
                        buttons += `<div id="be-default"><a class="dropdown-item" href="#"><i class="mdi mdi-check"></i>Varsayılan Yap</a></div>`
                    }
                    if (row.active && !row.default) {
                        buttons += `<div id="deactivate"><a class="dropdown-item" href="#"><i class="mdi mdi-close"></i>Pasif Et</a></div>`
                    }
                    if (!row.active) {
                        buttons += `<div id="activate"><a class="dropdown-item" href="#"><i class="mdi mdi-check"></i>Aktif Et</a></div>`
                    }
                    const html = `<div class="btn-group">
                    <button type="button" class="btn btn-soft-success dropdown-toggle waves-effect waves-light" title="Önizleme" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" data-bs-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-magnify"></i></button><div class="dropdown-menu">
                    <div id="preview-default"><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#preview-despatch-modal">Normal</a></div>
                    </div><button type="button" class="btn btn-soft-warning dropdown-toggle waves-effect waves-light" title="İşlemler" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" data-bs-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></button><div class="dropdown-menu">${buttons}</div>
                    </div>`
                    return html;
                },
                'targets': 4,
                'width': '8%'
            },
            {
                targets: 0,
                visible: false
            }
        ],
        'dom': 't<"row"<"col-sm-12 col-md-5"i>>',
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/definitions/templates/3",
        }
    });

    $('#edespatch tbody').on('click', '#download', function () {
        let data = eDespatchTable.row($(this).parents('tr')).data();
        window.open(
            `/downloads/template/${data.id}`,
            '_blank'
        );
    });

    $('#edespatch tbody').on('click', '#delete', function () {
        let data = eDespatchTable.row($(this).parents('tr')).data();
        Swal.fire({
                title: `${data.name} şablonunu silmek istediğinize emin misiniz?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: `/definitions/templates/delete/${data.id}`,
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'İlgili şablon başarı ile silindi!',
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

    $('#edespatch tbody').on('click', '#be-default', function () {
        let data = eDespatchTable.row($(this).parents('tr')).data();
        Swal.fire({
                title: `${data.name} şablonunu varsayılan yapmak istediğinize emin misiniz?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: `/definitions/templates/3/default/${data.id}`,
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'İlgili şablon başarı ile varsayılan yapıldı!',
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

    $('#edespatch tbody').on('click', '#activate', function () {
        let data = eDespatchTable.row($(this).parents('tr')).data();
        Swal.fire({
                title: `${data.name} şablonunu aktif etmek istediğinize emin misiniz?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: `/definitions/templates/3/activate/${data.id}`,
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'İlgili şablon başarı ile aktif edildi!',
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

    $('#edespatch tbody').on('click', '#deactivate', function () {
        let data = eDespatchTable.row($(this).parents('tr')).data();
        Swal.fire({
                title: `${data.name} şablonunu pasif etmek istediğinize emin misiniz?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hayır`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: `/definitions/templates/3/deactivate/${data.id}`,
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Başarılı!',
                                    text: 'İlgili şablon başarı ile pasif edildi!',
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

    $('#edespatch tbody').on('click', '#preview-default', function () {
        let data = eDespatchTable.row($(this).parents('tr')).data();
        previewDespatch('despatch.xml', data.id);
    });

    $("#iframe-print").on("click", function () {
        let myIframe = document.getElementById("despatchFrame").contentWindow;
        myIframe.focus();
        myIframe.print();

        return false;
    });

    $("#upload-edespatch-template").click(() => {
        let name = $('#edespatch-template-name').val();
        let file = $('#edespatchTemplateFile').val();
        console.log(name, file)
        if (name == undefined || name == null || name == '' || file == undefined || file == null || file == '') {
            Swal.fire({
                title: `Tüm alanları doldurunuz!`,
                icon: 'error',
                confirmButtonText: `Tamam`,
            })
        } else {
            var formdata = new FormData();
            formdata.append("name", name)
            formdata.append("template", edespatchTemplateFile.files[0]);

            var requestOptions = {
                method: 'POST',
                body: formdata
            };

            fetch("/uploads/template/3", requestOptions)
                .then(response => response.text())
                .then(result => {
                    const res = JSON.parse(result);
                    if (res.status) {
                        Swal.fire({
                                title: `e-İrsaliye şablonu başarıyla eklendi.`,
                                icon: 'success',
                                confirmButtonText: `Tamam`,
                            })
                            .then(result => {
                                location.reload();
                            })
                    } else {
                        console.log(res);
                        Swal.fire({
                            title: `${res.message}`,
                            icon: 'error',
                            confirmButtonText: `Tamam`,
                        })
                    }
                })
                .catch(error => {
                    console.log('error', error)
                    Swal.fire({
                        title: `${error}`,
                        icon: 'error',
                        confirmButtonText: `Tamam`,
                    })
                });
        }
    })
});