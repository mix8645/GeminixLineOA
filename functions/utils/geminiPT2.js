const { VertexAI } = require('@google-cloud/vertexai');
const { GoogleAuth } = require('google-auth-library');

// Initialize Google Auth for Vertex AI API
const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

async function initializeVertexAI() {
  const client = await auth.getClient();
  const vertex_ai = new VertexAI({
    project: '1033751180214',  // Explicitly set your project ID here
    location: 'us-central1',
    authClient: client,
  });

  const model = 'projects/1033751180214/locations/us-central1/endpoints/1791832318344691712';

  // Instantiate the generative model
  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 1,
      topP: 1,
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  });

  return generativeModel.startChat({});
}

async function sendMessage(chat, message) {
  try {
    const streamResult = await chat.sendMessageStream(message);
    const response = (await streamResult.response).candidates[0].content;
    console.log('Stream result:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    return 'Error processing request';
  }
}

async function chatWithGemini(message) {
  const chat = await initializeVertexAI();
  return await sendMessage(chat, message);
}

module.exports = { chatWithGemini };
