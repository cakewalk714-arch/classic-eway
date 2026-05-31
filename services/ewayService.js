const axios = require("axios");

const BASE_URL = process.env.BASE_URL;

const getToken = async () => {
  const res = await axios.post(`${BASE_URL}/token-auth/`, {
    username: process.env.EWAY_USERNAME,
    password: process.env.EWAY_PASSWORD
  });

  return res.data.token;
};

const generateEwayBill = async (payload) => {
  const token = await getToken();

  const res = await axios.post(
    `${BASE_URL}/ewayBillsGenerate/`,
    payload,
    {
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data;
};


const cancelEWayBill = async(payload) => {
  const token = await getToken();

  const res = await axios.post(
    `${BASE_URL}/ewayBillCancel`,
    payload,
    {
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json"
      }
    }

  )

  return res.data
}


const updateVehicleNumber = async(payload) =>{
  const token = await getToken();

  const res = await axios.post(
    `${BASE_URL}/updateVehicleNumber/`,
    payload,
    {
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data;


}


const updateTransporterId = async (payload) => {
  const token = await getToken();

  const res = await axios.post(
    `${BASE_URL}/transporterIdUpdate/`,
    payload,
    {
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data;
};

module.exports = { generateEwayBill,cancelEWayBill,updateVehicleNumber,updateTransporterId };