import supabase from '../configs/supabase.js';


//Mostrar todos los datos de un torneo
export const getTorneoById = async (req, res) => {
  const { id_torneo } = req.params;

  try {
    const { data, error } = await supabase
      .from('Torneos')
      .select('*')
      .eq('id', id_torneo)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Error al obtener el torneo:", err);
    res.status(500).json({ error: "No se pudo obtener el torneo" });
  }
};






//Participantes de un torneo ordenados por puntuación

export const getParticipantesTorneo = async (req, res) => {
  const { id_torneo } = req.params;

  try {
    const { data, error } = await supabase
      .from('UsuarioTorneo')
      .select(`
        puntuacion,
        Usuarios ( id, nombreCompleto, fotoDePerfil )
      `)
      .eq('id_torneo', id_torneo)
      .order('puntuacion', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Error al obtener participantes:", err);
    res.status(500).json({ error: "No se pudieron obtener los participantes" });
  }
};






//Rankings Globales (semana, mes, histórico)

export const getRankingsGlobales = async (req, res) => {
  const { id_usuario } = req.query;

  try {



    //Fechas límite
    const hoy = new Date();
    const haceUnaSemana = new Date(hoy);
    haceUnaSemana.setDate(hoy.getDate() - 7);

    const haceUnMes = new Date(hoy);
    haceUnMes.setMonth(hoy.getMonth() - 1);




    //obtener ranking con fecha límite
    const obtenerRanking = async (fechaLimite = null) => {
      let query = supabase
        .from('UsuarioTorneo')
        .select(`
          id_usuario,
          puntuacion,
          Usuarios ( id, nombreCompleto, fotoDePerfil )
        `)
        .order('puntuacion', { ascending: false });

      if (fechaLimite) {
        query = query.gte('created_at', fechaLimite.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    };




    //Rankings
    const rankingSemana = await obtenerRanking(haceUnaSemana);
    const rankingMes = await obtenerRanking(haceUnMes);
    const rankingHistorico = await obtenerRanking();



    
    //calcular top 10 y puesto del usuario
    const procesarRanking = (ranking) => {
      const top10 = ranking.slice(0, 10);
      const indexUsuario = ranking.findIndex((r) => r.id_usuario === parseInt(id_usuario));
      const puestoUsuario = indexUsuario >= 0 ? indexUsuario + 1 : null;
      return { top10, puestoUsuario };
    };

    const resultado = {
      semana: procesarRanking(rankingSemana),
      mes: procesarRanking(rankingMes),
      historico: procesarRanking(rankingHistorico),
    };

    res.json(resultado);

  } catch (err) {
    console.error("Error al obtener rankings:", err);
    res.status(500).json({ error: "No se pudieron obtener los rankings globales" });
  }
};
