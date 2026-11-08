// Selector de escenarios de diseño. No consulta órbitas, hardware ni servicios externos.
(() => {
  const panel = document.querySelector('#panel');
  const destination = panel?.querySelector('.main-bottom');
  if (!destination) return;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="mission-bar" aria-label="Planificador visual de misión">
      <article class="panel"><div class="panel-head"><h2>OBJETIVO DE MISIÓN</h2><span>SELECCIÓN DEMO</span></div>
      <div class="panel-body"><label class="mission-label" for="mission-target">SATÉLITE DE REFERENCIA</label>
      <select id="mission-target"><option value="NOAA">NOAA · METEOROLOGÍA</option><option value="METEOR">METEOR · METEOROLOGÍA</option><option value="ISS">ISS · ESTACIÓN ESPACIAL</option></select>
      <div class="blueprint-hint">Perfil conceptual, sin predicción orbital</div></div></article>
      <article class="panel mission-wide"><div class="panel-head"><h2>SECUENCIA OPERATIVA</h2><span>FASE 01 / PLANIFICACIÓN</span></div>
      <div class="panel-body"><div class="mission-steps"><span class="mission-step current">01 · PLANIFICAR</span><span class="mission-step">02 · RECIBIR</span><span class="mission-step">03 · DECODIFICAR</span><span class="mission-step">04 · PUBLICAR</span></div>
      <p id="mission-description">Prepararemos una recepción de imágenes meteorológicas según la compatibilidad real del equipo.</p></div></article>
      <article class="panel"><div class="panel-head"><h2>BITÁCORA</h2><span>OPERADOR</span></div><div class="panel-body"><span class="mission-label">ESTADO DE LA MISIÓN</span>
      <div class="mission-console" id="mission-log" aria-live="polite">[ESPERA] Selecciona un perfil de satélite.</div></div></article>
    </div>
    <p class="mission-footnote"><b>NOTA DE DISEÑO:</b> los perfiles solo cambian la explicación mostrada. No ejecutan órdenes en el servidor ni calculan pasadas reales.</p>`;
  destination.before(...wrapper.children);
  const profiles = {
    NOAA: {label:'NOAA', description:'Perfil para estudiar la recepción de imágenes meteorológicas; se comprobará qué satélites siguen operativos y qué frecuencias utilizan.', log:'[PLAN] Perfil meteorológico NOAA seleccionado.'},
    METEOR: {label:'METEOR', description:'Perfil para estudiar imágenes meteorológicas digitales; requerirá una cadena de decodificación distinta.', log:'[PLAN] Perfil meteorológico METEOR seleccionado.'},
    ISS: {label:'ISS', description:'Perfil educativo para futuras pruebas de señales públicas de la Estación Espacial Internacional; dependerá de las transmisiones disponibles.', log:'[PLAN] Perfil ISS seleccionado.'}
  };
  document.querySelector('#mission-target').addEventListener('change', event => {
    const value = profiles[event.target.value];
    document.querySelector('#mission-description').textContent = value.description;
    document.querySelector('#mission-log').textContent = value.log;
    const radarTag = document.querySelector('.radar svg text[x="307"]');
    if (radarTag) radarTag.textContent = value.label;
  });
})();
