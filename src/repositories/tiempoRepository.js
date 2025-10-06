import supabase from '../configs/supabase.js';

export const getTiemposByFechaYUsuario = async (fecha, id_usuario) => {
  return await supabase
    .from('UsuarioEntrenamiento')
    .select('tiempo')
    .eq('fecha', fecha)
    .eq('id_usuario', id_usuario);
};