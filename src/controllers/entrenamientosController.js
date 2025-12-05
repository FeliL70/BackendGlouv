import supabase from '../configs/supabase.js';

export const getEntrenamientos = async (req, res) => {
  const idsParam = req.query.ids;
  console.log("ids", idsParam)
  const ids = idsParam ? idsParam.split(',').map(id => parseInt(id.trim())) : null;

  let query = supabase
    .from('Entrenamientos')
    .select('*');

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


export const getEntrenamientoRealtimeController = async (req, res) => {
  try {
    const { userId, entrenamientoId } = req.params;
    const result = await getEntrenamientoRealtimeService(userId, entrenamientoId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
