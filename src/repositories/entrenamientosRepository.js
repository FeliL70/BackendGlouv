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