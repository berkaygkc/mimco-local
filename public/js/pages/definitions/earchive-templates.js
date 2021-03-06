const previewArchive = (type, id) => {
    let xml;
    let xslt;
    $('#invoiceFrame').attr('src', '');
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
        $('#invoiceFrame').attr('src', URL.createObjectURL(blob));
    });
}
$(document).ready(function () {
    let eArchiveTable = $('#earchive').DataTable({
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
                        text = 'Varsay??lan';
                    } else {
                        icon = 'sticker-remove-outline';
                        color = 'text-danger';
                        text = 'Varsay??lan De??il'
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
                    let buttons = '<div id="download"><a class="dropdown-item" href="#"><i class="mdi mdi-download"></i>??ndir</a></div><div id="delete"><a class="dropdown-item" href="#"><i class="mdi mdi-delete"></i>Sil</a></div>';
                    if (!row.default && row.active) {
                        buttons += `<div id="be-default"><a class="dropdown-item" href="#"><i class="mdi mdi-check"></i>Varsay??lan Yap</a></div>`
                    }
                    if (row.active && !row.default) {
                        buttons += `<div id="deactivate"><a class="dropdown-item" href="#"><i class="mdi mdi-close"></i>Pasif Et</a></div>`
                    }
                    if (!row.active) {
                        buttons += `<div id="activate"><a class="dropdown-item" href="#"><i class="mdi mdi-check"></i>Aktif Et</a></div>`
                    }
                    const html = `<div class="btn-group">
                    <button type="button" class="btn btn-soft-success dropdown-toggle waves-effect waves-light" title="??nizleme" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" data-bs-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-magnify"></i></button><div class="dropdown-menu">
                    <div id="preview-default"><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#preview-invoice-modal">Normal</a></div>
                    <div id="preview-iskonto"><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#preview-invoice-modal">??skontolu</a></div>
                    </div><button type="button" class="btn btn-soft-warning dropdown-toggle waves-effect waves-light" title="????lemler" tabindex="0" data-plugin="tippy" data-tippy-placement="bottom" data-bs-toggle="dropdown" aria-expanded="false"><i class="mdi mdi-dots-horizontal"></i></button><div class="dropdown-menu">${buttons}</div>
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
            "url": "/definitions/templates/2",
        }
    });

    $('#earchive tbody').on('click', '#download', function () {
        let data = eArchiveTable.row($(this).parents('tr')).data();
        window.open(
            `/downloads/template/${data.id}`,
            '_blank'
        );
    });

    $('#earchive tbody').on('click', '#delete', function () {
        let data = eArchiveTable.row($(this).parents('tr')).data();
        Swal.fire({
                title: `${data.name} ??ablonunu silmek istedi??inize emin misiniz?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hay??r`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: `/definitions/templates/delete/${data.id}`,
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Ba??ar??l??!',
                                    text: '??lgili ??ablon ba??ar?? ile silindi!',
                                    icon: 'success',
                                }).then((result) => {
                                    location.reload();
                                });
                            } else {
                                swal.fire(
                                    'Hata!!',
                                    'Hata Detay?? : ' + response.message,
                                    'error',
                                )
                            }
                        },
                        error: function (err) {
                            console.log(err);
                            swal.fire(
                                'Hata!!',
                                'Hata Detay?? : ' + JSON.stringify({
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

    $('#earchive tbody').on('click', '#be-default', function () {
        let data = eArchiveTable.row($(this).parents('tr')).data();
        Swal.fire({
                title: `${data.name} ??ablonunu varsay??lan yapmak istedi??inize emin misiniz?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hay??r`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: `/definitions/templates/2/default/${data.id}`,
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Ba??ar??l??!',
                                    text: '??lgili ??ablon ba??ar?? ile varsay??lan yap??ld??!',
                                    icon: 'success',
                                }).then((result) => {
                                    location.reload();
                                });
                            } else {
                                swal.fire(
                                    'Hata!!',
                                    'Hata Detay?? : ' + response.message,
                                    'error',
                                )
                            }
                        },
                        error: function (err) {
                            console.log(err);
                            swal.fire(
                                'Hata!!',
                                'Hata Detay?? : ' + JSON.stringify({
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
                title: `${data.name} ??ablonunu aktif etmek istedi??inize emin misiniz?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hay??r`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: `/definitions/templates/2/activate/${data.id}`,
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Ba??ar??l??!',
                                    text: '??lgili ??ablon ba??ar?? ile aktif edildi!',
                                    icon: 'success',
                                }).then((result) => {
                                    location.reload();
                                });
                            } else {
                                swal.fire(
                                    'Hata!!',
                                    'Hata Detay?? : ' + response.message,
                                    'error',
                                )
                            }
                        },
                        error: function (err) {
                            console.log(err);
                            swal.fire(
                                'Hata!!',
                                'Hata Detay?? : ' + JSON.stringify({
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
                title: `${data.name} ??ablonunu pasif etmek istedi??inize emin misiniz?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `Evet`,
                cancelButtonText: `Hay??r`,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "GET",
                        url: `/definitions/templates/2/deactivate/${data.id}`,
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Ba??ar??l??!',
                                    text: '??lgili ??ablon ba??ar?? ile pasif edildi!',
                                    icon: 'success',
                                }).then((result) => {
                                    location.reload();
                                });
                            } else {
                                swal.fire(
                                    'Hata!!',
                                    'Hata Detay?? : ' + response.message,
                                    'error',
                                )
                            }
                        },
                        error: function (err) {
                            console.log(err);
                            swal.fire(
                                'Hata!!',
                                'Hata Detay?? : ' + JSON.stringify({
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

    $('#earchive tbody').on('click', '#preview-default', function () {
        let data = eArchiveTable.row($(this).parents('tr')).data();
        previewInvoice('default.xml', data.id);
    });

    $('#earchive tbody').on('click', '#preview-ihracat', function () {
        let data = eArchiveTable.row($(this).parents('tr')).data();
        previewInvoice('ihracat.xml', data.id);
    });

    $('#earchive tbody').on('click', '#preview-iskonto', function () {
        let data = eArchiveTable.row($(this).parents('tr')).data();
        previewInvoice('iskonto.xml', data.id);
    });

    $("#iframe-print").on("click", function () {
        let myIframe = document.getElementById("invoiceFrame").contentWindow;
        myIframe.focus();
        myIframe.print();

        return false;
    });

    $("#upload-earchive-template").click(() => {
        let name = $('#earchive-template-name').val();
        let file = $('#earchiveTemplateFile').val();
        console.log(name, file)
        if (name == undefined || name == null || name == '' || file == undefined || file == null || file == '') {
            Swal.fire({
                title: `T??m alanlar?? doldurunuz!`,
                icon: 'error',
                confirmButtonText: `Tamam`,
            })
        } else {
            var formdata = new FormData();
            formdata.append("name", name)
            formdata.append("template", earchiveTemplateFile.files[0]);

            var requestOptions = {
                method: 'POST',
                body: formdata
            };

            fetch("/uploads/template/2", requestOptions)
                .then(response => response.text())
                .then(result => {
                    const res = JSON.parse(result);
                    if (res.status) {
                        Swal.fire({
                                title: `e-Ar??iv Fatura ??ablonu ba??ar??yla eklendi.`,
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