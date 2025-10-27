import supabase from '../configs/supabase.js';
import express from 'express';

const app = express();

//Obtener estadísticas del día
export const getEstadisticasDelDia = async (req, res) => {
  const { id_usuario } = req.query;

  if (!id_usuario) {
    return res.status(400).json({ error: "Falta el ID del usuario" });
  }

  const hoy = new Date().toISOString().split('T')[0];

  try {
    //Duración total de los rounds del día
    const { data: entrenamientosData, error: entrenamientosError } = await supabase
      .from('UsuarioEntrenamiento')
      .select('tiempo')
      .eq('fecha', hoy)
      .eq('id_usuario', id_usuario);

    if (entrenamientosError) throw entrenamientosError;

    const duracion_total_dia =
      entrenamientosData?.reduce((acc, e) => acc + (e.tiempo || 0), 0) || 0;



    //Promedio de fuerza por golpe
    const { data: fuerzaData, error: fuerzaError } = await supabase
      .from('Golpes')
      .select('fuerza, id_usuarioEntrenamiento!inner(id_usuario, fecha)')
      .eq('id_usuarioEntrenamiento.id_usuario', id_usuario)
      .eq('id_usuarioEntrenamiento.fecha', hoy);

    if (fuerzaError) throw fuerzaError;

    const promedio_fuerza_golpes =
      fuerzaData?.length > 0
        ? fuerzaData.reduce((sum, g) => sum + g.fuerza, 0) / fuerzaData.length
        : 0;




    //Cantidad de rounds del día
    const cantidad_rounds_dia = entrenamientosData?.length || 0;




    //Cantidad de golpes del día
    const { data: golpesData, error: golpesError } = await supabase
      .from('Golpes')
      .select('id, id_usuarioEntrenamiento!inner(id_usuario, fecha)')
      .eq('id_usuarioEntrenamiento.id_usuario', id_usuario)
      .eq('id_usuarioEntrenamiento.fecha', hoy);

    if (golpesError) throw golpesError;

    const cantidad_golpes_dia = golpesData?.length || 0;




    //Respuesta final
    return res.json({
      duracion_total_dia,
      promedio_fuerza_golpes,
      cantidad_rounds_dia,
      cantidad_golpes_dia,
    });

  } catch (error) {
    console.error("Error al obtener estadísticas del día:", error);
    return res.status(500).json({ error: "Error al obtener estadísticas del día" });
  }
};




//Obtener estadísticas de una fecha seleccionada
app.get('/estadisticas/:id_usuario/:fechaSeleccionada', async (req, res) => {
  try {
    const { id_usuario, fechaSeleccionada } = req.params;




    //Golpe más fuerte del día
    const { data: golpeMaxDia, error: errDia } = await supabase
      .from('Golpes')
      .select('fuerza, id_usuarioEntrenamiento!inner(id_usuario, fecha)')
      .eq('id_usuarioEntrenamiento.id_usuario', id_usuario)
      .eq('id_usuarioEntrenamiento.fecha', fechaSeleccionada)
      .order('fuerza', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (errDia) throw errDia;
    const golpe_mas_fuerte_dia = golpeMaxDia?.fuerza || 0;




    //Golpe más fuerte de la semana
    const fechaInicioSemana = new Date(fechaSeleccionada);
    fechaInicioSemana.setDate(fechaInicioSemana.getDate() - 7);
    const inicioSemanaISO = fechaInicioSemana.toISOString().split('T')[0];

    const { data: golpeMaxSemana, error: errSemana } = await supabase
      .from('Golpes')
      .select('fuerza, id_usuarioEntrenamiento!inner(id_usuario, fecha)')
      .eq('id_usuarioEntrenamiento.id_usuario', id_usuario)
      .gte('id_usuarioEntrenamiento.fecha', inicioSemanaISO)
      .lte('id_usuarioEntrenamiento.fecha', fechaSeleccionada)
      .order('fuerza', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (errSemana) throw errSemana;
    const golpe_mas_fuerte_semana = golpeMaxSemana?.fuerza || 0;




    //Golpe más fuerte del mes
    const fechaInicioMes = new Date(fechaSeleccionada);
    fechaInicioMes.setDate(1);
    const inicioMesISO = fechaInicioMes.toISOString().split('T')[0];

    const { data: golpeMaxMes, error: errMes } = await supabase
      .from('Golpes')
      .select('fuerza, id_usuarioEntrenamiento!inner(id_usuario, fecha)')
      .eq('id_usuarioEntrenamiento.id_usuario', id_usuario)
      .gte('id_usuarioEntrenamiento.fecha', inicioMesISO)
      .lte('id_usuarioEntrenamiento.fecha', fechaSeleccionada)
      .order('fuerza', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (errMes) throw errMes;
    const golpe_mas_fuerte_mes = golpeMaxMes?.fuerza || 0;




    //Golpe más fuerte histórico
    const { data: golpeMaxHistorico, error: errHist } = await supabase
      .from('Golpes')
      .select('fuerza, id_usuarioEntrenamiento!inner(id_usuario, fecha)')
      .eq('id_usuarioEntrenamiento.id_usuario', id_usuario)
      .order('fuerza', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (errHist) throw errHist;
    const golpe_mas_fuerte_historico = golpeMaxHistorico?.fuerza || 0;




    //Respuesta final
    const estadisticas = {
      golpe_mas_fuerte_dia,
      golpe_mas_fuerte_semana,
      golpe_mas_fuerte_mes,
      golpe_mas_fuerte_historico
    };

    res.json(estadisticas);

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});
