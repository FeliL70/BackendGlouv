// src/services/golpesService.js
import {
  getUsuariosDelTorneo,
  getGolpesDeUsuarios,
  getUsuarioEntrenamientoById,
  getSumaFuerzaUsuario,
  getUsuarioDatos,
  createGolpe                       // NUEVO 🔥
} from '../repositories/golpesRepository.js';

// ========================== RANKING DE GOLPES ============================= //
export const obtenerRankingGolpes = async (id_torneo, id_usuarioEntrenamiento) => {
  
  const { data: usuariosTorneo, error: errorTorneo } = await getUsuariosDelTorneo(id_torneo);
  if (errorTorneo) throw new Error("No se pudieron obtener usuarios del torneo");

  if (!usuariosTorneo?.length) return { ranking: [], usuario: null, suma_fuerza: 0 };

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

  const { data: golpes, error: errorGolpes } = await getGolpesDeUsuarios(idUsuarios);
  if (errorGolpes) throw new Error("No se pudieron obtener los golpes");

  golpes.forEach(g => {
    const idUsuario = g.UsuarioEntrenamiento.id_usuario;
    if (rankingMap[idUsuario]) rankingMap[idUsuario].totalFuerza += g.fuerza;
  });

  const ranking = Object.values(rankingMap).sort((a, b) => b.totalFuerza - a.totalFuerza);

  const { data: usuarioEntr } = await getUsuarioEntrenamientoById(id_usuarioEntrenamiento);
  if (!usuarioEntr) throw new Error("UsuarioEntrenamiento no encontrado");

  const id_usuario = usuarioEntr.id_usuario;

  const { data: golpesData } = await getSumaFuerzaUsuario(id_usuarioEntrenamiento);
  const { data: usuarioData } = await getUsuarioDatos(id_usuario);

  return {
    ranking,
    usuario: {
      nombreCompleto: usuarioData.nombreCompleto,
      email: usuarioData.email,
      pais: usuarioData.Paises?.pais || null
    },
    suma_fuerza: golpesData?.suma_fuerza ?? 0
  };
};


// ========================== SUMA DE GOLPES ============================= //
export const obtenerSumaGolpes = async (id_usuarioEntrenamiento) => {
  const { data } = await getSumaFuerzaUsuario(id_usuarioEntrenamiento);
  return data?.suma_fuerza ?? 0;
};


// ========================== REGISTRAR NUEVO GOLPE ============================= //
export const guardarNuevoGolpe = async (id_usuarioEntrenamiento, fuerza, id_guante) => {

  const { data, error } = await createGolpe(id_usuarioEntrenamiento, fuerza, id_guante);
  if (error) throw new Error("Error al guardar golpe");

  return data;
};
