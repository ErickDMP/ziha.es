// Etiquetas orientativas sobre la cartografía artística del prototipo.
(() => {
  const map=document.querySelector('.world-map');
  if(!map)return;
  const svgNS='http://www.w3.org/2000/svg';
  // [label, longitude, latitude, prominence] in WGS84, approximate label anchors.
  const labels=[
    ['CANADÁ',-108,58,'major'],['EE. UU.',-98,38,'major'],['MÉXICO',-102,23,''],
    ['COLOMBIA',-73,4,'tiny'],['BRASIL',-52,-12,'major'],['PERÚ',-76,-10,'tiny'],['CHILE',-71,-31,''],['ARGENTINA',-64,-38,''],
    ['R. UNIDO',-3,54,'tiny'],['ESPAÑA',-4,39,''],['FRANCIA',2,47,'tiny'],['ALEMANIA',11,51,'tiny'],['ITALIA',13,42,'tiny'],
    ['RUSIA',95,61,'major'],['TURQUÍA',35,39,'tiny'],['CHINA',104,35,'major'],['INDIA',79,22,''],['JAPÓN',139,37,''],
    ['MARRUECOS',-7,31,'tiny'],['EGIPTO',30,27,'tiny'],['NIGERIA',8,9,''],['KENIA',38,0,'tiny'],['SUDÁFRICA',24,-29,''],
    ['AUSTRALIA',134,-25,'major'],['N. ZELANDA',173,-42,'tiny']
  ];
  const group=document.createElementNS(svgNS,'g');group.setAttribute('id','map-country-labels');group.setAttribute('aria-label','Países de referencia de los continentes');
  for(const [name,lon,lat,style] of labels){const x=(lon+180)*800/360,y=(90-lat)*450/180;const t=document.createElementNS(svgNS,'text');t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('text-anchor','middle');t.setAttribute('class','country-label '+style);t.textContent=name;group.appendChild(t)}
  // Keep labels outside the illustrative orbit group, which is hidden once SGP4 loads.
  const orbitLayer=map.querySelector('#orbit-illustration');
  if(orbitLayer)orbitLayer.before(group);else map.appendChild(group);
  const footer=document.querySelector('.world-foot');
  if(footer){const button=document.createElement('button');button.type='button';button.className='map-label-toggle';button.textContent='PAÍSES: VISIBLES';button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Mostrar u ocultar los nombres de países');button.addEventListener('click',()=>{const visible=map.classList.toggle('labels-off')===false;button.setAttribute('aria-pressed',String(visible));button.textContent=visible?'PAÍSES: VISIBLES':'PAÍSES: OCULTOS'});footer.appendChild(button)}
})();
