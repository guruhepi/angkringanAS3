function doGet(e) {
  // Mendapatkan nilai parameter 'kode' dari URL
  var kode = e.parameter.kode;

  // Mengambil spreadsheet aktif dan sheet DATA
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('DATA');

  // Mendapatkan data dari kolom A dan B
  var data = sheet.getRange('A:B').getValues();

  // Variabel untuk menampung nama yang sesuai dengan kode
  var nama = "";
  var jenisAlert = "";

  // Mencari apakah kode ada di kolom A
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == kode) {
      // Jika kode ditemukan, simpan nama yang sesuai
      nama = data[i][1];
      jenisAlert = "success"; // Menggunakan string tanpa tanda kutip tambahan
      // Tampilkan pesan modal SweetAlert dengan judul "Kombel Angkringan Merdeka"
      var template = HtmlService.createTemplateFromFile('swal');
      template.nama = JSON.stringify("Sertifikat ini milik " + nama); // Mengirimkan nilai nama dengan teks tambahan ke template HTML
      template.jenisAlert = jenisAlert; // Mengirimkan jenis alert ke template HTML
      return template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
  }

  // Jika kode tidak ditemukan, tampilkan pesan SweetAlert "PESERTA TIDAK TERDAFTAR" dengan judul "Kombel Angkringan Merdeka"
  jenisAlert = "error"; // Menggunakan string tanpa tanda kutip tambahan
  var template = HtmlService.createTemplateFromFile('swal');
  template.nama = "'PESERTA TIDAK TERDAFTAR'";
  template.jenisAlert = jenisAlert;
  return template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


function populateQRData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  for (var i = 2; i <= 79; i++) {
    var kode = sheet.getRange("A" + i).getValue();
    var url = "https://script.google.com/macros/s/AKfycbxCzLRUKn4Qt25dJLM7QyTuteM7IaZQr-SlwfFljoQeX207AK3-pIZwJQrp4c6eF5W6hw/exec?kode=" + kode;
    Logger.log("Generated URL for row " + i + ": " + url); // Log URL yang dihasilkan
    sheet.getRange("G" + i).setValue(url);
  }
}

function generateQR() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var dataRange = sheet.getRange("G2:G79"); // Range kolom G
  var dataValues = dataRange.getValues();
  
  for (var i = 0; i < dataValues.length; i++) {
    var value = dataValues[i][0];
    if (value) {
      var qrCodeUrl = generateQRCodeUrl(value);
      Logger.log("Generating QR for: " + value + " - URL: " + qrCodeUrl); // Log untuk debugging
      if (qrCodeUrl) {
        sheet.getRange(i + 2, 8).setValue(qrCodeUrl); // Menyimpan URL QR di kolom H
      }
    }
  }
}

function generateQRCodeUrl(data) {
  // Menghasilkan URL untuk gambar QR menggunakan Tec-It QR code API
  var baseURL = "https://qrcode.tec-it.com/API/QRCode";
  var params = {
    "data": data,
    "size": "2" // Ukuran gambar QR dalam piksel
  };
  var queryString = Object.keys(params).map(function(key) {
    return key + "=" + encodeURIComponent(params[key]);
  }).join("&");
  
  return baseURL + "?" + queryString;
}

