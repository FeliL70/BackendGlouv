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

export const getEntrenamientoRealtimeService = async (userId, entrenamientoId) => {
  const { data, error } = await getEntrenamientoRealtime(userId, entrenamientoId);

  if (error) throw error;

  return {
    nombre: data.nombre,
    email: data.email,
    pais: data.pais,
    golpes: data.EntrenamientosUsuario[0]?.golpes || 0
  };
};
