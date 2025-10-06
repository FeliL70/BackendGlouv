import supabase from '../configs/supabase.js';

export const getSumaGolpesService = async (id_usuarioEntrenamiento) => {
  try {
    const { data, error } = await supabase
      .from('Golpes')
      .select('suma_fuerza:sum(fuerza)')
      .eq('id_usuarioEntrenamiento', id_usuarioEntrenamiento)
      .single();

    if (error) throw error;
    return { data: { sumaFuerza: data?.suma_fuerza || 0 } };
  } catch (error) {
    console.error("Error en getSumaGolpesService:", error);
    return { error: "No se pudo calcular la suma" };
  }
};

export const registrarGolpeService = async (id_usuarioEntrenamiento, fuerza, id_guante) => {
  try {
    const { data, error } = await supabase
      .from('Golpes')
      .insert([{ id_usuarioEntrenamiento, fuerza, id_guante }])
      .select()
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Error en registrarGolpeService:", error);
    return { error: "No se pudo registrar el golpe" };
  }
};

export const getRankingGolpesService = async (id_torneo) => {
  try {
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

    if (errorTorneo) throw errorTorneo;
    if (!usuariosTorneo || usuariosTorneo.length === 0) return { data: [] };

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

    if (errorGolpes) throw errorGolpes;

    golpes.forEach(golpe => {
      const idUsuario = golpe.UsuarioEntrenamiento.id_usuario;
      if (rankingMap[idUsuario]) {
        rankingMap[idUsuario].totalFuerza += golpe.fuerza;
      }
    });

    const ranking = Object.values(rankingMap).sort((a, b) => b.totalFuerza - a.totalFuerza);
    return { data: ranking };
  } catch (error) {
    console.error("Error en getRankingGolpesService:", error);
    return { error: "No se pudo obtener el ranking" };
  }
};