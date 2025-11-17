import supabase from '../configs/supabase.js';

export const TorneosRepository = {
  
  getAll: async () => {
    return await supabase
      .from('Torneos')
      .select('id, nombre, capacidad, tipoPrivacidad, duracion, descripcion, id_nivel');
  },

  create: async (torneo) => {
    return await supabase
      .from('Torneos')
      .insert([torneo])
      .select()
      .single();
  },

  findByNombreYPass: async (nombre, contrasenia) => {
    return await supabase
      .from('Torneos')
      .select('id, nombre, contrasenia, capacidad')
      .eq('nombre', nombre)
      .eq('contrasenia', contrasenia)
      .maybeSingle();
  },

  checkUsuarioEnTorneo: async (id_usuario, id_torneo) => {
    return await supabase
      .from('UsuarioTorneo')
      .select('id')
      .eq('id_usuario', id_usuario)
      .eq('id_torneo', id_torneo)
      .maybeSingle();
  },

  addUsuarioATorneo: async (id_usuario, id_torneo) => {
    return await supabase
      .from('UsuarioTorneo')
      .insert([{ id_usuario, id_torneo, puntuacion: 0 }]);
  },

  findUsuarioTorneo: async (id_usuario, id_torneo) => {
    return await supabase
      .from('UsuarioTorneo')
      .select('id, puntuacion')
      .eq('id_usuario', id_usuario)
      .eq('id_torneo', id_torneo)
      .maybeSingle();
  },

  updatePuntuacion: async (id, puntos) => {
    return await supabase
      .from('UsuarioTorneo')
      .update({ puntuacion: puntos })
      .eq('id', id);
  },

  findTorneosByUsuario: async (id_usuario) => {
    return await supabase
      .from('UsuarioTorneo')
      .select(`
        id_torneo,
        puntuacion,
        Torneos (
          id, nombre, capacidad, tipoPrivacidad, duracion, descripcion
        )
      `)
      .eq('id_usuario', id_usuario);
  },

  findParticipantes: async (id_torneo) => {
    return await supabase
      .from('UsuarioTorneo')
      .select(`
        id_usuario,
        puntuacion,
        Usuarios (nombreCompleto, fotoDePerfil)
      `)
      .eq('id_torneo', id_torneo)
      .order('puntuacion', { ascending: false });
  }

};