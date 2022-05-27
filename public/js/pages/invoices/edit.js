var editor;

$(document).ready(function () {
    $.noConflict();
    VirtualSelect.init({
        ele: '#invoice-profile-select',
        options: [{
                label: 'Temel Fatura',
                value: 'TEMELFATURA',
            },
            {
                label: 'Ticari Fatura',
                value: 'TICARIFATURA',
            },
            {
                label: "İhracat Faturası",
                value: 'IHRACAT',
            },
            {
                label: "e-Arşiv Fatura",
                value: "EARSIVFATURA"
            }
        ],
        placeholder: 'Profil',
        search: false,
        hideClearButton: true
    });
    VirtualSelect.init({
        ele: '#invoice-type-select',
        options: [{
                label: 'Satış Faturası',
                value: 'SATIS',
            },
            {
                label: 'İade Faturası',
                value: 'IADE',
            },
            {
                label: "İstisna Faturası",
                value: 'ISTISNA',
            }
        ],
        placeholder: 'Tip',
        search: false,
        hideClearButton: true
    });
    VirtualSelect.init({
        ele: '#export-termcode-select',
        options: [{
                label: 'CFR - Masraflar ve Navlun',
                value: 'CFR',
            },
            {
                label: 'CIP	Taşıma ve Sigorta Ücreti',
                value: 'CIP',
            },
            {
                label: "DAF	Sınırdan Teslim",
                value: 'DAF',
            },
            {
                label: "DDU	Ödenmeyen Gümrük Ücreti",
                value: 'DDU',
            },
            {
                label: "DES	Gemiden Teslim",
                value: 'DES',
            },
            {
                label: "FAS	Gemide Ücretsiz",
                value: 'FAS',
            },
            {
                label: "FOB	Güvertede Teslim",
                value: 'FOB',
            },
            {
                label: "DAT	Terminalde Teslim",
                value: 'DAT',
            },
            {
                label: "CIF	Masraflar, Sigorta ve Navlun",
                value: 'CIF',
            },
            {
                label: "CPT	Ödenen Taşıma Ücreti",
                value: 'CPT',
            },
            {
                label: "DDP	Ödenen Gümrük Ücreti",
                value: 'DDP',
            },
            {
                label: "DEQ	Rıhtımdan Teslim",
                value: 'DEQ',
            },
            {
                label: "EXW	Fabrikadan Teslim",
                value: 'EXW',
            },
            {
                label: "FCA	Ücretsiz Taşıma",
                value: 'FCA',
            },
            {
                label: "DAP	Belirlenen Yerde Teslim",
                value: 'DAP',
            }
        ],
        placeholder: 'Teslim Şartı',
        search: true,
        searchPlaceholderText: "Ara..",
        hideClearButton: true
    });
    VirtualSelect.init({
        ele: '#export-transportmode-select',
        options: [{
                label: 'Deniz Taşımacılığı',
                value: '1',
            },
            {
                label: 'Demiryolu Taşımacılığı',
                value: '2',
            },
            {
                label: 'Karayolu Taşımacılığı',
                value: '3',
            },
            {
                label: 'Hava Taşımacılığı',
                value: '4',
            },
            {
                label: 'Posta',
                value: '5',
            },
            {
                label: 'Kombine Taşımacılık',
                value: '6',
            },
            {
                label: 'Sabit Nakliyat',
                value: '7',
            },
            {
                label: 'Ülke İçi Su Taşımacılığı',
                value: '8',
            },
            {
                label: 'Uygun Olmayan Taşıma Şekli',
                value: '9',
            }
        ],
        placeholder: 'Gönderim Şekli',
        search: true,
        searchPlaceholderText: "Ara..",
        hideClearButton: true
    });
    VirtualSelect.init({
        ele: '#kdv-muaf-select',
        options: [{
                "label": "201 - 17/1 Kültür ve eğitim amacı taşıyan işlemler",
                "value": 201
            },
            {
                "label": "202 - 17/2-a Sağlık, çevre ve sosyal yardım amaçlı işlemler",
                "value": 202
            },
            {
                "label": "204 - 17/2-c Yabancı diplomatik organ ve hayır kurumlarının bağışlarıyla ilgili mal ve hizmet alışları",
                "value": 204
            },
            {
                "label": "205 - 17/2-d Taşınmaz kültür varlıklarına ilişkin teslimler ve mimarlık hizmetleri",
                "value": 205
            },
            {
                "label": "206 - 17/2-e Mesleki kuruluşların işlemleri",
                "value": 206
            },
            {
                "label": "207 - 17/3 Askeri fabrika",
                "value": 207
            },
            {
                "label": "208 - 17/4-c Birleşme, devir, dönüşüm ve bölünme işlemleri",
                "value": 208
            },
            {
                "label": "209 - 17/4-e Banka ve sigorta muameleleri vergisi kapsamına giren işlemler",
                "value": 209
            },
            {
                "label": "211 - 17/4-h Zirai amaçlı veya köy tüzel kişiliklerince yapılan içme suyu teslimleri",
                "value": 211
            },
            {
                "label": "212 - 17/4-ı Serbest bölgelerde verilen hizmetler",
                "value": 212
            },
            {
                "label": "213 - 17/4-j Boru hattı ile yapılan petrol ve gaz taşımacılığı",
                "value": 213
            },
            {
                "label": "214 - 17/4-k Sanayi bölgelerindeki arsa ve işyeri teslimleri ile konut yapı kooperatiflerinin üyelerine                          konut teslimleri",
                "value": 214
            },
            {
                "label": "215 - 17/4-l Varlık yönetim şirketlerinin işlemleri",
                "value": 215
            },
            {
                "label": "216 - 7/4-m Tasarruf mevduatı sigorta fonunun işlemleri",
                "value": 216
            },
            {
                "label": "217 - 17/4-n Basın - Yayın ve Enformasyon Genel Müdürlüğüne verilen haber hizmetleri",
                "value": 217
            },
            {
                "label": "218 - 17/4-o Gümrük antrepoları, geçici depolama yerleri, gümrüklü sahalar ve vergisiz satış yapılan mağazalarla                          ilgili hizmetler",
                "value": 218
            },
            {
                "label": "219 - 17/4-p Hazine ve Arsa Ofisi Genel Müdürlüğünün işlemleri",
                "value": 219
            },
            {
                "label": "220 - 17/4-r Kurumlar Vergisi Kanununun Geçici 28 ve 29. maddeleri kapsamındaki teslimler",
                "value": 220
            },
            {
                "label": "221 - Geçici 15 Konut yapı kooperatifleri, belediyeler ve sosyal güvenlik kuruluşlarına verilen inşaat                          taahhüt hizmeti",
                "value": 221
            },
            {
                "label": "223 - Geçici 20/1 Teknoloji geliştirme bölgelerinde yapılan işlemler",
                "value": 223
            },
            {
                "label": "225 - Geçici 23 Milli Eğitim Bakanlığına yapılan bilgisayar bağışları ile ilgili teslimler",
                "value": 225
            },
            {
                "label": "226 - 17/2-b Özel Okulları, Üniversite ve Yüksekokullar Tarafından Verilen Bedelsiz Eğitim Ve Öğretim Hizmetleri",
                "value": 226
            },
            {
                "label": "227 - 17/2-b Kanunların Gösterdiği Gerek Üzerine Bedelsiz Olarak Yapılan Teslim ve Hizmetler",
                "value": 227
            },
            {
                "label": "228 - 17/2-b Kanunun (17/1) Maddesinde Sayılan Kurum ve Kuruluşlara Bedelsiz Olarak Yapılan Teslimler",
                "value": 228
            },
            {
                "label": "229 - 17/2-b Gıda Bankacılığı Faaliyetinde Bulunan Dernek ve Vakıflara Bağışlanan Gıda, Temizlik, Giyecek                          ve Yakacak Maddeleri",
                "value": 229
            },
            {
                "label": "230 - 17/4-g Külçe Altın, Külçe Gümüş Ve Kiymetli Taşlarin Teslimi",
                "value": 230
            },
            {
                "label": "231 - 17/4-g Metal Plastik, Lastik, Kauçuk, Kağit, Cam Hurda Ve Atıkların Teslimi",
                "value": 231
            },
            {
                "label": "232 - 17/4-g Döviz, Para, Damga Pulu, Değerli Kağıtlar, Hisse Senedi ve Tahvil Teslimleri",
                "value": 232
            },
            {
                "label": "234 - 17/4-ş Konut Finansmanı Amacıyla Teminat Gösterilen ve İpotek Konulan Konutların Teslimi",
                "value": 234
            },
            {
                "label": "235 - 16/1-c Transit ve Gümrük Antrepo Rejimleri İle Geçici Depolama ve Serbest Bölge Hükümlerinin Uygulandığiı                          Malların Teslimi",
                "value": 235
            },
            {
                "label": "236 - 19/2 Usulüne Göre Yürürlüğe Girmiş Uluslararası Anlaşmalar Kapsamındaki İstisnalar (İade Hakkı Tanınmayan)",
                "value": 236
            },
            {
                "label": "237 - 17/4- 5300 Sayılı Kanuna Göre Düzenlenen Ürün Senetlerinin İhtisas/Ticaret Borsaları Aracılığıyla                          İlk Teslimlerinden Sonraki Teslim",
                "value": 237
            },
            {
                "label": "238 - 17/4-u Varlıkların Varlık Kiralama Şirketlerine Devri İle Bu Varlıkların Varlık Kiralama Şirketlerince                          Kiralanması ve Devralınan Kuruma Devri",
                "value": 238
            },
            {
                "label": "239 - 17/4- Taşınmazların Finansal Kiralama Şirketlerine Devri, Finansal Kiralama Şirketi Tarafından Devredene                          Kiralanması ve Devri",
                "value": 239
            },
            {
                "label": "240 - 17/4-z Patentli Veya Faydalı Model Belgeli Buluşa İlişkin Gayri Maddi Hakların Kiralanması, Devri                          ve Satışı",
                "value": 240
            },
            {
                "label": "250 - Kısmi İstisna Diğer",
                "value": 250
            },
            {
                "label": "301 - 11/1-a Mal ihracatı",
                "value": 301
            },
            {
                "label": "302 - 11/1-a Hizmet ihracatı",
                "value": 302
            },
            {
                "label": "303 - 11/1-a Roaming hizmetleri",
                "value": 303
            },
            {
                "label": "304 - 13/a Deniz, hava, demiryolu taşıma araç. tes. ile inşa, tadil, bakım, onarım",
                "value": 304
            },
            {
                "label": "305 - 13/b Deniz, hava taşıma araç. için liman, hava mey. yapılan hiz.",
                "value": 305
            },
            {
                "label": "306 - 13/c Petrol aramaları ve petrol boru haztlarının inşa ve modern. ilişkin teslim hiz.",
                "value": 306
            },
            {
                "label": "307 - 13/c Maden Arama, Altın, Gümüş, ve Platin Madenleri İçin İşletme, Zenginleştirme Ve Rafinaj Faaliyetlerine                          İlişkin Teslim Ve Hizmetler KDVGUT-(II/8-4)",
                "value": 307
            },
            {
                "label": "308 - 13/d Teşvikli yatırım mal tes.",
                "value": 308
            },
            {
                "label": "309 - 13/e Limanlara bağlantı sağ. demiryolu hatları ile liman ve hava mey. inşa, yenilenme ve genişletilmesi",
                "value": 309
            },
            {
                "label": "310 - 13/f Ulusal güvenlik amaçlı teslim ve hizmetler",
                "value": 310
            },
            {
                "label": "311 - 14/1 Uluslararası taşımacılık",
                "value": 311
            },
            {
                "label": "312 - 15/a Diplomatik organ ve misyonlara yapılan teslim ve hizmetler",
                "value": 312
            },
            {
                "label": "313 - 15/b Uluslarası kuruluşlara yapılan teslim ve hizmetler",
                "value": 313
            },
            {
                "label": "314 - 19/2 Usulüne göre yürürlüğe girmiş uluslararası anlaşmalar kapsamındaki istisnalar(İade hakkı tanınan)",
                "value": 314
            },
            {
                "label": "315 - 14/3 İhraç konusu eşya taşıyan kamyon, çekici ve yarı romorklara yapılan motorin teslimleri",
                "value": 315
            },
            {
                "label": "316 - 11/1-a Serbest böl. müş. fason hiz.",
                "value": 316
            },
            {
                "label": "317 - 17/4-s Özürlülerin eğitim, meslek ve günlük yaşam. ilişkin araç-gereç ve bilgisayar programları",
                "value": 317
            },
            {
                "label": "318 - Geçici 29 Yap-İşlet-Devret modeli projeler, kiralama karş. yapt. sağlık tesis.projeler, kiralama                          karş. yapt. eğitim öğretim tesis. tes. hiz.",
                "value": 318
            },
            {
                "label": "319 - 13/g Başbakanlık Merkez Teşkilatına yapılan araç teslimler",
                "value": 319
            },
            {
                "label": "320 - Geçici 16 İSMEP kapsamında İst. İl Özel İd. bağlı faal. göst. \\\"İst.Proje Koor.Brm.\\\"ne yapılacak                          tes. hiz.",
                "value": 320
            },
            {
                "label": "321 - Geçici 26 BM, NATO(temsilcilikleri, bağlı program, fon, özel ihtisas), OECD resmi kullanımları için                          yapılacak mal tes. hiz. ifaları",
                "value": 321
            },
            {
                "label": "322 - 11/1-a Türkiye'de İkamet Etmeyenlere Özel Fatura ile Yapılan Teslimler (Bavul Ticareti)",
                "value": 322
            },
            {
                "label": "323 - 13/ğ 5300 Sayılı Kanuna Göre Düzenlenen Ürün Senetlerinin İhtisas/Ticaret Borsaları Aracılığıyla                          İlk Teslimi",
                "value": 323
            },
            {
                "label": "324 - 13/h Türkiye Kızılay Derneğine Yapılan Teslim ve Hizmetler ile Türkiye Kızılay Derneğinin Teslim                          ve Hizmetleri",
                "value": 324
            },
            {
                "label": "325 - 13/ı Yem Teslimleri",
                "value": 325
            },
            {
                "label": "326 - 13/ı Gıda, Tarım ve Hayvancılık Bakanlığı Tarafından Tescil Edilmiş Gübrelerin Teslimi",
                "value": 326
            },
            {
                "label": "327 - 13/ı Gıda, Tarım ve Hayvancılık Bakanlığı Tarafından Tescil Edilmiş Gübrelerin İçeriğinde Bulunan                          Hammaddelerin Gübre Üreticilerine Teslimi",
                "value": 327
            },
            {
                "label": "350 - İstisna Diğer",
                "value": 350
            }
        ],
        placeholder: 'Muafiyet Sebebi',
        search: true,
        searchPlaceholderText: "Ara..",
        hideClearButton: true,
        dropboxWidth: '600px'
    });

    $('#invoice-profile-select').change(() => {
        var header = $("#gtiphead"),
            table = header.closest("table"),
            selector = "tbody tr td:nth-child(3)",
            column = table.find(selector).add(header);

        if ($('#invoice-profile-select').val() == 'IHRACAT') {
            document.querySelector('#invoice-type-select').setDisabledOptions(['SATIS', 'IADE']);
            if ($('#invoice-type-select').val() != 'ISTISNA') {
                document.querySelector('#invoice-type-select').setValue('ISTISNA');
            }
            $('#malteslim').show();
            $('#termcode').show();
            $('#transportmode').show();
            column.removeClass("hidden");
        } else {
            document.querySelector('#invoice-type-select').setDisabledOptions([]);
            $('#malteslim').hide();
            $('#termcode').hide();
            $('#transportmode').hide();
            column.addClass("hidden");
        }
    });

    $('#invoice-type-select').change(() => {
        if ($('#invoice-type-select').val() == 'ISTISNA') {
            $('#kdvmuaf').show();
        } else {
            $('#kdvmuaf').hide();
        }
    });

    const validate = () => {
        const invoiceProfile = $('#invoice-profile-select').val();
        const invoiceType = $('#invoice-type-select').val();
        let kdvMuaf;
        let exportTransportMode;
        let exportTermCode;
        let exportAddress;
        let exportDistrict;
        let exportCity;
        let exportCountry;
        let exportPostalCode;
        let error = "";

        let data = [];
        const linesTable = $('#invoice-lines')[0];
        const notesTable = $('#invoice-notes')[0];
        if (!invoiceProfile) {
            error += '<li>Fatura Profili seçilmek zorundadır!</li>';
        }
        if (!invoiceType) {
            error += '<li>Fatura Tipi seçilmek zorundadır!</li>'
        }
        for (var i = 1; i < linesTable.rows.length; i++) {

            var tableRow = linesTable.rows[i];
            var rowData = {};
            for (var j = 0; j < tableRow.cells.length; j++) {
                if (j == 0) {
                    rowData['id'] = tableRow.cells[j].children[0].value;
                } else if (j == 1) {
                    rowData['name'] = tableRow.cells[j].children[0].value;
                } else if (j == 2) {
                    rowData['gtip'] = tableRow.cells[j].children[0].value;
                }
            }
            data.push(rowData);
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

        if (invoiceType == 'IADE') {
            if (invoiceProfile != 'TEMELFATURA' && invoiceProfile != 'EARSIVFATURA') {
                error += "<li>Fatura Tipi İade iken Fatura Profili Temel Fatura yada e-Arşiv Fatura olmak zorundadır!</li>";
            }
        }
        if (invoiceType == 'ISTISNA') {
            kdvMuaf = $('#kdv-muaf-select').val();
            if (!kdvMuaf) {
                error += "<li>Fatura Tipi İstisna olduğunda KDV Muafiyet Sebebi belirtilmek zorundadır! \n";
            }
        }

        if (invoiceProfile == 'IHRACAT') {
            exportTermCode = $('#export-termcode-select').val();
            exportTransportMode = $('#export-transportmode-select').val();
            exportAddress = $('#delivery_address').val();
            exportDistrict = $('#delivery_district').val();
            exportCity = $('#delivery_city').val();
            exportCountry = $('#delivery_country').val();
            exportPostalCode = $('#delivery_postalcode').val();
            console.log(exportTermCode, exportTransportMode)
            if (!exportTermCode) {
                error += "<li>Fatura Profili İhracat olduğunda Teslim Şartı girilmek zorundadır!</li>"
            }
            if (!exportTransportMode) {
                error += "<li>Fatura Profili İhracat olduğunda Gönderim Şekli girilmek zorundadır!</li>"
            }
            if (!exportAddress || !exportCity || !exportCountry || !exportDistrict || !exportPostalCode) {
                error += "<li>Fatura Profili İhracat olduğunda Malın Teslim ve Ödeme yerindeki tüm bilgiler girilmek zorundadır!</li>"
            }

            for (index = 0; index < data.length; index++) {
                if (!data[index].gtip || data[index].gtip.length != 12) {
                    error += '<li>' + data[index].id + " ID'li satırda GTIB numarası bulunmuyor veya 12 haneli değil!</li>"
                }
            }
        }


        if (error) {
            return ({
                status: false,
                message: error
            })
        } else {
            const message = {
                invoiceProfile,
                invoiceType,
                kdvMuaf,
                export: {
                    termCode: exportTermCode,
                    transportMode: exportTransportMode,
                    address: {
                        address: exportAddress,
                        city: exportCity,
                        district: exportDistrict,
                        postalCode: exportPostalCode,
                        country: exportCountry
                    }
                },
                lines: data,
                notes: notesData
            };
            return ({
                status: true,
                message
            })
        }
    }

    $('#add-note').click(e => {
        $('#invoice-notes tr:last')
            .after('<tr><td><input  id="note-line" type="text" class="form-control"></td><td><button id="delete-row" type="button" class="btn btn-sm btn-danger">Sil</button></td></tr>');
        $('#invoice-notes tr:last input').focus();
    });

    $("#invoice-notes").on("click", "#delete-row", function () {
        $(this).closest("tr").remove();
    });

    $("#invoice-notes").on("keypress", "#note-line", function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            const index = $(this).prop('selectionStart');
            const leftValue = $(this).val().slice(0, index);
            const rightValue = $(this).val().slice(index);
            $(this).val(leftValue)
            $('#invoice-notes tr:last')
                .after('<tr><td><input  id="note-line" type="text" class="form-control"></td><td><button id="delete-row" type="button" class="btn btn-sm btn-danger">Sil</button></td></tr>');
            $('#invoice-notes tr:last input').val(rightValue);
            $('#invoice-notes tr:last input').focus();
            return false;
        }
    });
    $("#invoice-notes").on("keyup", "#note-line", function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 8) {
            if ($(this).val() == '') {
                const index = $(this).closest('tr').index() - 1;
                $(this).closest("tr").remove();
                $('#invoice-notes tr:eq(' + index + ') input').focus();
            }
        }
    });
    $("#invoice-notes").bind("paste", "#note-line", function (e) {
        e.preventDefault();
        var pastedData = e.originalEvent.clipboardData.getData('text');
        const notesArr = pastedData.split('\n');
        let rowIndex = $(this).closest('tr').index();
        for (index in notesArr) {
            $('#invoice-notes tr:eq(' + rowIndex + ') input').val('')
            $('#invoice-notes tr:eq(' + rowIndex + ') input').val(notesArr[index])
            if (index != notesArr.length - 1) {
                $('#invoice-notes tr:last')
                    .after('<tr><td><input  id="note-line" type="text" class="form-control"></td><td><button id="delete-row" type="button" class="btn btn-sm btn-danger">Sil</button></td></tr>');
                $('#invoice-notes tr:last input').focus();
                rowIndex = $('#invoice-notes tr:last').index();
            }
        }
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
                    title: 'Faturayı kaydetmek istedğinize emin misiniz?',
                    showCancelButton: true,
                    confirmButtonText: 'Kaydet',
                    cancelButtonText: 'İptal',
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            type: 'POST',
                            contentType: 'application/json',
                            data: body,
                            success: function (response) {
                                console.log(response);
                                if (response.status) {
                                    Swal.fire({
                                        title: 'Başarılı!',
                                        text: 'Faturanız başarı ile kaydedildi!',
                                        icon: 'success',
                                    }).then((result) => {
                                        window.location.pathname = ('/invoices');
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