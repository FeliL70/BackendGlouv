import supabase from '../configs/supabase.js';

export const loginUser = async (req, res) => {
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
};

export const registerUser = async (req, res) => {
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
};