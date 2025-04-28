const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Firebase initialization
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "portfolio-25a83",
      private_key_id: "7e9d9c4db75a89874019a89b4887a1c24baee4c7",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4bICKwQm3/g/8\nR8b3NWMlSWBeX0jQNZPFJBXJkISpC/x8MDDzv0GYPRvMek+sbF2KYAI0bAgF5SH6\n3wCVsooHVkdJkdPxdcJ61zKmk/9fWLnIPHxqBLJxjT9fu4q5e3PcVQmbuCugy9Ju\nyYGUOljaq1BBXKptqTekGxii97p8tzH4W3utjnaKbHlYTMlPuSOEOPtNKJoLIKwy\npLSMPpUaEDcOeQ8Jz03irWjQXR8XnJPf0Unzqfydm2UCv3W21MpfAuv9LY/ojet+\no2QdOGCFJ59hzVoMRozxez+ZIMtiUCO2qaLZTTxuhaCL0J/4mEPd5rQAhvLc/jb9\njL5yp1gxAgMBAAECggEATPLUpVBK7k6eu9v0+/N2FToq7+Vg26LnL5PRVWMrvt7l\n76kp26HazBr/LM+By8cBNnm9ocLLjC4hAewm8c7nQY1xvBQQ8wf358o/c3p/zHgY\nOCBoptGj5LYTEa4OATstyepfUm5DIdm5SQlhvAemSEK/fy4bXBsFQL8fhevIDz2n\nRO6PSNz6rmE8ltCrJTR4pkCvXh1EOd25c0srO/E6jQaCvvsL9e7oZfykljoGoi8q\nMwDFgIra+8Lnva654PAVVCnw3jshDBlfMguNRfRc8eJ4YKn3MTuAxXsKOXKs05Wx\nJ9uxljsg0HSvZjb/vcfBux2wQ24l/D1vLz9HVZpruwKBgQD8oUzOMc4F5oLbsLOZ\nenU82pvX74akc5/2o4ge+2Ahj+LHdJHZUioj9zDsT+czC8f0SAy1k2ZtUy12lZPW\n4cbqw/HvsN3I/kTcXO5gRnGBPzppW+EBo+UtF1dAFECvWMcbWhV9U9qittzUrXAG\n469RFZ8SqSAONSqsdtzWqao9UwKBgQC64klOK1ftNBHh2OMWHePcrQS6VcRtWYIE\nVe1hcRcDGEAYuyK4WcJhKVhyTsoRvFux9tlTZ8E+pln+sTDGDr+AXQ3u53Mof4a4\nJ45Yyjr+uiz7kyHWLhhg7v8NuxBUrNKsEMtjQofRrs68wmBfqpqohh+wMqW9xEmj\nno0hH7wf6wKBgQD76cBT8HgXjCe6+DXvepxDhV5X8iKaBC5j2+gVtObEMN2btNLn\nGTaqTIj9bCQI09uc7Oe3fHdr1sCD+l3ErbkUSzYKpJxUG7EA6K5PVI9EqY8Olq8F\nWrBhyV+Yp1llQKqyzJ6XLbHcBWqprRUD2bDtsxi/m+Q6JqwZ9CD88YyvvwKBgEhC\nTo3G/Ixe4bstnUBj9kLRM07I8tZFEZyTjOFsVLWBnubxFI+rRRlEX0pzZHZPGjVJ\neOZi67lJoOp1oKIz+Z+sW0LQgxpZlMGHqeZy6zSqz9HGJgMmd46jWkL43WugFyUo\nqTuL8fAFYzJhBdp3oK0gjwgVzTf+uWpmV7NDDf5ZAoGARxwe1N+gE9j1eYvNWlR6\nhKhxZgH3u+QElz99Td9AH75CdCOyk9UwHIfYWygo+T8y++54HwH5k/70oa12ouaQ\nssaetiguOq1TUy++D7PcXWE3QyhFLJfgITQuNlmxuV4U7SEZ7RZNSRRdvbc7is5b\nPNgB9fxKAnNI5XgqPwFP1Kw=\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-fbsvc@portfolio-25a83.iam.gserviceaccount.com",
      client_id: "110790125930499516932",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40portfolio-25a83.iam.gserviceaccount.com",
      universe_domain: "googleapis.com"
    })
  });
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  process.exit(1);
}

const db = admin.firestore();

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Input validation
  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['name', 'email', 'message']
    });
  }

  try {
    const docRef = await db.collection('contacts').add({
      name,
      email,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'Message saved successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    res.status(500).json({
      error: 'Failed to save message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something broke!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});
