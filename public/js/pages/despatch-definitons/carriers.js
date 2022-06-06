$(document).ready(function () {
  $.noConflict();
  let CarriersTable = $("#carriers").DataTable({
    language: {
      url: "/libs/datatables.net/js/dataTables.tr.json",
    },
    columns: [
      {
        data: "name"
      },
      {
        data: "id"
      },
      {
        data: "address"
      },
    ],
    dom: 't<"row"<"col-sm-12 col-md-5"i>>',
    processing: true,
    serverSide: true,
    ajax: {
      url: "/despatch-def/carriers-list",
    },
  });
  $("#send-new-carrier").click(() => {
    let name = $("#carrier_name").val();
    let id = $("#carrier_id").val();
    let tax = $("#carrier_tax").val();
    let address = $("#carrier_address").val();
    let city = $("#carrier_city").val();
    let district = $("#carrier_district").val();
    let country = $("#carrier_country").val();
    let postal = $("#carrier_postal").val();
    if (
      name == undefined || name == null || name == "" ||
      id == undefined || id == null || id == "" ||
      address == undefined || address == null || address == "" ||
      city == undefined || city == null || city == "" ||
      district == undefined || district == null || district == "" ||
      country == undefined || country == null || country == ""
      ) {
      Swal.fire({
        title: `Tüm alanları doldurunuz!`,
        icon: "error",
        confirmButtonText: `Tamam`,
      });
    } else {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        name,
        id,
        tax,
        address,
        city,
        district,
        country,
        postal,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("/despatch-def/carriers", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const res = JSON.parse(result);
          if (res.status) {
            Swal.fire({
              title: `Taşıyıcı firma başarıyla eklendi.`,
              icon: "success",
              confirmButtonText: `Tamam`,
            }).then((result) => {
              location.reload();
            });
          } else {
            console.log(res);
            Swal.fire({
              title: `${res.message}`,
              icon: "error",
              confirmButtonText: `Tamam`,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
          Swal.fire({
            title: `${error}`,
            icon: "error",
            confirmButtonText: `Tamam`,
          });
        });
    }
  });
});
