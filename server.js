const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 5000;

// Load Firebase admin SDK key
const serviceAccount = require('./firebase-service-account.json');
// Fix the private key formatting
if (serviceAccount.private_key && serviceAccount.private_key.includes('\\n')) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/api/contact', async (req, res) => {
  const { Name, Email, Message } = req.body;

  try {
    await db.collection('contact_form').add({
      name: Name,
      email: Email,
      message: Message,
      timestamp: new Date(),
    });
    res.send('Message saved to Firebase!');
  } catch (err) {
    console.error('Error saving to Firestore:', err);
    res.status(500).send('Failed to save message');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
