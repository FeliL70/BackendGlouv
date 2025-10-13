export const sumarTiempos = (tiempos) => {
    let totalSegundos = 0;
  
    tiempos.forEach(tiempo => {
      const [horas, minutos, segundos] = tiempo.split(':').map(Number);
      totalSegundos += (horas * 3600) + (minutos * 60) + segundos;
    });
  
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
  
    const formato = (num) => num.toString().padStart(2, '0');
    return `${formato(horas)}:${formato(minutos)}:${formato(segundos)}`;
  };
  