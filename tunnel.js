
(function(){ 
  const canvas = document.getElementById('gl');
  const gl = canvas.getContext('webgl', {antialias:true, preserveDrawingBuffer:true});
  if(!gl){ return; }
  const vsSrc = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main(){ v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
`; const fsSrc = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time;
uniform float u_period;
float hash(float n){ return fract(sin(n)*753.5453123); }
float noise(vec2 x){
  vec2 i = floor(x); vec2 f = fract(x);
  float a = hash(i.x + i.y*57.0);
  float b = hash(i.x+1.0 + i.y*57.0);
  float c = hash(i.x + (i.y+1.0)*57.0);
  float d = hash(i.x+1.0 + (i.y+1.0)*57.0);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
vec3 neon(float t){ return mix(vec3(0.44,0.88,1.00), vec3(0.48,0.23,0.93), 0.5 + 0.5*sin(t)); }
void main(){
  vec2 uv = (v_uv - 0.5) * vec2(u_res.x/u_res.y, 1.0);
  float T = u_period;
  float t = 6.2831853 * (u_time / T);
  float r = length(uv);
  float a = atan(uv.y, uv.x);
  float z = 1.4 * (sin(t) * 0.5 + 0.5);
  float rings = 12.0;
  float band = fract(rings * (r - 0.2*z));
  float wob = 0.04 * sin(6.0*a + 2.0*sin(t) + 4.0*cos(t));
  float depth = 1.0/(0.2 + r + wob);
  float star = smoothstep(0.995, 1.0, noise(uv*8.0 + vec2(cos(t), sin(t))*2.0));
  float lane = smoothstep(0.05, 0.0, abs(band-0.5) - 0.15 + wob);
  vec3 base = mix(vec3(0.03,0.05,0.10), vec3(0.05,0.08,0.16), star);
  vec3 col = base;
  vec3 glow = neon(6.0*a + 3.0*sin(t)) * lane * depth * 2.2;
  col += glow;
  float vig = smoothstep(1.2, 0.2, r);
  col *= vig + 0.15;
  col += glow*0.35;
  col = pow(col, vec3(0.9));
  gl_FragColor = vec4(col, 1.0);
}
`;
  function compile(type, src){ const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
    if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){ throw new Error(gl.getShaderInfoLog(sh)); } return sh; }
  function prog(vs, fs){ const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
    if(!gl.getProgramParameter(p, gl.LINK_STATUS)){ throw new Error(gl.getProgramInfoLog(p)); } return p; }
  const program = prog(compile(gl.VERTEX_SHADER, vsSrc), compile(gl.FRAGMENT_SHADER, fsSrc));
  gl.useProgram(program);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'a_pos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(program, 'u_res');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uPeriod = gl.getUniformLocation(program, 'u_period');
  const LOOP = 8.0; let playing = true; let start = performance.now();
  function setSize(w,h){ canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h); gl.uniform2f(uRes,w,h); }
  function fit(){ setSize(canvas.clientWidth*devicePixelRatio, canvas.clientHeight*devicePixelRatio); }
  window.addEventListener('resize', fit); fit();
  function frame(now){ if(playing){ const t=(now-start)/1000.0; gl.uniform1f(uTime, t%LOOP); gl.uniform1f(uPeriod, LOOP); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); } requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
  const toggle=document.getElementById('toggle'), set4k=document.getElementById('set4k'), setFit=document.getElementById('setFit');
  if(toggle) toggle.addEventListener('click', ()=>{ playing=!playing; toggle.textContent=playing?'Pause':'Play'; });
  if(set4k) set4k.addEventListener('click', ()=> setSize(3840,2160));
  if(setFit) setFit.addEventListener('click', fit);
})();
