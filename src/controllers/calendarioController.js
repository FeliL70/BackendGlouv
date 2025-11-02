import supabase from '../configs/supabase.js';

export const getEstadisticasPorFecha = async (req, res) => {
  const { id_usuario, fecha } = req.query;
  if (!id_usuario || !fecha) {
    return res.status(400).json({ error: "Faltan parámetros: id_usuario o fecha" });
  }

  try {
    // --- Fechas base ---
    const inicioDelDia = new Date(fecha + 'T00:00:00');
    const finDelDia = new Date(fecha + 'T23:59:59.999');
    const inicioISO = inicioDelDia.toISOString();
    const finISO = finDelDia.toISOString();

    // --- Golpe más fuerte del día ---
    const { data: golpeMaxDia, error: errDia } = await supabase
      .from('Golpes')
      .select('fuerza, id_usuarioEntrenamiento!inner(id_usuario, fecha)')
      .eq('id_usuarioEntrenamiento.id_usuario', id_usuario)
      .gte('id_usuarioEntrenamiento.fecha', inicioISO)
      .lte('id_usuarioEntrenamiento.fecha', finISO)
      .order('fuerza', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (errDia) throw errDia;
    const golpe_mas_fuerte_dia = golpeMaxDia?.fuerza || 0;

    // --- Semana (últimos 7 días incluyendo fecha) ---
    const inicioSemana = new Date(inicioDelDia);
    inicioSemana.setDate(inicioSemana.getDate() - 6);
    const inicioSemanaISO = inicioSemana.toISOString();

    const { data: golpeMaxSemana, error: errSemana } = await supabase
      .from('Golpes')
      .select('fuerza, id_usuarioEntrenamiento!inner(id_usuario, fecha)')
      .eq('id_usuarioEntrenamiento.id_usuario', id_usuario)
      .gte('id_usuarioEntrenamiento.fecha', inicioSemanaISO)
      .lte('id_usuarioEntrenamiento.fecha', finISO)
      .order('fuerza', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (errSemana) throw errSemana;
    const golpe_mas_fuerte_semana = golpeMaxSemana?.fuerza || 0;

    // --- Mes (desde primer día del mes de `fecha`) ---
    const inicioMes = new Date(inicioDelDia);
    inicioMes.setDate(1);
    const inicioMesISO = inicioMes.toISOString();

    const { data: golpeMaxMes, error: errMes } = await supabase
      .from('Golpes')
      .select('fuerza, id_usuarioEntrenamiento!inner(id_usuario, fecha)')
      .eq('id_usuarioEntrenamiento.id_usuario', id_usuario)
      .gte('id_usuarioEntrenamiento.fecha', inicioMesISO)
      .lte('id_usuarioEntrenamiento.fecha', finISO)
      .order('fuerza', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (errMes) throw errMes;
    const golpe_mas_fuerte_mes = golpeMaxMes?.fuerza || 0;

    // --- Histórico ---
    const { data: golpeMaxHistorico, error: errHist } = await supabase
      .from('Golpes')
      .select('fuerza, id_usuarioEntrenamiento!inner(id_usuario)')
      .eq('id_usuarioEntrenamiento.id_usuario', id_usuario)
      .order('fuerza', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (errHist) throw errHist;
    const golpe_mas_fuerte_historico = golpeMaxHistorico?.fuerza || 0;

    // --- Entrenamientos del día ---
    const { data: entrenamientosData, error: errEntrenamientos } = await supabase
      .from('UsuarioEntrenamiento')
      .select('id, tiempo')
      .eq('id_usuario', id_usuario)
      .gte('fecha', inicioISO)
      .lte('fecha', finISO);
    if (errEntrenamientos) throw errEntrenamientos;

    // Duración total (conversión del tipo time a segundos)
    const duracion_total_dia =
      entrenamientosData?.reduce((acc, e) => {
        if (!e.tiempo) return acc;
        const [h, m, s] = e.tiempo.split(':').map(Number);
        return acc + (h * 3600 + m * 60 + s);
      }, 0) || 0;

    const cantidad_rounds_dia = entrenamientosData?.length || 0;

    // --- Golpes del día ---
    const { data: golpesData, error: errGolpes } = await supabase
      .from('Golpes')
      .select('id, id_usuarioEntrenamiento!inner(id_usuario, fecha)')
      .eq('id_usuarioEntrenamiento.id_usuario', id_usuario)
      .gte('id_usuarioEntrenamiento.fecha', inicioISO)
      .lte('id_usuarioEntrenamiento.fecha', finISO);
    if (errGolpes) throw errGolpes;

    const cantidad_golpes_dia = golpesData?.length || 0;

    // --- Respuesta ---
    const estadisticas = {
      duracion_total_dia, // en segundos
      cantidad_rounds_dia,
      cantidad_golpes_dia,
      golpe_mas_fuerte_dia,
      golpe_mas_fuerte_semana,
      golpe_mas_fuerte_mes,
      golpe_mas_fuerte_historico,
    };

    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
