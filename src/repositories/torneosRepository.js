// src/repositories/torneosRepository.js
import supabase from '../configs/supabase.js';

export const TorneosRepository = {
  // Obtener todos los torneos
  getAll: async () => {
    return await supabase
      .from('Torneos')
      .select('*');
  },

  // Crear torneo
  create: async (torneoData) => {
    return await supabase
      .from('Torneos')
      .insert([torneoData])
      .select()
      .single();
  },

  // Buscar torneo por nombre + contrasenia
  findByNombreYPass: async (nombre, contrasenia) => {
    return await supabase
      .from('Torneos')
      .select('*')
      .eq('nombre', nombre)
      .eq('contrasenia', contrasenia)
      .single();
  },

  // Verificar si un usuario ya está en ese torneo
  checkUsuarioEnTorneo: async (id_usuario, id_torneo) => {
    return await supabase
      .from('UsuarioTorneo')
      .select('*')
      .eq('id_usuario', id_usuario)
      .eq('id_torneo', id_torneo)
      .single();
  },

  // Agregar usuario al torneo (UsuarioTorneo)
  addUsuarioATorneo: async (id_usuario, id_torneo) => {
    return await supabase
      .from('UsuarioTorneo')
      .insert([{ id_usuario, id_torneo, puntuacion: 0 }])
      .select()
      .single();
  },

  // Buscar registro UsuarioTorneo por usuario + torneo
  findUsuarioTorneo: async (id_usuario, id_torneo) => {
    return await supabase
      .from('UsuarioTorneo')
      .select('*')
      .eq('id_usuario', id_usuario)
      .eq('id_torneo', id_torneo)
      .single();
  },

  // Actualizar puntuacion en UsuarioTorneo (por id registro)
  updatePuntuacion: async (id_usuarioTorneo, puntuacion) => {
    return await supabase
      .from('UsuarioTorneo')
      .update({ puntuacion })
      .eq('id', id_usuarioTorneo);
  },

  // Obtener torneos en los que participa un usuario
  findTorneosByUsuario: async (id_usuario) => {
    return await supabase
      .from('UsuarioTorneo')
      .select(`
        id_torneo,
        Torneos ( id, nombre, descripcion, fechaInicio )
      `)
      .eq('id_usuario', id_usuario);
  },

  // Obtener participantes de un torneo (lista de usuarios con puntaje)
  findParticipantes: async (id_torneo) => {
    return await supabase
      .from('UsuarioTorneo')
      .select(`
        id,
        puntuacion,
        Usuarios ( id, nombreCompleto, email, fotoDePerfil )
      `)
      .eq('id_torneo', id_torneo);
  }
};
