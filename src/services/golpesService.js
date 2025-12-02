// src/services/golpesService.js
import {
  getUsuariosDelTorneo,
  getGolpesDeUsuarios,
  getUsuarioEntrenamientoById,
  getSumaFuerzaUsuario,
  getUsuarioDatos
} from '../repositories/golpesRepository.js';

export const obtenerRankingGolpes = async (id_torneo, id_usuarioEntrenamiento) => {
  
  // Obtener usuarios del torneo
  const { data: usuariosTorneo, error: errorTorneo } = await getUsuariosDelTorneo(id_torneo);

  if (errorTorneo) throw new Error("No se pudieron obtener usuarios del torneo");

  if (!usuariosTorneo || usuariosTorneo.length === 0) {
    return { ranking: [], usuario: null, suma_fuerza: 0 };
  }

  // Crear ranking base
  const rankingMap = {};
  const idUsuarios = [];

  usuariosTorneo.forEach(u => {
    rankingMap[u.Usuarios.id] = {
      id: u.Usuarios.id,
      nombreCompleto: u.Usuarios.nombreCompleto,
      email: u.Usuarios.email,
      fotoDePerfil: u.Usuarios.fotoDePerfil,
      totalFuerza: 0
    };
    idUsuarios.push(u.Usuarios.id);
  });

  // Obtener golpes de todos los usuarios del torneo
  const { data: golpes, error: errorGolpes } = await getGolpesDeUsuarios(idUsuarios);

  if (errorGolpes) throw new Error("No se pudieron obtener los golpes");

  // Acumular fuerza por usuario
  golpes.forEach(g => {
    const idUsuario = g.UsuarioEntrenamiento.id_usuario;
    if (rankingMap[idUsuario]) {
      rankingMap[idUsuario].totalFuerza += g.fuerza;
    }
  });

  const ranking = Object.values(rankingMap).sort((a, b) => b.totalFuerza - a.totalFuerza);

  // Obtener datos del usuario actual
  const { data: usuarioEntr } = await getUsuarioEntrenamientoById(id_usuarioEntrenamiento);
  if (!usuarioEntr) throw new Error("UsuarioEntrenamiento no encontrado");

  const id_usuario = usuarioEntr.id_usuario;

  // Suma total de fuerza del usuario
  const { data: golpesData } = await getSumaFuerzaUsuario(id_usuarioEntrenamiento);

  // Datos del usuario (incluye país)
  const { data: usuarioData } = await getUsuarioDatos(id_usuario);

  return {
    ranking,
    usuario: {
      nombreCompleto: usuarioData.nombreCompleto,
      email: usuarioData.email,
      pais: usuarioData.Paises?.pais || null
    },
    suma_fuerza: golpesData?.suma_fuerza || 0
  };
};
