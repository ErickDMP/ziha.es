// Ziha SDR telemetry prototype. Every value in this module is simulated.
// No receiver, Linux host, or API is contacted from this panel.
(() => {
 const root=document.querySelector('#telemetria');if(!root)return;
 const profiles={
  noaa:{label:'NOAA 19 · APT',freq:137.100,bandwidth:45,mode:'APT / FM'},
  meteor:{label:'METEOR-M2 3 · LRPT',freq:137.900,bandwidth:120,mode:'LRPT / QPSK'},
  iss:{label:'ISS · RADIO',freq:145.800,bandwidth:25,mode:'FM / REFERENCIA'}
 };
 const gauge=(id,label,unit)=>`<div class="tele-meter"><svg viewBox="0 0 200 115" aria-hidden="true"><path d="M20 93A80 80 0 0 1 180 93" fill="none" stroke="#4b5043" stroke-width="2"/><path d="M30 93L22 93M51 45L45 39M100 14V6M149 45L155 39M170 93L178 93" stroke="#3a4036" stroke-width="3"/><text x="15" y="110" fill="#334033" font-size="10">MIN</text><text x="159" y="110" fill="#334033" font-size="10">MAX</text><line class="meter-needle" id="${id}-needle" x1="100" y1="93" x2="100" y2="24" stroke="#c15d30" stroke-width="4"/><circle cx="100" cy="93" r="7" fill="#4c5144"/></svg><small>${label}</small><strong id="${id}-value">— ${unit}</strong></div>`;
 root.innerHTML=`<div class="section-title"><h1>TELEMETRÍA / 01</h1><p>Laboratorio SDR de Ziha. Espectro, waterfall e instrumentación retro preparados para conectarse al servidor Linux.</p></div>
 <div class="tele-shell">
 <div class="tele-banner"><strong>● RADIOFREQUENCY MONITORING STATION</strong><span>◉ MODO DEMOSTRACIÓN — NO HAY SDR CONECTADO</span></div>
 <article class="panel"><div class="panel-head"><h2>CONSOLA DE SINTONIZACIÓN</h2><span id="tele-mode">SIMULACIÓN DETENIDA</span></div><div class="panel-body"><div class="tele-controls">
 <div class="tele-field"><label for="tele-profile">PERFIL DE SEÑAL</label><select id="tele-profile"><option value="noaa">NOAA 19 · APT</option><option value="meteor">METEOR-M2 3 · LRPT</option><option value="iss">ISS · RADIO</option></select></div>
 <div class="tele-field"><label for="tele-gain">GANANCIA SIMULADA <output id="tele-gain-text">28 dB</output></label><input type="range" id="tele-gain" min="0" max="50" step="1" value="28"/></div>
 <div class="tele-field"><label>FRECUENCIA CENTRAL</label><strong id="tele-frequency" style="font:800 28px 'Barlow Condensed';color:var(--amber)">137.100 MHz</strong></div>
 <div class="tele-actions"><button id="tele-start" class="btn">▶ INICIAR DEMO</button><button id="tele-reset" class="btn secondary" type="button">↺ REINICIAR</button></div></div></div></article>
 <div class="tele-grid"><article class="panel"><div class="panel-head"><h2>ANALIZADOR DE ESPECTRO</h2><span>FFT · DATOS SINTÉTICOS</span></div><div class="panel-body"><canvas id="tele-spectrum" width="900" height="320" role="img" aria-label="Espectro de frecuencias simulado"></canvas><div class="tele-caption"><span>DESPLAZAMIENTO <b>−100 kHz</b></span><span>PORTADORA <b id="tele-spectrum-label">137.100 MHz</b></span><span><b>+100 kHz</b></span></div></div></article>
 <article class="panel"><div class="panel-head"><h2>WATERFALL / CASCADA</h2><span>HISTORIAL ESPECTRAL SINTÉTICO</span></div><div class="panel-body"><canvas id="tele-waterfall" width="900" height="320" role="img" aria-label="Cascada de señal simulada"></canvas><div class="tele-caption"><span>TIEMPO ↓</span><span>SEÑAL <b>DEMO</b></span><span>INTENSIDAD: AZUL → ÁMBAR</span></div></div></article></div>
 <div class="tele-lower"><article class="panel"><div class="panel-head"><h2>INSTRUMENTACIÓN ANALÓGICA</h2><span>MEDIDORES DE PRUEBA</span></div><div class="panel-body"><div class="tele-meters">${gauge('tele-snr','RELACIÓN SEÑAL/RUIDO','dB')}${gauge('tele-power','NIVEL DE SEÑAL','dBFS')}${gauge('tele-quality','CALIDAD ESTIMADA','%')}</div><div class="tele-stats"><div class="tele-stat"><small>CPU LINUX (DEMO)</small><strong id="tele-cpu">— %</strong><div class="tele-progress"><i id="tele-cpu-bar" style="width:0%"></i></div></div><div class="tele-stat"><small>MEMORIA (DEMO)</small><strong id="tele-ram">— %</strong><div class="tele-progress"><i id="tele-ram-bar" style="width:0%"></i></div></div><div class="tele-stat"><small>DISCO (DEMO)</small><strong id="tele-disk">— %</strong><div class="tele-progress"><i id="tele-disk-bar" style="width:0%"></i></div></div></div></div></article>
 <article class="panel"><div class="panel-head"><h2>CONSOLA LINUX / BITÁCORA</h2><span>NO EJECUTA COMANDOS</span></div><div class="panel-body"><div class="tele-terminal" id="tele-log" role="log" aria-live="polite" aria-label="Registro simulado del servidor"></div><div class="tele-caption"><span>HOST: <b>ziha-sdr-demo</b></span><span>SERVICIO REAL: <b>DESCONECTADO</b></span><button type="button" id="tele-clear" class="btn secondary">LIMPIAR REGISTROS</button></div></div></article></div>
 <div class="tele-support"><b>PRÓXIMA INTEGRACIÓN REAL:</b> esta interfaz recibirá FFT, intensidad, ganancia y registros de una API en Debian/Ubuntu. Los botones de esta versión solo alteran la simulación local; no sintonizan, graban ni transmiten ninguna señal.</div>
 </div>`;
 const $=s=>root.querySelector(s),spectrum=$('#tele-spectrum'),waterfall=$('#tele-waterfall');
 const sx=spectrum.getContext('2d'),wx=waterfall.getContext('2d');
 if(!sx||!wx)return;
 let running=false,tick=0,lastLog=0,profile='noaa',gain=28;
 const time=()=>new Date().toLocaleTimeString('es-ES',{hour12:false});
 function log(message,kind='info'){
  const line=document.createElement('div'),stamp=document.createElement('span'),body=document.createElement('span');stamp.className='terminal-time';stamp.textContent=`[${time()}] `;body.className='terminal-'+kind;body.textContent=message;line.append(stamp,body);const logEl=$('#tele-log');logEl.appendChild(line);while(logEl.children.length>60)logEl.firstChild.remove();logEl.scrollTop=logEl.scrollHeight;
 }
 function status(){const p=profiles[profile];$('#tele-frequency').textContent=p.freq.toFixed(3)+' MHz';$('#tele-spectrum-label').textContent=p.freq.toFixed(3)+' MHz';$('#tele-gain-text').textContent=gain+' dB';$('#tele-mode').textContent=running?'SIMULACIÓN EN CURSO · '+p.mode:'SIMULACIÓN DETENIDA';$('#tele-start').textContent=running?'■ DETENER DEMO':'▶ INICIAR DEMO';}
 function spectrumPower(i){const p=profiles[profile],c=450+Math.sin(tick*.013)*8;const width=p.bandwidth/200*900;const carrier=Math.exp(-Math.pow((i-c)/Math.max(12,width*.32),2)*2)*(.34+gain/85);const side=Math.exp(-Math.pow((i-(c+width*.6))/Math.max(10,width*.12),2)*2)*.18;const noise=(Math.sin(i*1.2+tick*.27)*.035+Math.cos(i*.31+tick*.14)*.025+Math.random()*.052);return Math.max(.02,Math.min(.95,.13+noise+carrier+side))}
 function drawSpectrum(){sx.clearRect(0,0,900,320);sx.fillStyle='#07151a';sx.fillRect(0,0,900,320);sx.strokeStyle='#344a48';sx.lineWidth=1;
  for(let x=50;x<=850;x+=100){sx.beginPath();sx.moveTo(x,15);sx.lineTo(x,288);sx.stroke()}for(let y=35;y<=285;y+=50){sx.beginPath();sx.moveTo(40,y);sx.lineTo(877,y);sx.stroke()}
  sx.fillStyle='#baa987';sx.font='12px monospace';for(let v=0;v<5;v++)sx.fillText((-20-v*20)+'',5,42+v*50);
  sx.beginPath();for(let i=40;i<=870;i+=2){const power=running?spectrumPower(i):.11+Math.sin(i*.23)*.012;const y=288-power*260;if(i===40)sx.moveTo(i,y);else sx.lineTo(i,y)}sx.strokeStyle='#f18c36';sx.lineWidth=2;sx.stroke();
  sx.fillStyle='#e77e3130';sx.lineTo(870,288);sx.lineTo(40,288);sx.closePath();sx.fill();sx.setLineDash([5,5]);sx.strokeStyle='#ead1a477';sx.beginPath();sx.moveTo(450,15);sx.lineTo(450,288);sx.stroke();sx.setLineDash([]);
 }
 function color(power){const p=Math.min(1,Math.max(0,power));if(p<.3)return[5,Math.round(30+p*160),Math.round(75+p*400)];if(p<.65)return[Math.round((p-.3)*380),Math.round(110+(p-.3)*170),Math.round(195-(p-.3)*400)];return[220+Math.round((p-.65)*90),175+Math.round((p-.65)*150),55+Math.round((p-.65)*150)]}
 function updateWaterfall(){wx.drawImage(waterfall,0,2,900,318);const image=wx.createImageData(900,2);for(let x=0;x<900;x++){const value=running?spectrumPower(x):.1;const rgb=color(value);for(let y=0;y<2;y++){const offset=(y*900+x)*4;image.data[offset]=rgb[0];image.data[offset+1]=rgb[1];image.data[offset+2]=rgb[2];image.data[offset+3]=255}}wx.putImageData(image,0,0)}
 function meter(id,value,text){const needle=$('#'+id+'-needle');needle.style.transform=`rotate(${-65+130*Math.max(0,Math.min(1,value))}deg)`;$('#'+id+'-value').textContent=text}
 function stats(){const sw=Math.sin(tick*.035),factor=running?1:0;const snr=(9+gain*.32+sw*2)*factor,power=(-66+gain*.35+sw*3)*factor,quality=(40+gain*.8+sw*7)*factor;
  meter('tele-snr',snr/40,running?snr.toFixed(1)+' dB':'— dB');meter('tele-power',running?(power+90)/60:0,running?power.toFixed(1)+' dBFS':'— dBFS');meter('tele-quality',quality/100,running?Math.round(quality)+' %':'— %');
  for(const [id,value] of [['cpu',running?18+Math.abs(sw)*15:0],['ram',running?32+Math.abs(sw)*3:0],['disk',running?12:0]]){$('#tele-'+id).textContent=running?Math.round(value)+' %':'— %';$('#tele-'+id+'-bar').style.width=value+'%'}
 }
 function frame(){if(!root.classList.contains('active'))return;tick++;drawSpectrum();if(tick%2===0)updateWaterfall();stats();if(running&&Date.now()-lastLog>5000){log(`SIMULACIÓN | ${profiles[profile].label} | ${profiles[profile].freq.toFixed(3)} MHz | ganancia ${gain} dB`);lastLog=Date.now()}}
 function clearWaterfall(){wx.fillStyle='#07151a';wx.fillRect(0,0,900,320)}
 $('#tele-profile').addEventListener('change',e=>{profile=e.target.value;status();clearWaterfall();log('Perfil seleccionado: '+profiles[profile].label,'command')});
 $('#tele-gain').addEventListener('input',e=>{gain=Number(e.target.value);status()});
 $('#tele-start').addEventListener('click',()=>{running=!running;status();log(running?'INICIO DE SIMULACIÓN. No hay dispositivo RTL-SDR conectado.':'SIMULACIÓN DETENIDA.',running?'info':'warn');lastLog=Date.now()});
 $('#tele-reset').addEventListener('click',()=>{running=false;tick=0;gain=28;profile='noaa';$('#tele-profile').value=profile;$('#tele-gain').value=String(gain);clearWaterfall();status();stats();drawSpectrum();log('Parámetros de demostración reiniciados.','warn')});
 $('#tele-clear').addEventListener('click',()=>{ $('#tele-log').replaceChildren();log('Bitácora de demostración vaciada.','command')});
 clearWaterfall();status();stats();drawSpectrum();log('Ziha Satellite Control / estación de prueba inicializada.','command');log('SDR REAL: NO DETECTADO. Fuente de espectro: generador sintético.','warn');
 setInterval(frame,180);
})();
