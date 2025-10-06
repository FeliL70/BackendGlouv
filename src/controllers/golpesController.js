import supabase from '../configs/supabase.js';

export const getSumaGolpes = async (req, res) => {
  const { id_usuarioEntrenamiento } = req.query;

  if (!id_usuarioEntrenamiento) {
    return res.status(400).json({ error: "Falta el id_usuarioEntrenamiento" });
  }

  const { data, error } = await supabase
    .from('Golpes')
    .select('suma_fuerza:sum(fuerza)')
    .eq('id_usuarioEntrenamiento', id_usuarioEntrenamiento)
    .single();

  if (error) {
    console.error("Error sumando golpes:", error);
    return res.status(500).json({ error: "No se pudo calcular la suma" });
  }

  res.json({
    id_usuarioEntrenamiento,
    sumaFuerza: data?.suma_fuerza || 0
  });
};

export const postGolpe = async (req, res) => {
  const { id_usuarioEntrenamiento, fuerza, id_guante } = req.body;

  if (!id_usuarioEntrenamiento || !fuerza) {
    return res.status(400).json({ error: "Faltan campos obligatorios: id_usuarioEntrenamiento o fuerza" });
  }

  const { data, error } = await supabase
    .from('Golpes')
    .insert([{ id_usuarioEntrenamiento, fuerza, id_guante }])
    .select()
    .single();

  if (error) {
    console.error("Error insertando golpe:", error);
    return res.status(500).json({ error: "No se pudo registrar el golpe" });
  }

  res.json({ golpe: data });
};

export const getRankingGolpes = async (req, res) => {
  const { id } = req.params;

  const { data: usuariosTorneo, error: errorTorneo } = await supabase
    .from('UsuarioTorneo')
    .select(`
      id_usuario,
      Usuarios (
        id,
        nombreCompleto,
        email,
        fotoDePerfil
      )
    `)
    .eq('id_torneo', id);

  if (errorTorneo) {
    console.error("Error obteniendo usuarios del torneo:", errorTorneo);
    return res.status(500).json({ error: "No se pudieron obtener los usuarios del torneo" });
  }

  if (!usuariosTorneo || usuariosTorneo.length === 0) {
    return res.json([]);
  }

  const rankingMap = {};
  usuariosTorneo.forEach(u => {
    rankingMap[u.Usuarios.id] = {
      id: u.Usuarios.id,
      nombreCompleto: u.Usuarios.nombreCompleto,
      email: u.Usuarios.email,
      fotoDePerfil: u.Usuarios.fotoDePerfil,
      totalFuerza: 0
    };
  });

  const { data: golpes, error: errorGolpes } = await supabase
    .from('Golpes')
    .select(`
      fuerza,
      UsuarioEntrenamiento (
        id_usuario
      )
    `)
    .in('UsuarioEntrenamiento.id_usuario', Object.keys(rankingMap));

  if (errorGolpes) {
    console.error("Error obteniendo golpes:", errorGolpes);
    return res.status(500).json({ error: "No se pudieron obtener los golpes" });
  }

  golpes.forEach(golpe => {
    const idUsuario = golpe.UsuarioEntrenamiento.id_usuario;
    if (rankingMap[idUsuario]) {
      rankingMap[idUsuario].totalFuerza += golpe.fuerza;
    }
  });

  const ranking = Object.values(rankingMap).sort((a, b) => b.totalFuerza - a.totalFuerza);

  res.json(ranking);
};