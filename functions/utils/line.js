const axios = require("axios");

// Set up the LINE Messaging API headers, including the authorization token
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`  // Ensure this is set in your .env file
};

/**
 * Sends a reply message to the LINE Messaging API.
 * 
 * @param {string} token - The reply token provided by the LINE webhook event.
 * @param {Array} payload - An array of message objects to send as the reply.
 * @returns {Promise} - The axios request promise.
 */
const reply = (token, payload) => {
  return axios({
    method: "post",
    url: "https://api.line.me/v2/bot/message/reply",
    headers: LINE_HEADER,
    data: { replyToken: token, messages: payload }
  });
};

/**
 * Retrieves the binary data of an image sent via LINE.
 * 
 * @param {string} messageId - The ID of the message containing the image.
 * @returns {Buffer} - The binary data of the image.
 */
const getImageBinary = async (messageId) => {
  const originalImage = await axios({
    method: "get",
    headers: LINE_HEADER,
    url: `https://api-data.line.me/v2/bot/message/${messageId}/content`,
    responseType: "arraybuffer"
  });
  return originalImage.data;
};

module.exports = { getImageBinary, reply };
