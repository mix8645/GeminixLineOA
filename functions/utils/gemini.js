const { VertexAI } = require('@google-cloud/vertexai');
const { GoogleAuth } = require('google-auth-library');

// Initialize Google Auth for Vertex AI API
const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

let chatSession = null;  // Store the chat session
let history = [];

async function initializeVertexAI() {
  if (!chatSession) {  // Only initialize if not already initialized
    const client = await auth.getClient();
    const vertex_ai = new VertexAI({
      project: '1033751180214',  // Explicitly set your project ID here
      location: 'us-central1',
      authClient: client,
    });

    const model = 'projects/1033751180214/locations/us-central1/endpoints/668711976897085440';

    // Instantiate the generative model
    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: model,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 1,
        topP: 1,
      },
    });

    chatSession = generativeModel.startChat({
      context: history,  // Set initial context from history
    });
  }
  return chatSession;
}

async function sendMessage(chat, message) {
  try {
    // Add user message to history
    history.push({ role: 'user', parts: [{ text: message }] });

    const streamResult = await chat.sendMessageStream(message);

    // Await the response to ensure it is resolved before accessing
    const responseResolved = await streamResult.response;
    console.log('Resolved response:', responseResolved);

    // Check if candidates exist and is an array with at least one item
    if (responseResolved && responseResolved.candidates && responseResolved.candidates.length > 0) {
      const response = responseResolved.candidates[0].content; // Extract the content
      console.log('Stream result content:', response);

      // Add model response to history
      history.push({ role: 'model', parts: [{ text: response }] });

      return response;
    } else {
      console.error('No candidates found in the response.');
      return 'No valid response from the model.';
    }
  } catch (error) {
    console.error('Error sending message:', error.message);
    return 'Error processing request';
  }
}

async function chatWithGemini(message) {
  const chat = await initializeVertexAI();
  return await sendMessage(chat, message);
}

module.exports = { chatWithGemini, history };