import supabase from '../configs/supabase.js';

export const getSumaDeGolpes = async (id_usuarioEntrenamiento) => {
  return await supabase
    .from('Golpes')
    .select('suma_fuerza:sum(fuerza)')
    .eq('id_usuarioEntrenamiento', id_usuarioEntrenamiento)
    .single();
};

export const insertGolpe = async (id_usuarioEntrenamiento, fuerza, id_guante) => {
  return await supabase
    .from('Golpes')
    .insert([{ id_usuarioEntrenamiento, fuerza, id_guante }])
    .select()
    .single();
};

export const getUsuariosTorneo = async (id_torneo) => {
  return await supabase
    .from('UsuarioTorneo')
    .select(`
      id_usuario,
      Usuarios (
        id,
        nombreCompleto,
        email,
        fotoDePerfil
      )
    `)
    .eq('id_torneo', id_torneo);
};

export const getGolpesByUsuarios = async (idsUsuarios) => {
  return await supabase
    .from('Golpes')
    .select(`
      fuerza,
      UsuarioEntrenamiento (
        id_usuario
      )
    `)
    .in('UsuarioEntrenamiento.id_usuario', idsUsuarios);
};