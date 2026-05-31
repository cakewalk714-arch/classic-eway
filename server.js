require("dotenv").config();

const express = require("express");

const { generateEwayBill,cancelEWayBill,updateVehicleNumber,updateTransporterId} = require("./services/ewayService");

const { saveEwayBill } = require("./repositories/ewayRepo");

const downloadPDF = require("./services/downloadPdf");

const app = express();

app.use(express.json());

// serve pdf folder publicly
app.use("/eway-pdfs", express.static("uploads/eway-pdfs"));

app.post("/generate-eway", async (req, res) => {
  try {

    const payload = req.body;

    // generate eway bill
    const apiResponse = await generateEwayBill(payload);

    const result = apiResponse.results;

    if (!result || result.status !== "Success") {
      return res.status(400).json({
        success: false,
        error: result
      });
    }

    const message = result.message;

    // PDF URL from API
    const pdfUrl = `https://${message.url}`;

    // download pdf
    const pdfData = await downloadPDF(
      pdfUrl,
      message.ewayBillNo
    );

    // save in db
    await saveEwayBill({
      ewayBillNo: message.ewayBillNo,
      ewayBillDate: message.ewayBillDate,
      validUpto: message.validUpto,
      requestId: result.requestId,
      status: result.status,
      pdfUrl: pdfUrl,
      pdfLocalPath: pdfData.filePath,
      rawResponse: apiResponse
    });

    res.json({
      success: true,
      ewayBillNo: message.ewayBillNo,
      pdfUrl: pdfUrl,

      // local server URL
      localPdf: `/eway-pdfs/${pdfData.fileName}`
    });

  } catch (err) {

    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});



app.post("/cancelEwayBill",async(req,res) =>{
  try {
    const payload = req.body;

    const apiResponse = await cancelEWayBill(payload);



    const result = apiResponse.results;

    if (!result || result.status !== "Success") {
        return res.status(400).json({
          success: false,
          error: result
        });
    }

    const message = result.message;

    console.log("The cancelDate",message.cancelDate)

    if(result.code === 204){
      return res.json({
        success: false,
        error : message
      })
    }

    res.json({
      success: true,
      ewayBillNo: message.ewayBillNo,
      cancelDate : message.cancelDate,
    });
    
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }


})

app.post("/updateVehicleNumber", async (req, res) => {
  try {
    const payload = req.body;

    const apiResponse = await updateVehicleNumber(payload);

    const result = apiResponse.results;

    if (!result) {
      return res.status(400).json({
        success: false,
        error: "No response from API"
      });
    }

    // Masters India validation errors
    if (result.code === 204) {
      return res.status(400).json({
        success: false,
        error: result.message,
        nic_code: result.nic_code
      });
    }

    if (result.status !== "Success") {
      return res.status(400).json({
        success: false,
        error: result.message
      });
    }

    const message = result.message;

    res.json({
      success: true,
      vehicleUpdatedOn: message.vehUpdDate,
      validUpto: message.validUpto,
      pdfUrl: message.url
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

app.post("/updateTransporterId", async (req, res) => {
  try {
    const payload = req.body;

    const apiResponse = await updateTransporterId(payload);

    const result = apiResponse.results;

    if (!result) {
      return res.status(400).json({
        success: false,
        error: "No response received"
      });
    }

    if (result.code === 204) {
      return res.status(400).json({
        success: false,
        nic_codes: result.nic_code?.split(",") || [],
        message: result.message
          ?.split("||")
          .map(err => err.trim())
      });
    }

    if (result.status !== "Success") {
      return res.status(400).json({
        success: false,
        error: result.message
      });
    }

    const message = result.message;

    res.json({
      success: true,
      ewayBillNo: message.ewayBillNo,
      transporterId: message.transporterId,
      transporterUpdatedOn: message.transUpdateDate
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});