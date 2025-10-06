import supabase from '../configs/supabase.js';

export const getUserProfileById = async (id) => {
  return await supabase
    .from('Usuarios')
    .select('fotoDePerfil, nombreCompleto, fotoDeFondo, fechaDeNacimiento, email, descripcion')
    .eq('id', id)
    .single();
};