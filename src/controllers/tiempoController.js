import supabase from '../configs/supabase.js';
import { sumarTiempos } from '../helpers/timeUtils.js';

export const getTiempoEntrenado = async (req, res) => {
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

  if (data.length > 0) {
    const tiempos = data.map(item => item.tiempo);
    const totalTiempo = sumarTiempos(tiempos);
    return res.json({ totalTiempo });
  } else {
    return res.json({ totalTiempo: "00:00:00" });
  }
};