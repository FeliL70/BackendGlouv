import supabase from '../configs/supabase.js';

/*Obtener todos los torneos*/
export const getTorneos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Torneos')
      .select('id, nombre, capacidad, tipoPrivacidad, duracion, descripcion, id_nivel');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo torneos:", error);
    res.status(500).json({ error: "No se pudieron obtener los torneos" });
  }
};

/*Crear torneo*/
export const crearTorneo = async (req, res) => {
  const { nombre, contrasenia, capacidad, tipoPrivacidad, duracion, descripcion, id_nivel, creadoPor } = req.body;

  if (!nombre || !contrasenia || !creadoPor) {
    return res.status(400).json({ error: "Faltan datos: nombre, contraseña o creador" });
  }

  try {
    const { data, error } = await supabase
      .from('Torneos')
      .insert([{
        nombre,
        contrasenia,
        capacidad: capacidad || 10,
        tipoPrivacidad: tipoPrivacidad || false,
        duracion: duracion || 7,
        descripcion: descripcion || '',
        id_nivel: id_nivel || null,
        creadoPor
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ mensaje: "Torneo creado exitosamente", torneo: data });
  } catch (error) {
    console.error("Error creando torneo:", error);
    res.status(500).json({ error: "No se pudo crear el torneo" });
  }
};

/*Unirse a un torneo*/
export const unirseATorneo = async (req, res) => {
  const { id_usuario, nombre, contrasenia } = req.body;

  if (!id_usuario || !nombre || !contrasenia) {
    return res.status(400).json({ error: "Faltan datos: usuario, nombre o contraseña" });
  }

  try {
    const { data: torneo } = await supabase
      .from('Torneos')
      .select('id, nombre, contrasenia, capacidad')
      .eq('nombre', nombre)
      .eq('contrasenia', contrasenia)
      .maybeSingle();

    if (!torneo) {
      return res.status(404).json({ error: "Torneo no encontrado o contraseña incorrecta" });
    }

    const { data: yaUnido } = await supabase
      .from('UsuarioTorneo')
      .select('id')
      .eq('id_usuario', id_usuario)
      .eq('id_torneo', torneo.id)
      .maybeSingle();

    if (yaUnido) {
      return res.status(400).json({ error: "El usuario ya está en este torneo" });
    }

    await supabase
      .from('UsuarioTorneo')
      .insert([{ id_usuario, id_torneo: torneo.id, puntuacion: 0 }]);

    res.json({ mensaje: `Usuario unido al torneo ${torneo.nombre}` });
  } catch (error) {
    console.error("Error al unirse al torneo:", error);
    res.status(500).json({ error: "No se pudo unir al torneo" });
  }
};

/*Ranking Global (día, mes, total)*/
export const getRankingGlobal = async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const primerDiaMes = new Date();
    primerDiaMes.setDate(1);

    //Ranking Día
    const { data: rankingDia, error: errorDia } = await supabase
      .from('UsuarioTorneo')
      .select('id_usuario, puntuacion, id_torneo, Usuarios (nombreCompleto, fotoDePerfil)')
      .gte('fecha', hoy)
      .order('puntuacion', { ascending: false })
      .limit(10);

    if (errorDia) throw errorDia;

    //Ranking Mes
    const { data: rankingMes, error: errorMes } = await supabase
      .from('UsuarioTorneo')
      .select('id_usuario, puntuacion, id_torneo, Usuarios (nombreCompleto, fotoDePerfil)')
      .gte('fecha', primerDiaMes.toISOString().split('T')[0])
      .order('puntuacion', { ascending: false })
      .limit(10);

    if (errorMes) throw errorMes;

    //Ranking Total
    const { data: rankingTotal, error: errorTotal } = await supabase
      .from('UsuarioTorneo')
      .select('id_usuario, puntuacion, id_torneo, Usuarios (nombreCompleto, fotoDePerfil)')
      .order('puntuacion', { ascending: false })
      .limit(10);

    if (errorTotal) throw errorTotal;

    res.json({
      ranking_dia: rankingDia || [],
      ranking_mes: rankingMes || [],
      ranking_total: rankingTotal || []
    });
  } catch (error) {
    console.error("Error obteniendo ranking global:", error);
    res.status(500).json({ error: "No se pudo obtener el ranking global" });
  }
};

/*Cargar puntos al torneo desde un entrenamiento*/
export const cargarPuntosEntrenamiento = async (req, res) => {
  const { id_usuario, id_entrenamiento, id_torneo } = req.body;

  if (!id_usuario || !id_entrenamiento || !id_torneo) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const { data: usuarioEntrenamiento } = await supabase
      .from('UsuarioEntrenamiento')
      .select('id')
      .eq('id_usuario', id_usuario)
      .eq('id_entrenamiento', id_entrenamiento)
      .maybeSingle();

    if (!usuarioEntrenamiento) {
      return res.status(404).json({ error: "No se encontró el entrenamiento del usuario" });
    }

    const { data: golpes } = await supabase
      .from('Golpes')
      .select('fuerza')
      .eq('id_usuarioEntrenamiento', usuarioEntrenamiento.id);

    const puntosEntrenamiento = golpes?.reduce((acc, g) => acc + (g.fuerza || 0), 0) || 0;

    const { data: usuarioTorneo } = await supabase
      .from('UsuarioTorneo')
      .select('id, puntuacion')
      .eq('id_usuario', id_usuario)
      .eq('id_torneo', id_torneo)
      .maybeSingle();

    if (!usuarioTorneo) {
      return res.status(404).json({ error: "El usuario no está registrado en el torneo" });
    }

    const nuevaPuntuacion = usuarioTorneo.puntuacion + puntosEntrenamiento;

    await supabase
      .from('UsuarioTorneo')
      .update({ puntuacion: nuevaPuntuacion })
      .eq('id', usuarioTorneo.id);

    res.json({
      mensaje: "Puntos del entrenamiento cargados correctamente",
      puntos_sumados: puntosEntrenamiento
    });

  } catch (error) {
    console.error("Error cargando puntos:", error);
    res.status(500).json({ error: "No se pudieron cargar los puntos al torneo" });
  }
};

/*Torneos creados por el usuario                                                      YA APARECEN EN LOS Q EL USUARIO PARTICIPA
export const getTorneosCreados = async (req, res) => {
  const { id_usuario } = req.query;

  if (!id_usuario) {
    return res.status(400).json({ error: "Falta el id_usuario" });
  }

  try {
    const { data, error } = await supabase
      .from('Torneos')
      .select('id, nombre, capacidad, tipoPrivacidad, duracion, descripcion, id_nivel')
      .eq('creadoPor', id_usuario);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error obteniendo torneos creados:", error);
    res.status(500).json({ error: "No se pudieron obtener los torneos creados" });
  }
};
*/
/*Torneos donde participa un usuario*/
export const getTorneosDelUsuario = async (req, res) => {
  const { id_usuario } = req.query;

  if (!id_usuario) {
    return res.status(400).json({ error: "Falta el id_usuario" });
  }

  try {
    const { data, error } = await supabase
      .from('UsuarioTorneo')
      .select(`
        id_torneo,
        puntuacion,
        Torneos (
          id,
          nombre,
          capacidad,
          tipoPrivacidad,
          duracion,
          descripcion
        )
      `)
      .eq('id_usuario', id_usuario);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error obteniendo torneos del usuario:", error);
    res.status(500).json({ error: "No se pudieron obtener los torneos donde participa" });
  }
};

/*Ver participantes de un torneo*/
export const getParticipantesTorneo = async (req, res) => {
  const { id_torneo } = req.query;

  if (!id_torneo) {
    return res.status(400).json({ error: "Falta el id_torneo" });
  }

  try {
    const { data, error } = await supabase
      .from('UsuarioTorneo')
      .select(`
        id_usuario,
        puntuacion,
        Usuarios (
          nombreCompleto,
          fotoDePerfil
        )
      `)
      .eq('id_torneo', id_torneo)
      .order('puntuacion', { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (error) {
    console.error("Error obteniendo participantes:", error);
    res.status(500).json({ error: "No se pudieron obtener los participantes" });
  }
};
