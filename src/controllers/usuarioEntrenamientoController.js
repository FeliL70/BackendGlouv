import supabase from '../configs/supabase.js';

// Crear un nuevo registro en UsuarioEntrenamiento
export const crearUsuarioEntrenamiento = async (req, res) => {
  const { id_usuario, id_entrenamiento, tiempo, fecha } = req.body;

  if (!id_usuario || id_entrenamiento == null || tiempo == null || !fecha) {
    return res.status(400).json({ error: "Faltan campos requeridos: id_usuario, id_entrenamiento, tiempo, fecha" });
  }

  const { data, error } = await supabase
    .from('UsuarioEntrenamiento')
    .insert([
      {
        id_usuario,
        id_entrenamiento,
        tiempo,
        fecha
      }
    ])
    .select('id')
    .single();

  if (error || !data) {
    console.error("Error creando UsuarioEntrenamiento:", error);
    return res.status(500).json({ error: "No se pudo crear el UsuarioEntrenamiento" });
  }

  return res.status(201).json({ id: data.id });
};

// Actualizar el campo 'tiempo' de un UsuarioEntrenamiento existente
export const actualizarTiempoEntrenamiento = async (req, res) => {
  const { id } = req.params;
  const { tiempo } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Falta el id del entrenamiento" });
  }
  if (tiempo == null) {
    return res.status(400).json({ error: "Falta el campo tiempo" });
  }

  const { data, error } = await supabase
    .from('UsuarioEntrenamiento')
    .update({ tiempo })
    .eq('id', id)
    .select('id, tiempo')
    .single();

  if (error || !data) {
    console.error("Error actualizando tiempo de UsuarioEntrenamiento:", error);
    return res.status(500).json({ error: "No se pudo actualizar el tiempo" });
  }

  return res.json(data);
};