import supabase from '../configs/supabase.js';

const sumarTiempos = (tiempos) => {
  let totalSegundos = 0;

  tiempos.forEach((tiempo) => {
    const [h, m, s] = tiempo.split(':').map(Number);
    totalSegundos += h * 3600 + m * 60 + s;
  });

  const horas = String(Math.floor(totalSegundos / 3600)).padStart(2, '0');
  const minutos = String(Math.floor((totalSegundos % 3600) / 60)).padStart(2, '0');
  const segundos = String(totalSegundos % 60).padStart(2, '0');

  return `${horas}:${minutos}:${segundos}`;
};

export const getTiempoEntrenadoService = async (fecha, id_usuario) => {
  try {
    const { data, error } = await supabase
      .from('UsuarioEntrenamiento')
      .select('tiempo')
      .eq('fecha', fecha)
      .eq('id_usuario', id_usuario);

    if (error) throw error;

    if (!data || data.length === 0)
      return { data: { totalTiempo: "00:00:00" } };

    const tiempos = data.map(item => item.tiempo);
    const totalTiempo = sumarTiempos(tiempos);
    return { data: { totalTiempo } };
  } catch (error) {
    console.error("Error en getTiempoEntrenadoService:", error);
    return { error: "Error cargando tiempo entrenado." };
  }
};