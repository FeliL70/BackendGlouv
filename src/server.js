// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { getEntrenamientos } from './src/controllers/entrenamientos.controller.js';
import { getTiempoEntrenado } from './src/controllers/tiempo.controller.js';
import { loginUser, registerUser } from './src/controllers/auth.controller.js';
import { getPerfil } from './src/controllers/user.controller.js';
import { getSumaGolpes, postGolpe, getRankingGolpes } from './src/controllers/golpes.controller.js';

const app = express();
const PORT = process.env.PORT || 3000;
const IP_PC = process.env.HOSTNAME || 'localhost';

app.use(cors());
app.use(express.json());

// Healthcheck / home
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando correctamente');
});

// API routes (delegan en controllers)
const api = express.Router();

api.get('/entrenamientos', getEntrenamientos);
api.get('/tiempo-entrenado', getTiempoEntrenado);

api.post('/login', loginUser);
api.post('/register', registerUser);

api.get('/perfil', getPerfil);

api.get('/golpes/suma', getSumaGolpes);
api.post('/golpes', postGolpe);

// NOTE: ahora recibe el id del torneo como parámetro de ruta
api.get('/ranking-golpes/:id', getRankingGolpes);

app.use('/api', api);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Global error handler (por si algún controller lanza un error no manejado)
app.use((err, req, res, next) => {
  console.error('Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://${IP_PC}:${PORT}`);
});
