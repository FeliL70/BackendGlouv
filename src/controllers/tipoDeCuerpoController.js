import supabase from '../configs/supabase.js';

export const getTipoDeCuerpo = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del tipo de cuerpo" });
  }

  const { data, error } = await supabase
    .from('tipoDeCuerpo')
    .select('id, cuerpo, mult')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Error obteniendo tipo de cuerpo:", error);
    return res.status(500).json({ error: "No se pudo obtener el tipo de cuerpo" });
  }

  res.json(data);
};

// 🔹 Nueva función: obtener todos los tipos de cuerpo
export const getTiposDeCuerpo = async (req, res) => {
  const { data, error } = await supabase
    .from('tipoDeCuerpo')
    .select('id, cuerpo, mult');

  if (error || !data) {
    console.error("Error obteniendo tipos de cuerpo:", error);
    return res.status(500).json({ error: "No se pudieron obtener los tipos de cuerpo" });
  }

  res.json(data);
};