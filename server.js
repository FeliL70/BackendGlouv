import express from 'express';
import cors from 'cors';
import supabase from './supabase.js'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;
const IP_PC = "localhost";

app.use(cors());
app.use(express.json());

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://${IP_PC}:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Servidor backend funcionando correctamente');
});

//

app.get('/api/entrenamientos', async (req, res) => {
  const idsParam = req.query.ids;
  const ids = idsParam ? idsParam.split(',').map(id => parseInt(id.trim())) : null;

  let query = supabase
    .from('Entrenamientos')
    .select('id, nombre, foto, descripcion, duracion');

  if (ids && ids.length > 0) {
    query = query.in('id', ids);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al obtener entrenamientos:", error);
    return res.status(500).json({ error: "Error al obtener entrenamientos." });
  }

  res.json(data);
});

//

app.get('/api/tiempo-entrenado', async (req, res) => {
  const { fecha, id_usuario } = req.query;

  if (!fecha || !id_usuario) {
    return res.status(400).json({ error: "Faltan parámetros: fecha o id_usuario." });
  }

  const { data, error } = await supabase
    .from('UsuarioEntrenamiento')
    .select('tiempo')
    .eq('fecha', fecha)
    .eq('id_usuario', id_usuario);

  if (error) {
    console.error('Error cargando tiempo entrenado:', error);
    return res.status(500).json({ error: "Error cargando tiempo entrenado." });
  }

  const sumarTiempos = (tiempos) => {
    let totalSegundos = 0;

    tiempos.forEach((tiempo) => {
      const [h, m, s] = tiempo.split(':').map(Number);
      totalSegundos += h * 3600 + m * 60 + s;
    });

    const horas = String(Math.floor(totalSegundos / 3600)).padStart(2, '0');
    const minutos = String(Math.floor((totalSegundos % 3600) / 60)).padStart(2, '0');
    const segundos = String(totalSegundos % 60).padStart(2, '0');

    return `${horas}:${minutos}:${segundos}`;
  };

  if (data.length > 0) {
    const tiempos = data.map(item => item.tiempo);
    const totalTiempo = sumarTiempos(tiempos);
    return res.json({ totalTiempo });
  } else {
    return res.json({ totalTiempo: "00:00:00" });
  }
});

//

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan email o contraseña" });
  }

  const { data, error } = await supabase
    .from('Usuarios')
    .select('*')
    .eq('email', email)
    .eq('Contrasenia', password)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: "Email o contraseña incorrectos" });
  }

  res.json({ usuario: data });
});

//

app.post('/api/register', async (req, res) => {
  const { email, nombre, password } = req.body;

  if (!email || !nombre || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const { data: existingUser, error: lookupError } = await supabase
    .from('Usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (lookupError && lookupError.code !== 'PGRST116') {
    return res.status(500).json({ error: "Error verificando usuario existente" });
  }

  if (existingUser) {
    return res.status(409).json({ error: "Ya existe un usuario con ese email" });
  }

  const { data, error } = await supabase
    .from('Usuarios')
    .insert([{ email, nombre, Contrasenia: password }])
    .select()
    .single();

  if (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: "No se pudo registrar el usuario" });
  }

  res.json({ usuario: data });
});

//

app.get('/api/perfil', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" });
  }

  const { data, error } = await supabase
    .from('Usuarios')
    .select('fotoDePerfil, nombreCompleto, fotoDeFondo, fechaDeNacimiento, email, descripcion')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Error obteniendo perfil:", error);
    return res.status(500).json({ error: "No se pudo obtener el perfil" });
  }

  res.json(data);
});