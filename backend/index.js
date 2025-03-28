const express = require('express');
const nearAPI = require('near-api-js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/verify', (req, res) => {
  const { message, publicKey, signature } = req.body;

  try {
    const pubKey = nearAPI.utils.PublicKey.fromString(publicKey);
    const messageBytes = Buffer.from(message);
    const signatureBytes = Buffer.from(signature, 'base64');

    const valid = pubKey.verify(messageBytes, signatureBytes);
    res.json({ valid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Backend running on :3000'));
