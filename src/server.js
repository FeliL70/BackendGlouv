import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Controllers
import { getEntrenamientos } from './controllers/entrenamientosController.js';
import { getTiempoEntrenado } from './controllers/tiempoController.js';
import { loginUser, registerUser } from './controllers/authController.js';
import { getRankingGolpes, getSumaGolpes, postGolpe } from './controllers/golpesController.js';
import { getPerfil } from './controllers/userController.js';
import { getEstadisticasPorFecha } from './controllers/calendarioController.js';
import { crearUsuarioEntrenamiento, actualizarTiempoEntrenamiento } from './controllers/usuarioEntrenamientoController.js';
import { getTipoDeCuerpo, getTiposDeCuerpo } from './controllers/tipoDeCuerpoController.js';
import { getPaises } from './controllers/paisesController.js';
import { getEntrenamientoRealtimeController } from "./controllers/entrenamientosController.js";
import {
  getTorneos,
  crearTorneo,
  unirseATorneo,
  getRankingGlobal,
  cargarPuntosEntrenamiento,
  getTorneosDelUsuario,
  getParticipantesTorneo
} from './controllers/torneosController.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor backend funcionando correctamente');
});

const api = express.Router();

// Entrenamientos
api.get('/entrenamientos', getEntrenamientos);
api.get('/tiempo-entrenado', getTiempoEntrenado);

// Auth
api.post('/login', loginUser);
api.post('/register', registerUser);

// Perfil
api.get('/perfil', getPerfil);

// Golpes
api.get('/golpes/suma', getSumaGolpes);
api.post('/golpes', postGolpe);

// Ranking golpes (RUTA CORREGIDA)
api.get('/ranking-golpes', getRankingGolpes);

// Calendario
api.get('/estadisticasPorFecha', getEstadisticasPorFecha);

// Usuario Entrenamiento
api.post('/usuarioEntrenamiento', crearUsuarioEntrenamiento);
api.put('/usuarioEntrenamiento/:id', actualizarTiempoEntrenamiento);

// Tipos de cuerpo
api.get('/tipoDeCuerpo', getTipoDeCuerpo);
api.get('/tiposDeCuerpo', getTiposDeCuerpo);

// Paises
api.get('/paises', getPaises);

// Torneos
api.get('/torneos', getTorneos);
api.post('/torneos', crearTorneo);
api.post('/torneos/unirse', unirseATorneo);
api.get('/torneos/ranking', getRankingGlobal);
api.post('/torneos/cargar-puntos', cargarPuntosEntrenamiento);
api.get('/torneos/usuario', getTorneosDelUsuario);
api.get('/torneos/participantes', getParticipantesTorneo);

app.get("/entrenamiento/realtime/:userId/:entrenamientoId", getEntrenamientoRealtimeController);

app.use('/api', api);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Error general
app.use((err, req, res, next) => {
  console.error('Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
