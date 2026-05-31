const db = require("../config/db");

const saveEwayBill = async (data) => {
  const query = `
    INSERT INTO eway_bills
    (
      eway_bill_no,
      eway_bill_date,
      valid_upto,
      request_id,
      status,
      pdf_url,
      pdf_local_path,
      raw_response
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.ewayBillNo,
    data.ewayBillDate,
    data.validUpto,
    data.requestId,
    data.status,
    data.pdfUrl,
    data.pdfLocalPath,
    JSON.stringify(data.rawResponse)
  ];

  const [result] = await db.execute(query, values);

  return result;
};

module.exports = { saveEwayBill };