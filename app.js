const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const apiRoutes = require('./apiRoutes');

const app = express();
const PORT = process.env.PORT || 3040;

// Adicione o middleware CORS
app.use(cors());

// Configurar o servidor HTTPS
const privateKeyPath = '/etc/letsencrypt/live/api.kcharts.live/privkey.pem';
const certificatePath = '/etc/letsencrypt/live/api.kcharts.live/fullchain.pem';

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.use('/api', apiRoutes);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} com HTTPS`);
});
