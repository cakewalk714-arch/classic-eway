const axios = require("axios");

async function generateEWB() {

  try {

    // STEP 1: GET TOKEN
    const authResponse = await axios.post(
      "https://sandb-api.mastersindia.co/api/v1/token-auth/",
      {
        username: "krishnapriya.p@kggeniuslabs.com",
        password: "Masters@12345"
      }
    );

    const token = authResponse.data.token;

    console.log("TOKEN OK");

    // STEP 2: GENERATE EWB
    const payload = {
  "userGstin": "05AAABB0639G1Z8",

  "supply_type": "outward",
  "sub_supply_type": "Supply",

  "document_type": "Tax Invoice",

  "document_number": "IMP2302001",

  "document_date": "12/05/2026",

  "gstin_of_consignor": "05AAABB0639G1Z8",
  "legal_name_of_consignor": "Welton",

  "address1_of_consignor": "Rajpur Road",
  "place_of_consignor": "Dehradun",

  "pincode_of_consignor": 248001,
  "state_of_consignor": "UTTARAKHAND",

  "actual_from_state_name": "UTTARAKHAND",

  "gstin_of_consignee": "05AAABC0181E1ZE",
  "legal_name_of_consignee": "Sthuthya",

  "address1_of_consignee": "Clock Tower",
  "place_of_consignee": "Dehradun",

  "pincode_of_consignee": 248002,

  "state_of_supply": "UTTARAKHAND",
  "actual_to_state_name": "UTTARAKHAND",

  "transaction_type": 1,

  "total_invoice_value": 560,
  "taxable_amount": 500,

  "cgst_amount": 30,
  "sgst_amount": 30,
  "igst_amount": 0,

  "transportation_mode": "Road",
  "transportation_distance": "10",

  "vehicle_number": "UK07AB1234",
  "vehicle_type": "Regular",

  "transporter_id": "05AAABB0639G1Z8",

  "itemList": [
    {
      "product_name": "Wheat",
      "product_description": "Wheat",

      "hsn_code": "1001",

      "quantity": 1,
      "unit_of_product": "BOX",

      "cgst_rate": 6,
      "sgst_rate": 6,
      "igst_rate": 0,

      "taxable_amount": 100
    }
  ]
}

    const response = await axios.post(
      "https://sandb-api.mastersindia.co/api/v1/ewayBillsGenerate/",
      payload,
      {
        headers: {
          Authorization: `JWT ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(JSON.stringify(response.data, null, 2));

  } catch (err) {

    console.log("ERROR:", err.message);

    if (err.response) {
      console.log(JSON.stringify(err.response.data, null, 2));
    }
  }
}

generateEWB();