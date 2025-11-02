import supabase from '../configs/supabase.js';

export const getPaises = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Paises')
      .select('id, pais, Bandera')
      .order('pais', { ascending: true });

    if (error || !data) {
      console.error("Error obteniendo países:", error);
      return res.status(500).json({ error: "No se pudieron obtener los países" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error interno en getPaises:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
