const { onRequest } = require("firebase-functions/v2/https");
const line = require("./utils/line");
const { chatWithGemini } = require("./utils/gemini");

exports.webhook = onRequest(async (req, res) => {
  if (req.method === "POST") {
    const events = req.body.events;
    for (const event of events) {
      switch (event.type) {
        case "message":
          if (event.message.type === "text") {
            const msg = await chatWithGemini(event.message.text);
            await line.reply(event.replyToken, [{ type: "text", text: msg }]);
            break;
          }
          if (event.message.type === "image") {
            const imageBinary = await line.getImageBinary(event.message.id);
            // Assuming you have a multimodal function for handling images
            const msg = await chatWithGemini(imageBinary);
            await line.reply(event.replyToken, [{ type: "text", text: msg }]);
            break;
          }
          break;
      }
    }
  }
  res.send(req.method);
});
