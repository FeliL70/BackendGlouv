// src/repositories/golpesRepository.js
import supabase from '../configs/supabase.js';

export const getUsuariosDelTorneo = async (id_torneo) => {
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

export const getGolpesDeUsuarios = async (idUsuarios) => {
  return await supabase
    .from('Golpes')
    .select(`
      fuerza,
      id_usuarioEntrenamiento,
      UsuarioEntrenamiento ( id_usuario )
    `)
    .in('UsuarioEntrenamiento.id_usuario', idUsuarios);
};

export const getUsuarioEntrenamientoById = async (id_usuarioEntrenamiento) => {
  return await supabase
    .from('UsuarioEntrenamiento')
    .select('id_usuario')
    .eq('id', id_usuarioEntrenamiento)
    .single();
};

export const getSumaFuerzaUsuario = async (id_usuarioEntrenamiento) => {
  return await supabase
    .from('Golpes')
    .select('suma_fuerza:sum(fuerza)')
    .eq('id_usuarioEntrenamiento', id_usuarioEntrenamiento)
    .single();
};

export const getUsuarioDatos = async (id_usuario) => {
  return await supabase
    .from('Usuarios')
    .select(`
      nombreCompleto,
      email,
      Paises ( pais )
    `)
    .eq('id', id_usuario)
    .single();
};
