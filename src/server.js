import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { getEntrenamientos } from './controllers/entrenamientosController.js';
import { getTiempoEntrenado } from './controllers/tiempoController.js';
import { loginUser, registerUser } from './controllers/authController.js';
import { getPerfil } from './controllers/userController.js';
import { getSumaGolpes, postGolpe, getRankingGolpes } from './controllers/golpesController.js';

const app = express();
const PORT = process.env.PORT || 3000;
const IP_PC = process.env.HOSTNAME || 'localhost';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor backend funcionando correctamente');
});

const api = express.Router();

api.get('/entrenamientos', getEntrenamientos);
api.get('/tiempo-entrenado', getTiempoEntrenado);

api.post('/login', loginUser);
api.post('/register', registerUser);

api.get('/perfil', getPerfil);

api.get('/golpes/suma', getSumaGolpes);
api.post('/golpes', postGolpe);

api.get('/ranking-golpes/:id', getRankingGolpes);

app.use('/api', api);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

app.use((err, req, res, next) => {
  console.error('Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://${IP_PC}:${PORT}`);
});