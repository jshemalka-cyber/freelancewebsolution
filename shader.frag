
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_t;
float hash(float n){ return fract(sin(n)*753.5453123); }
float noise(vec2 x){
  vec2 i=floor(x); vec2 f=fract(x);
  float a=hash(i.x+i.y*57.0);
  float b=hash(i.x+1.0+i.y*57.0);
  float c=hash(i.x+(i.y+1.0)*57.0);
  float d=hash(i.x+1.0+(i.y+1.0)*57.0);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
vec3 hsv2rgb(vec3 c){
  vec3 p = abs(fract(c.xxx + vec3(0.,0.6666667,0.3333333))*6. - 3.);
  return c.z * mix(vec3(1.), clamp(p-1., 0., 1.), c.y);
}
vec3 sceneSphere(vec2 uv, float tt, float dir){
  float t = fract(tt);
  float angle = 3.14159 * 0.75 * (dir>0.0 ? t : (1.0-t));
  float zoom  = mix(1.6, 1.05, (dir>0.0 ? t : (1.0-t)));
  uv *= zoom;
  vec3 ro = vec3(0.0,0.0,2.6);
  vec3 rd = normalize(vec3(uv, -1.5));
  float c = cos(angle), s = sin(angle);
  mat3 R = mat3(c,0.,s, 0.,1.,0., -s,0.,c);
  rd = R*rd;
  float b = dot(ro, rd);
  float c2 = dot(ro,ro) - 1.0;
  float h = b*b - c2;
  vec3 col = vec3(0.0);
  if(h>0.0){
    float t0 = -b - sqrt(h);
    vec3 pos = ro + rd*t0;
    vec3 n = normalize(pos);
    float u = atan(n.z,n.x) / 6.2831853 + 0.5;
    vec3 rgb = hsv2rgb(vec3(u, 0.95, 1.0));
    float pat = 0.08*noise(n.xz*8.0 + n.y*4.0);
    col = rgb + pat;
    float rim = pow(1.0-max(0.0,dot(n,-rd)), 2.2);
    col += vec3(0.2,0.3,0.9)*rim*0.4;
  }else{
    float stars = smoothstep(0.995,1.0, noise(uv*6.0));
    col = mix(vec3(0.0), vec3(0.05,0.08,0.15), 0.6) + stars*0.25;
  }
  float r = length(uv);
  col *= smoothstep(1.25, 0.25, r);
  return col;
}
vec3 sceneGridRipple(vec2 uv, float t){
  vec2 g = uv * vec2(u_res.x/u_res.y,1.0) * 50.0;
  float r = length(uv);
  float ripple = sin( (r*32.0 - t*6.2831853) ) * 0.02;
  float a = atan(uv.y, uv.x);
  vec2 duv = uv + ripple * vec2(cos(a), sin(a));
  vec2 gg = duv * vec2(u_res.x/u_res.y,1.0) * 50.0;
  float checker = step(0.5, fract(gg.x)) + step(0.5, fract(gg.y));
  checker = mod(checker, 2.0);
  vec3 col = mix(vec3(0.0), vec3(1.0), checker);
  col = mix(col, vec3(0.5,0.6,1.0), 0.05);
  col *= smoothstep(1.4, 0.2, length(uv));
  return col;
}
void main(){
  vec2 uv = (v_uv - 0.5) * 2.0;
  uv.x *= u_res.x/u_res.y;
  float t = mod(u_t, 4.0);
  vec3 col;
  if(t < 1.0){
    float f = smoothstep(0.0, 0.12, t);
    col = sceneSphere(uv, t, +1.0) * f;
  }else if(t < 2.0){
    float n = noise(uv*5.0)*0.01;
    col = vec3(n);
  }else if(t < 3.0){
    float k = t - 2.0;
    float f = smoothstep(0.0, 0.10, k);
    col = sceneGridRipple(uv, k) * f;
  }else{
    float k = t - 3.0;
    float f = smoothstep(0.0, 0.12, k);
    col = sceneSphere(uv, k, -1.0) * f;
  }
  gl_FragColor = vec4(col, 1.0);
}
