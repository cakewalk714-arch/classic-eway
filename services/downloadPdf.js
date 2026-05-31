const axios = require("axios");
const fs = require("fs");
const path = require("path");

const downloadPDF = async (pdfUrl, ewayBillNo) => {
  try {
    // create folder if not exists
    const dir = path.join(__dirname, "../uploads/eway-pdfs");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // file path
    const fileName = `${ewayBillNo}.pdf`;
    const filePath = path.join(dir, fileName);

    // download pdf
    const response = await axios({
      method: "GET",
      url: pdfUrl,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        resolve({
          fileName,
          filePath
        });
      });

      writer.on("error", reject);
    });

  } catch (err) {
    console.error("PDF Download Error:", err.message);
    throw err;
  }
};

module.exports = downloadPDF;