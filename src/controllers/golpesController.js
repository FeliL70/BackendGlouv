// src/controllers/golpesController.js
import { obtenerRankingGolpes, obtenerSumaGolpes, guardarNuevoGolpe } from '../services/golpesService.js';

// 👉 RANKING DE GOLPES
export const getRankingGolpes = async (req, res) => {
  try {
    const { id_torneo, id_usuarioEntrenamiento } = req.query;

    if (!id_torneo)
      return res.status(400).json({ error: "Falta el id_torneo" });

    if (!id_usuarioEntrenamiento)
      return res.status(400).json({ error: "Falta el id_usuarioEntrenamiento" });

    const resultados = await obtenerRankingGolpes(id_torneo, id_usuarioEntrenamiento);
    res.json(resultados);

  } catch (error) {
    console.error("Error en getRankingGolpes:", error);
    res.status(500).json({ error: error.message });
  }
};

// 👉 SUMA TOTAL DE GOLPES DEL USUARIO
export const getSumaGolpes = async (req, res) => {
  try {
    const { id_usuarioEntrenamiento } = req.query;

    if (!id_usuarioEntrenamiento)
      return res.status(400).json({ error: "Falta el id_usuarioEntrenamiento" });

    const suma = await obtenerSumaGolpes(id_usuarioEntrenamiento);
    res.json({ totalGolpes: suma });

  } catch (error) {
    console.error("Error en getSumaGolpes:", error);
    res.status(500).json({ error: error.message });
  }
};

// 👉 GUARDAR NUEVO GOLPE
export const postGolpe = async (req, res) => {
  try {
    const { id_usuarioEntrenamiento, fuerza, id_guante } = req.body;

    if (!id_usuarioEntrenamiento || !fuerza)
      return res.status(400).json({ error: "Faltan datos" });

    const resultado = await guardarNuevoGolpe(id_usuarioEntrenamiento, fuerza, id_guante);
    res.json({ message: "Golpe registrado con éxito", data: resultado });

  } catch (error) {
    console.error("Error en postGolpe:", error);
    res.status(500).json({ error: error.message });
  }
};
