// Project documentation marker, not a live connection to a Linux host.
(() => {
  const section=document.querySelector('#proyecto');
  const grid=section?.querySelector('.grid-2');
  if(!grid)return;
  const element=document.createElement('article');
  element.className='panel';element.style.marginTop='16px';
  element.innerHTML=`<div class="panel-head"><h2>FASE 02 · API DE TELEMETRÍA</h2><span>PROTOTIPO LOCAL LISTO</span></div><div class="panel-body"><p>El servicio Python/FastAPI de lectura ya está preparado para Debian o Ubuntu. Los cuatro endpoints siguientes devuelven <strong>datos sintéticos</strong> mientras no exista hardware SDR conectado.</p><ul class="checks"><li><code>GET /api/health</code> — estado del servicio y receptor</li><li><code>GET /api/telemetry</code> — potencia, SNR, ganancia y frecuencia</li><li><code>GET /api/spectrum</code> — muestras del espectro</li><li><code>GET /api/logs</code> — bitácora de eventos</li></ul><p style="color:var(--muted)">Integración con la web y el receptor SDR: pendiente. El backend Linux no está desplegado en este sitio.</p></div>`;
  grid.after(element);
})();
