$(document).ready(function () {
  $.noConflict();

  const validate = () => {
    let error = "";

    const linesTable = $("#despatch-lines")[0];
    const notesTable = $("#despatch-notes")[0];
    const driversTable = $("#despatch-drivers")[0];

    let data = [];
    for (var i = 1; i < linesTable.rows.length; i++) {
      var tableRow = linesTable.rows[i];
      var rowData = {};
      for (var j = 0; j < tableRow.cells.length; j++) {
        if (j == 0) {
          rowData["id"] = tableRow.cells[j].children[0].value;
        } else if (j == 1) {
          rowData["name"] = tableRow.cells[j].children[0].value;
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
          rowData["Note"] = tableRow.cells[j].children[0].value;
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
          rowData["Name"] = tableRow.cells[j].children[0].value;
        } else if (j == 1) {
          rowData["Surname"] = tableRow.cells[j].children[0].value;
        } else if (j == 2) {
          rowData["NationalityID"] = tableRow.cells[j].children[0].value;
        }
      }
      driversData.push(rowData);
    }


    const plateID = $("#plateID").val();
    const sevkIssueDate = $("#others_issuedate").val();
    const sevkIssueTime = $("#others_issuetime").val();

    const carrierName = $("#carrier_name").val();
    const carrierRegisterNumber = $("#carrier_id").val();
    const carrierTax = $("#carrier_vd").val();
    const carrierAddress = $("#carrier_address").val();
    const carrierDistrict = $("#carrier_district").val();
    const carrierCity = $("#carrier_city").val();
    const carrierCountry = $("#carrier_country").val();
    const carrierPostal = $("#carrier_postal").val();

    
    if (!(driversData.length > 0) || !carrierRegisterNumber) {
      error += "<li>En az 1 adet şoför girilmesi veya taşıyıcı firma bilgileri girilmesi zorunludur!</li>";
    }

    if (!plateID) {
      error += "<li>Plaka girilmesi zorunludur!</li>";
    }

    if (!sevkIssueDate) {
      error += "<li>Sevk Tarihi girilmesi zorunludur!</li>";
    }

    if (!sevkIssueTime) {
      error += "<li>Sevk Saati girilmesi zorunludur!</li>";
    }

    if (error) {
      return {
        status: false,
        message: error,
      };
    } else {
      const message = {
        lines: data,
        notes: notesData,
        drivers: driversData,
        plateID,
        others: {
          address: $("#others_address").val(),
          district: $("#others_district").val(),
          city: $("#others_city").val(),
          country: $("#others_country").val(),
          postalcode: $("#others_postalcode").val(),
          sevkIssueDate,
          sevkIssueTime,
        },
        carrier: {
          register_number: carrierRegisterNumber,
          name: carrierName,
          tax_office: carrierTax,
          address: carrierAddress,
          district: carrierDistrict,
          city: carrierCity,
          country: carrierCountry,
          postal_code: carrierPostal
        }
      };
      return {
        status: true,
        message,
      };
    }
  };

  $("#add-note").click((e) => {
    $("#despatch-notes tr:last").after(
      '<tr><td><input type="text" class="form-control"></td><td><button id="delete-note" type="button" class="btn btn-sm btn-danger">Sil</button></td></tr>'
    );
  });

  $("#despatch-notes").on("click", "#delete-note", function () {
    $(this).closest("tr").remove();
  });

  $("#despatch-drivers").on("click", "#delete-driver", function () {
    $(this).closest("tr").remove();
  });

  $("#add-driver").click((e) => {
    if ($("#despatch-drivers tbody tr").length > 0) {
      $("#despatch-drivers tbody tr:last").after(
        `<tr><td><input type="text" class="form-control"></td><td><input type="text" class="form-control"></td><td><input type="text" class="form-control"></td><td><div id="btn-group-driver" class="btn-group"><button id="select-driver" type="button" class="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#select-drivers">Seç</button><button id="delete-driver" type="button" class="btn btn-sm btn-danger">Sil</button></div></td></tr>`
      );
    } else {
      $("#despatch-drivers tbody").append(
        `<tr><td><input type="text" class="form-control"></td><td><input type="text" class="form-control"></td><td><input type="text" class="form-control"></td><td><div id="btn-group-driver" class="btn-group"><button id="select-driver" type="button" class="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#select-drivers">Seç</button><button id="delete-driver" type="button" class="btn btn-sm btn-danger">Sil</button></div></td></tr>`
      );
    }
  });

  $("#despatch-drivers").on("click", "#select-driver", function () {
    const index = $(this).closest("tr").index();
    $("#drive-modal-line-number").val(index);
    $.ajax({
      type: "GET",
      url: "/despatches/drivers",
      success: function (response) {
        if (response.status) {
          if (
            $("#despatch-drivers-selectable tr").length - 1 !=
            response.data.length
          ) {
            for (driver of response.data) {
              $("#despatch-drivers-selectable tr:last").after(`
                            <tr>
                                <td>${driver.name}</td>
                                <td>${driver.surname}</td>
                                <td>${driver.nationality_id}</td>
                                <td><button id="select-driver-line" type="button" class="btn btn-sm btn-success" data-bs-dismiss="modal">Seç</button></td>
                            </tr>
                            `);
            }
          }
        }
      },
    });
  });

  $("#despatch-drivers-selectable").on(
    "click",
    "#select-driver-line",
    function () {
      const index = Number($("#drive-modal-line-number").val()) + 1;
      const name = $(this).closest("tr")[0].children[0].innerText;
      const surname = $(this).closest("tr")[0].children[1].innerText;
      const nat_id = $(this).closest("tr")[0].children[2].innerText;
      $($("#despatch-drivers tr:eq(" + index + ") input")[0]).val(name);
      $($("#despatch-drivers tr:eq(" + index + ") input")[1]).val(surname);
      $($("#despatch-drivers tr:eq(" + index + ") input")[2]).val(nat_id);
    }
  );

  $("#select-plate").click(function () {
    $.ajax({
      type: "GET",
      url: "/despatches/plates",
      success: function (response) {
        if (response.status) {
          if (
            $("#despatch-plates-selectable tr").length - 1 !=
            response.data.length
          ) {
            for (plate of response.data) {
              $("#despatch-plates-selectable tr:last").after(`
                <tr>
                    <td>${plate.plate}</td>
                    <td><button id="select-plate-line" type="button" class="btn btn-sm btn-success" data-bs-dismiss="modal">Seç</button></td>
                </tr>
                `);
            }
          }
        }
      },
    });
  });

  $("#despatch-plates-selectable").on(
    "click",
    "#select-plate-line",
    function () {
      const plate = $(this).closest("tr")[0].children[0].innerText;
      $("#plateID").val(plate);
    }
  );

  $("#select-carrier-button").click(function () {
    $.ajax({
      type: "GET",
      url: "/despatches/carriers",
      success: function (response) {
        if (response.status) {
          if (
            $("#despatch-carrier-selectable tr").length - 1 !=
            response.data.length
          ) {
            for (carrier of response.data) {
              $("#despatch-carrier-selectable tr:last").after(`
                <tr>
                    <td>${carrier.id}</td>
                    <td>${carrier.name}</td>
                    <td>${carrier.register_number}</td>
                    <td><button id="select-carrier-line" type="button" class="btn btn-sm btn-success" data-bs-dismiss="modal">Seç</button></td>
                </tr>
                `);
            }
          }
        }
      },
    });
  });

  $("#despatch-carrier-selectable").on(
    "click",
    "#select-carrier-line",
    function () {
      const carrier_id = $(this).closest("tr")[0].children[0].innerText;
      console.log(carrier_id)
      $.ajax({
        type: "GET",
        url: "/despatches/carrier/" + carrier_id,
        success: function (response) {
          if (response.status) {
            $("#carrier_id").val(response.data.register_number);
            $("#carrier_name").val(response.data.name);
            $("#carrier_vd").val(response.data.tax_office);
            $("#carrier_address").val(response.data.address);
            $("#carrier_district").val(response.data.district);
            $("#carrier_city").val(response.data.city);
            $("#carrier_country").val(response.data.country);
            $("#carrier_postal").val(response.data.postal_code);
          }
        },
      });
    }
  );

  $("#edit-form").submit((event) => {
    event.preventDefault();
    const validation = validate();
    const body = JSON.stringify(validation.message);
    if (!validation.status) {
      Swal.fire({
        title: "Hata",
        icon: "error",
        html: "<ul>" + validation.message + "</ul>",
      });
    } else {
      Swal.fire({
        title: "İrsaliyeyi kaydetmek istediğinize emin misiniz?",
        showCancelButton: true,
        confirmButtonText: "Kaydet",
        cancelButtonText: "İptal",
      }).then((result) => {
        console.log(result);
        if (result.isConfirmed) {
          $.ajax({
            type: "POST",
            contentType: "application/json",
            data: body,
            success: function (response) {
              if (response.status) {
                Swal.fire({
                  title: "Başarılı!",
                  text: "İrsaliyeniz başarı ile kaydedildi!",
                  icon: "success",
                }).then((result) => {
                  window.location.pathname = "/despatches";
                });
              } else {
                swal.fire(
                  "Kaydedilirken bir hata oluştu!",
                  "Hata Detayı : " + JSON.stringify(response.message),
                  "error"
                );
              }
            },
          });
        }
      });
    }
  });
});
