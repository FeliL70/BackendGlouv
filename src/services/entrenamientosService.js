import supabase from '../configs/supabase.js';

export const getEntrenamientosService = async (ids) => {
  try {
    let query = supabase
      .from('Entrenamientos')
      .select('id, nombre, foto, descripcion, duracion');

    if (ids && ids.length > 0) {
      query = query.in('id', ids);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Error en getEntrenamientosService:", error);
    return { error: "Error al obtener entrenamientos." };
  }
};