export const getRankingGolpes = async (req, res) => {
  const { id_torneo, id_usuarioEntrenamiento } = req.query;

  if (!id_torneo) {
    return res.status(400).json({ error: "Falta el id_torneo" });
  }
  if (!id_usuarioEntrenamiento) {
    return res.status(400).json({ error: "Falta el id_usuarioEntrenamiento" });
  }

  //Obtener usuarios del torneo
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
    .eq('id_torneo', id_torneo);

  if (errorTorneo) {
    console.error("Error obteniendo usuarios del torneo:", errorTorneo);
    return res.status(500).json({ error: "No se pudieron obtener los usuarios del torneo" });
  }

  if (!usuariosTorneo || usuariosTorneo.length === 0) {
    return res.json([]);
  }

  //Mapa para ranking
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

  //Obtener golpes de todos los usuarios del torneo
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

  // Acumular golpes
  golpes.forEach(golpe => {
    const idUsuario = golpe.UsuarioEntrenamiento.id_usuario;
    if (rankingMap[idUsuario]) {
      rankingMap[idUsuario].totalFuerza += golpe.fuerza;
    }
  });

  const ranking = Object.values(rankingMap).sort((a, b) => b.totalFuerza - a.totalFuerza);

 
  //Obtener datos del usuario actual
  //conseguir id_usuario desde UsuarioEntrenamiento
  const { data: usuarioEntr, error: errUE } = await supabase
    .from('UsuarioEntrenamiento')
    .select('id_usuario')
    .eq('id', id_usuarioEntrenamiento)
    .single();

  if (errUE || !usuarioEntr) {
    return res.status(400).json({ error: 'UsuarioEntrenamiento no encontrado' });
  }

  const id_usuario = usuarioEntr.id_usuario;

  //suma total de golpes del usuario
  const { data: golpesData, error: golpesError } = await supabase
    .from('Golpes')
    .select('suma_fuerza:sum(fuerza)')
    .eq('id_usuarioEntrenamiento', id_usuarioEntrenamiento)
    .single();

  if (golpesError) {
    return res.status(400).json({ error: 'Error obteniendo golpes' });
  }

  //datos del usuario + país
  const { data: usuarioData, error: userError } = await supabase
    .from('Usuarios')
    .select(`
      nombreCompleto,
      email,
      Paises (
        pais
      )
    `)
    .eq('id', id_usuario)
    .single();

  if (userError) {
    return res.status(400).json({ error: 'Error obteniendo datos del usuario' });
  }

  
  //RESPUESTA FINAL COMBINADA
  return res.json({
    ranking,
    usuario: {
      nombreCompleto: usuarioData.nombreCompleto,
      email: usuarioData.email,
      pais: usuarioData.Paises?.pais || null
    },
    suma_fuerza: golpesData.suma_fuerza || 0
  });
};
