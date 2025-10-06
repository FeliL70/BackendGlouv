import supabase from '../configs/supabase.js';

export const getPerfilService = async (id) => {
  try {
    const { data, error } = await supabase
      .from('Usuarios')
      .select('fotoDePerfil, nombreCompleto, fotoDeFondo, fechaDeNacimiento, email, descripcion')
      .eq('id', id)
      .single();

    if (error || !data) throw error;

    return { data };
  } catch (error) {
    console.error("Error en getPerfilService:", error);
    return { error: "No se pudo obtener el perfil" };
  }
};