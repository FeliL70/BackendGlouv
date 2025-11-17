import { TorneosService } from '../services/torneosService.js';

/* Obtener todos los torneos */
export const getTorneos = async (req, res) => {
  try {
    const torneos = await TorneosService.getTorneos();
    res.json(torneos);
  } catch (error) {
    console.error("Error obteniendo torneos:", error);
    res.status(500).json({ error: "No se pudieron obtener los torneos" });
  }
};

/* Crear torneo */
export const crearTorneo = async (req, res) => {
  try {
    const torneo = await TorneosService.crearTorneo(req.body);
    res.json({ mensaje: "Torneo creado exitosamente", torneo });
  } catch (error) {
    console.error("Error creando torneo:", error);
    res.status(500).json({ error: "No se pudo crear el torneo" });
  }
};

/* Unirse a torneo */
export const unirseATorneo = async (req, res) => {
  try {
    const { id_usuario, nombre, contrasenia } = req.body;
    const result = await TorneosService.unirseATorneo(id_usuario, nombre, contrasenia);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error uniendo usuario al torneo:", error);
    res.status(500).json({ error: "No se pudo unir al torneo" });
  }
};

/* Torneos donde participa un usuario */
export const getTorneosDelUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.query;
    const data = await TorneosService.torneosDelUsuario(id_usuario);
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo torneos del usuario:", error);
    res.status(500).json({ error: "No se pudieron obtener los torneos donde participa" });
  }
};

/* Participantes de un torneo */
export const getParticipantesTorneo = async (req, res) => {
  try {
    const { id_torneo } = req.query;
    const data = await TorneosService.participantesDelTorneo(id_torneo);
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo participantes:", error);
    res.status(500).json({ error: "No se pudieron obtener los participantes" });
  }
};
