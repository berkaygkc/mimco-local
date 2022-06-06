$(document).ready(function () {
  $.noConflict();
  let PlatesTable = $("#plates").DataTable({
    language: {
      url: "/libs/datatables.net/js/dataTables.tr.json",
    },
    columns: [
      {
        data: "plate",
      },
    ],
    dom: 't<"row"<"col-sm-12 col-md-5"i>>',
    processing: true,
    serverSide: true,
    ajax: {
      url: "/despatch-def/plates-list",
    },
  });
  $("#send-new-plate").click(() => {
    let plate = $("#plate").val();
    if (plate == undefined || plate == null || plate == "") {
      Swal.fire({
        title: `Tüm alanları doldurunuz!`,
        icon: "error",
        confirmButtonText: `Tamam`,
      });
    } else {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        plate,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("/despatch-def/plates", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const res = JSON.parse(result);
          if (res.status) {
            Swal.fire({
              title: `Plaka başarıyla eklendi.`,
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
