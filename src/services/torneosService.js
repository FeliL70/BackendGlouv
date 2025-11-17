import { TorneosRepository } from '../repositories/torneosRepository.js';

export const TorneosService = {

  getTorneos: async () => {
    const { data, error } = await TorneosRepository.getAll();
    if (error) throw error;
    return data;
  },

  crearTorneo: async (torneoData) => {
    const { data, error } = await TorneosRepository.create(torneoData);
    if (error) throw error;
    return data;
  },

  unirseATorneo: async (id_usuario, nombre, contrasenia) => {
    const { data: torneo } = await TorneosRepository.findByNombreYPass(nombre, contrasenia);
    if (!torneo) return { error: "Torneo no encontrado o contraseña incorrecta" };

    const { data: yaUnido } = await TorneosRepository.checkUsuarioEnTorneo(id_usuario, torneo.id);
    if (yaUnido) return { error: "El usuario ya está en este torneo" };

    await TorneosRepository.addUsuarioATorneo(id_usuario, torneo.id);
    return { mensaje: `Usuario unido al torneo ${torneo.nombre}` };
  },

  actualizarPuntosDeTorneo: async (id_usuario, id_torneo, puntosSumar) => {
    const { data: usuarioTorneo } = await TorneosRepository.findUsuarioTorneo(id_usuario, id_torneo);
    if (!usuarioTorneo) throw new Error("El usuario no está registrado en el torneo");

    const nuevaPuntuacion = usuarioTorneo.puntuacion + puntosSumar;
    await TorneosRepository.updatePuntuacion(usuarioTorneo.id, nuevaPuntuacion);
    return { mensaje: "Puntos actualizados", nuevaPuntuacion };
  },

  torneosDelUsuario: async (id_usuario) => {
    const { data, error } = await TorneosRepository.findTorneosByUsuario(id_usuario);
    if (error) throw error;
    return data;
  },

  participantesDelTorneo: async (id_torneo) => {
    const { data, error } = await TorneosRepository.findParticipantes(id_torneo);
    if (error) throw error;
    return data;
  }

};