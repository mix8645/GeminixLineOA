const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI and the generative model
const vertex_ai = new VertexAI({ project: '1033751180214', location: 'us-central1' });
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: 'projects/1033751180214/locations/us-central1/endpoints/2888705118214029312',
  generationConfig: { maxOutputTokens: 2048, temperature: 1, topP: 1 },
  safetySettings: [
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
  ],
});

let history = [];  // Store conversation history
const chat = generativeModel.startChat();  // Start the chat session

async function sendMessage(message) {
  if (!message.trim()) throw new Error('Message content cannot be empty.');

  history.push({ role: 'user', content: message });  // Add user message to history
  const response = await chat.sendMessageStream({ content: message, context: history });

  const reply = (await response.response).candidates[0].content;
  history.push({ role: 'model', content: reply });  // Add model response to history

  console.log(reply);  // Print the model's response
}

async function generateContent() {
  await sendMessage('Hello! How are you today?');
  await sendMessage('What can you tell me about the weather?');
}

generateContent();
