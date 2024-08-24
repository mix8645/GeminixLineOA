const { google } = require('google-auth-library');
exports.auth = require('./auth');

console.log('Google object:', google);
console.log('Google auth object:', google.auth); // This should not be undefined


try {
  const oAuth2Client = new google.auth.OAuth2(
    'YOUR_CLIENT_ID',
    'YOUR_CLIENT_SECRET',
    'YOUR_REDIRECT_URI'
  );
  console.log('OAuth2Client initialized successfully:', oAuth2Client);
} catch (error) {
  console.error('Error initializing OAuth2Client:', error);
}
