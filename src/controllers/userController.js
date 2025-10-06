import supabase from '../configs/supabase.js';

export const getPerfil = async (req, res) => {
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
};