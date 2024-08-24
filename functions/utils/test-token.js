require('dotenv').config(); // Load environment variables from .env file

const { URLSearchParams } = require('url');
const fetch = require('node-fetch');

const API_ENDPOINT = 'https://oauth2.googleapis.com/token';

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

async function refreshAccessToken() {
  try {
      const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
              grant_type: 'refresh_token',
              client_id: clientId,
              client_secret: clientSecret,
              refresh_token: refreshToken,
              scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/cloud-aiplatform' // ตรวจสอบให้แน่ใจว่า scopes ที่ถูกต้อง
          }),
      });

      if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`HTTP error! status: ${response.status}. Details: ${errorDetails}`);
      }

      const data = await response.json();
      console.log('New Access Token:', data.access_token);
      console.log('Expires in (seconds):', data.expires_in);
      return data.access_token;
  } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
  }
}

module.exports = { refreshAccessToken };
