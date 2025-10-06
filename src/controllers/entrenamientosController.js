import supabase from '../configs/supabase.js';

export const getEntrenamientos = async (req, res) => {
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
};