$(document).ready(function () {
  $.noConflict();
  let DriversTable = $("#drivers").DataTable({
    language: {
      url: "/libs/datatables.net/js/dataTables.tr.json",
    },
    columns: [
      {
        data: "name",
      },
      {
        data: "surname",
      },
      {
        data: "nationality_id",
      },
    ],
    dom: 't<"row"<"col-sm-12 col-md-5"i>>',
    processing: true,
    serverSide: true,
    ajax: {
      url: "/despatch-def/drivers-list",
    },
  });
  $("#send-new-driver").click(() => {
    let name = $("#driver-name").val();
    let surname = $("#driver-surname").val();
    let tc = $("#driver-tc").val();
    if (
      name == undefined ||
      name == null ||
      name == "" ||
      surname == undefined ||
      surname == null ||
      surname == "" ||
      tc == undefined ||
      tc == null ||
      tc == ""
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
        surname,
        tc,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("/despatch-def/drivers", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const res = JSON.parse(result);
          if (res.status) {
            Swal.fire({
              title: `Şoför başarıyla eklendi.`,
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
