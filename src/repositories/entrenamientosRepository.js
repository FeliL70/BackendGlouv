import supabase from '../configs/supabase.js';

export const getAllEntrenamientos = async () => {
  return await supabase
    .from('Entrenamientos')
    .select('id, nombre, foto, descripcion, duracion');
};

export const getEntrenamientosByIds = async (ids) => {
  return await supabase
    .from('Entrenamientos')
    .select('id, nombre, foto, descripcion, duracion')
    .in('id', ids);
};

export const getEntrenamientoRealtime = async (userId, entrenamientoId) => {
  return await supabase
    .from('Usuarios')
    .select(`
      nombre,
      email,
      pais,
      EntrenamientosUsuario (
        id,
        golpes
      )
    `)
    .eq('id', userId)
    .eq('EntrenamientosUsuario.entrenamiento_id', entrenamientoId)
    .single();
};
