// WGS84 lon/lat shown in equirectangular projection.
// Country outlines: geo-countries (Natural Earth derivative), locally bundled.
// Orange satellite path is illustrative until orbital propagation is integrated.
(() => {
 const container=document.querySelector('#panel .radar');if(!container)return;
 const NS='http://www.w3.org/2000/svg';
 const pos=(lon,lat)=>[(lon+180)*800/360,(90-lat)*450/180];
 const station=pos(-3.7038,40.4168);
 const lines=[];
 for(let lon=-150;lon<=150;lon+=30){const [x]=pos(lon,0);lines.push(`<path class="gridline" d="M${x} 0V450"/>`)}
 for(let lat=-60;lat<=60;lat+=30){const [,y]=pos(0,lat);lines.push(`<path class="gridline" d="M0 ${y}H800"/>`)}
 container.innerHTML=`<div class="world-head"><strong>ATLAS DE SEGUIMIENTO</strong><small><span aria-hidden="true">◉</span> FRONTERAS GEOGRÁFICAS</small></div>
 <svg class="world-map" viewBox="0 0 800 450" role="img" aria-label="Mapa mundial con límites internacionales, latitudes y longitudes geográficas">
 <rect width="800" height="450" fill="#0b1920"/>
 <g id="geographic-graticule">${lines.join('')}</g>
 <g id="real-countries" aria-label="Límites reales de países"></g>
 <g class="coordinate-axes" aria-hidden="true">
 <text x="9" y="20" class="coord">90°N</text><text x="9" y="81" class="coord">60°N</text><text x="9" y="154" class="coord">30°N</text><text x="9" y="229" class="coord">0°</text><text x="9" y="304" class="coord">30°S</text><text x="9" y="379" class="coord">60°S</text>
 <text x="65" y="442" class="coord">150°O</text><text x="198" y="442" class="coord">90°O</text><text x="331" y="442" class="coord">30°O</text><text x="460" y="442" class="coord">30°E</text><text x="593" y="442" class="coord">90°E</text><text x="723" y="442" class="coord">150°E</text></g>
 <g id="orbit-illustration"><path class="track" d="M-10 320C100 290 192 205 300 145S505 115 610 207 710 300 810 275"/><circle class="marker" cx="495" cy="153" r="6"/><rect class="mapbox" x="506" y="119" width="137" height="38"/><text class="key" x="513" y="134" id="map-target" font-size="13">NOAA · DEMO</text><text x="513" y="148" font-size="9">ÓRBITA SIMULADA</text></g>
 <g id="ground-station"><circle class="station" cx="${station[0].toFixed(2)}" cy="${station[1].toFixed(2)}" r="5"/><path d="M${station[0]} ${station[1]}l-28 22" stroke="#ffbc61"/><rect class="mapbox" x="${station[0]-143}" y="${station[1]+20}" width="130" height="23"/><text class="key" x="${station[0]-136}" y="${station[1]+36}" font-size="11">MADRID · ESTACIÓN</text></g>
 </svg><div class="world-foot"><span>WGS84 · PROYECCIÓN EQUIRECTANGULAR · <b>FRONTERAS REALES</b></span><span id="map-coordinate-readout">LAT — / LON —</span><span>ÓRBITA <b>SIMULADA</b></span></div>`;
 const svg=container.querySelector('svg'),countryGroup=svg.querySelector('#real-countries');
 fetch('./countries-paths.json').then(response=>{if(!response.ok)throw Error('No se pudo obtener la cartografía');return response.json()}).then(features=>{
  const frag=document.createDocumentFragment();for(const f of features){const path=document.createElementNS(NS,'path');path.setAttribute('d',f.d);path.setAttribute('class','real-country');path.setAttribute('fill-rule','evenodd');const title=document.createElementNS(NS,'title');title.textContent=f.name;path.appendChild(title);frag.appendChild(path)}countryGroup.appendChild(frag);container.querySelector('.world-head small').textContent=`◉ ${features.length} TERRITORIOS REPRESENTADOS`;
 }).catch(()=>{container.querySelector('.world-head small').textContent='MAPA NO DISPONIBLE'});
 const readout=container.querySelector('#map-coordinate-readout');
 svg.addEventListener('pointermove',event=>{const pt=svg.createSVGPoint();pt.x=event.clientX;pt.y=event.clientY;const m=svg.getScreenCTM();if(!m)return;const p=pt.matrixTransform(m.inverse());if(p.x<0||p.x>800||p.y<0||p.y>450)return;const lon=p.x*360/800-180,lat=90-p.y*180/450;readout.textContent=`LAT ${Math.abs(lat).toFixed(1)}°${lat>=0?'N':'S'} / LON ${Math.abs(lon).toFixed(1)}°${lon>=0?'E':'O'}`});
 svg.addEventListener('pointerleave',()=>readout.textContent='LAT — / LON —');
 const select=document.querySelector('#mission-target');select?.addEventListener('change',()=>{svg.querySelector('#map-target').textContent=select.value+' · DEMO'});
})();
