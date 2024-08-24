const { onRequest } = require('firebase-functions/v2/https');
const { chatWithGemini, history } = require('./utils/gemini');
const { reply } = require('./utils/line');

exports.webhook = onRequest(async (req, res) => {
  if (req.method === 'POST') {
    const events = req.body.events;
    for (const event of events) {
      try {
        switch (event.type) {
          case 'message':
            if (event.message.type === 'text') {
              // Get the response from Gemini
              const modelResponse = await chatWithGemini(event.message.text);

              // Extract the text content from the response object
              const responseText = modelResponse.parts.map(part => part.text).join(' ');

              // Send the response back to the user as a simple text message
              await reply(event.replyToken, [{ type: 'text', text: responseText }]);

              // Optionally log the chat history
              console.log('Chat History:', history);
            }
            break;

          // Additional cases for other message types can be handled here
        }
      } catch (error) {
        console.error('Error handling event:', error.message);
        console.error('Full error details:', error);
        // Reply with an error message
        await reply(event.replyToken, [{ type: 'text', text: 'An error occurred while processing your request.' }]);
      }
    }
  }
  res.send(req.method);
});
