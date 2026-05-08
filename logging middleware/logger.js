const axios = require("axios");

const LOG_API =
  "http://4.224.186.213/evaluation-service/logs";

const ACCESS_TOKEN =
  "YOUR_ACCESS_TOKEN_HERE";

async function Log(
  stack,
  level,
  packageName,
  message
) {
  try {
    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "Log created successfully"
    );

    return response.data;
  } catch (error) {
    console.log(
      "Error while creating log"
    );

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

module.exports = Log;