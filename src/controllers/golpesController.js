// src/controllers/golpesController.js
import { obtenerRankingGolpes } from '../services/golpesService.js';

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
