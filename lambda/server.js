const express = require('express');
const cors = require('cors');
const { handler } = require('./index');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/metrics', async (req, res) => {
  const result = await handler({});
  res.status(result.statusCode).set(result.headers).send(result.body);
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Servicio Lambda Emulado en puerto ${PORT}`));