// SGP4 orbital propagation from an explicitly dated CelesTrak TLE snapshot.
// Computed satellite locations are NOT SDR observations; update the TLE snapshot regularly.
(() => {
 const api=window.satellite;
 const map=document.querySelector('.world-map');
 const select=document.querySelector('#mission-target');
 const bar=document.querySelector('.mission-bar');
 if(!api||!map||!select||!bar)return;
 const NS='http://www.w3.org/2000/svg',rad=api.degreesToRadians;
 const point=(lon,lat)=>[(lon+180)*800/360,(90-lat)*450/180];
 const formatDate=d=>d?new Intl.DateTimeFormat('es-ES',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Madrid'}).format(d):'Sin pasada';
 const fmtSec=sec=>{if(sec<0)return'EN CURSO';const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=Math.floor(sec%60);return(h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')};
 const root=document.createElement('div');root.className='orbit-info';
 root.innerHTML=`<article class="panel"><div class="panel-head"><h2>POSICIÓN ORBITAL</h2></div><div class="panel-body"><small>LATITUD / LONGITUD</small><strong id="orbit-position">CALCULANDO</strong><span class="hint" id="orbit-height">Altitud —</span></div></article>
 <article class="panel"><div class="panel-head"><h2>PRÓXIMA PASADA</h2></div><div class="panel-body"><small>HORIZONTE DE MADRID</small><strong id="orbit-pass">CALCULANDO</strong><span class="hint" id="orbit-pass-details">—</span></div></article>
 <article class="panel"><div class="panel-head"><h2>CUENTA ATRÁS</h2></div><div class="panel-body"><small>HASTA INICIO DE PASADA</small><strong id="orbit-countdown">—</strong><span class="hint">Elevación mínima: 0°</span></div></article>
 <article class="panel"><div class="panel-head"><h2>ELEMENTOS ORBITALES</h2></div><div class="panel-body"><small>FUENTE Y VIGENCIA</small><strong id="orbit-age">—</strong><span class="hint" id="orbit-validity">CelesTrak · TLE</span></div></article>`;
 bar.after(root);
 const note=document.createElement('p');note.className='orbit-source';note.innerHTML='La posición y las pasadas son <b>predicciones SGP4</b> calculadas desde TLE guardados, no observaciones ni recepción SDR. Se requiere actualización frecuente de los elementos.';root.after(note);
 const ui=id=>document.getElementById(id);
 const overlay=document.createElementNS(NS,'g');overlay.setAttribute('id','computed-orbit');
 const legend=document.createElementNS(NS,'g');legend.setAttribute('id','live-satellite');
 map.appendChild(overlay);map.appendChild(legend);
 map.querySelector('#orbit-illustration').style.display='none';
 let snapshot,satrec,observer,nextPass,lastPassCalc=0;
 function coordinates(date){const p=api.propagate(satrec,date);if(!p?.position||!Number.isFinite(p.position.x))return null;
  const gmst=api.gstime(date),gd=api.eciToGeodetic(p.position,gmst),ecf=api.eciToEcf(p.position,gmst);
  const angles=api.ecfToLookAngles(observer,ecf);
  const longitude=api.degreesLong(gd.longitude),latitude=api.degreesLat(gd.latitude);
  if(!Number.isFinite(longitude)||!Number.isFinite(latitude))return null;
  return{longitude,latitude,altitude:gd.height,elevation:angles.elevation*180/Math.PI};
 }
 function findPass(now){const until=now.getTime()+48*3600000,step=30000;let inside=false,start=null,maxEl=-90,passes=[];
  for(let ms=now.getTime();ms<=until;ms+=step){const c=coordinates(new Date(ms));if(!c)continue;const above=c.elevation>=0;
   if(above&&!inside){inside=true;start=ms;maxEl=c.elevation}
   if(above)maxEl=Math.max(maxEl,c.elevation);
   if(!above&&inside){passes.push({start:new Date(start),end:new Date(ms),max:maxEl});inside=false;if(passes.length>=2)break}
  }
  return passes[0]||null;
 }
 function drawTrack(now){const paths=[],step=90000;let current=[],previous=null;
  for(let ms=now.getTime()-45*60000;ms<=now.getTime()+100*60000;ms+=step){const p=coordinates(new Date(ms));if(!p)continue;
   const xy=point(p.longitude,p.latitude);if(previous&&Math.abs(xy[0]-previous[0])>350){if(current.length>1)paths.push(current);current=[]}
   current.push(xy);previous=xy}
  if(current.length>1)paths.push(current);
  overlay.replaceChildren();for(const line of paths){const path=document.createElementNS(NS,'path');path.setAttribute('d',line.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' '));path.setAttribute('class','orbit-real');overlay.appendChild(path)}
 }
 function update(){if(!satrec)return;const now=new Date(),p=coordinates(now);if(!p){ui('orbit-position').textContent='SIN DATOS';return}
  ui('orbit-position').textContent=`${Math.abs(p.latitude).toFixed(1)}°${p.latitude>=0?'N':'S'} / ${Math.abs(p.longitude).toFixed(1)}°${p.longitude>=0?'E':'O'}`;
  ui('orbit-height').textContent=`Altitud orbital ${Math.round(p.altitude)} km · Elevación desde Madrid ${p.elevation.toFixed(1)}°`;
  const [x,y]=point(p.longitude,p.latitude);legend.innerHTML=`<circle cx="${x}" cy="${y}" r="12" fill="none" stroke="#ffbc61" stroke-width="1.5" opacity=".8"/><circle cx="${x}" cy="${y}" r="5" fill="#e77e31" stroke="#ffe3bb" stroke-width="2"/>`;
  if(!lastPassCalc||Date.now()-lastPassCalc>60000){nextPass=findPass(now);lastPassCalc=Date.now();drawTrack(now)}
  ui('orbit-pass').textContent=nextPass?formatDate(nextPass.start):'SIN PASADA';
  ui('orbit-pass-details').textContent=nextPass?`Fin: ${formatDate(nextPass.end)} · Elev. máx. ≈ ${nextPass.max.toFixed(0)}°`:'Sin elevación sobre horizonte en 48 h';
  ui('orbit-countdown').textContent=nextPass?fmtSec((nextPass.start.getTime()-now.getTime())/1000):'—';
  const passCard=document.querySelector('#panel .stack .panel:nth-child(2)');
  if(passCard){const state=passCard.querySelector('.panel-head span'),values=passCard.querySelectorAll('.specs dd');if(state)state.textContent=nextPass?'PREDICCIÓN SGP4':'SIN PASADA';if(values.length===4){values[0].textContent=snapshot.satellites[select.value].name;values[1].textContent=nextPass?formatDate(nextPass.start):'—';values[2].textContent=nextPass?formatDate(nextPass.end):'—';values[3].textContent=nextPass?nextPass.max.toFixed(0)+'°':'—'}}
  const [,footer]=[0,document.querySelector('.world-foot')];if(footer)footer.querySelector('span:last-of-type').innerHTML='ÓRBITA <b>CALCULADA (TLE)</b>';
 }
 function tleEpoch(s){if(s.tle_epoch_utc)return new Date(s.tle_epoch_utc);const year2=Number(s.line1.slice(18,20));const year=year2<57?2000+year2:1900+year2;return new Date(Date.UTC(year,0,1)+(Number(s.line1.slice(20,32))-1)*86400000)}
 function choose(){if(!snapshot)return;const s=snapshot.satellites[select.value];if(!s)return;satrec=api.twoline2satrec(s.line1,s.line2);observer={longitude:rad(snapshot.reference_station.longitude),latitude:rad(snapshot.reference_station.latitude),height:snapshot.reference_station.altitude_km};lastPassCalc=0;ui('orbit-position').textContent='CALCULANDO';map.querySelector('#map-target').textContent=s.name.toUpperCase();const description=ui('mission-description');if(description)description.textContent=`Seguimiento orbital de ${s.name} mediante SGP4 y datos TLE guardados. El receptor SDR sigue desconectado.`;const ageDays=Math.max(0,(Date.now()-tleEpoch(s).getTime())/86400000);ui('orbit-age').textContent=ageDays.toFixed(1)+' DÍAS';ui('orbit-validity').textContent=ageDays>7?'TLE ANTIGUO':'CelesTrak · copia estática';note.classList.toggle('stale',ageDays>7);note.innerHTML=ageDays>7?'<b>AVISO: TLE ANTIGUOS.</b> La precisión disminuye. Actualiza el archivo tle-snapshot.json.':'<b>VERSIÓN GITHUB PAGES:</b> los cálculos SGP4 se realizan en tu navegador a partir de un archivo TLE local; no existe un servicio de actualización automático.';update()}
 fetch('./tle-snapshot.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Archivo TLE no disponible');return r.json()}).then(data=>{snapshot=data;choose();setInterval(update,1000)}).catch(()=>{ui('orbit-position').textContent='NO DISPONIBLE';ui('orbit-age').textContent='ERROR';ui('orbit-validity').textContent='No se pudieron cargar los datos TLE'});
 select.addEventListener('change',choose);
})();
