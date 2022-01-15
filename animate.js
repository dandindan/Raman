console.clear();
export function animate(options) {
    const {draw,runtime,fps,makemovie} = options;
    const canvas = document.getElementById('canvas');
  
    const start = new Date();
    let t1 = transform_time(start);
    const ctx = canvas.getContext('2d');
  
    function transform_time(t) {
      return (t.getMilliseconds()/1000 + t.getSeconds() + 60*(t.getMinutes() + 60*t.getHours()))/runtime;
    }

    function frame() {
        const size = Math.min(window.innerWidth,window.innerHeight);
        canvas.width = canvas.height = size;
        ctx.resetTransform();
        const scale = size/100;
        ctx.scale(scale,scale);
        const t2 = transform_time(new Date());
        draw(ctx,t1,t2);
        t1 = t2;
      
        requestAnimationFrame(frame);
    }
    frame();
}

export function ease_cubicinout(t) {
    return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
}

export function lerp(a,b,t) {
    return (1-t)*a+t*b;
}


/* Clamps t to 0 when less than a, 1 when greater than b, and change linearly between a and b.
 */
export function between(a,b,t) {
    if(b<a) {
        [a,b] = [b,a];
    }
    if(b>1 && t<a) {
        a -= 1;
        b -= 1;
    }
    if(b==a) {
        return t>=b ? 1 : 0;
    }
    t -= a;
    t /= b-a;
    return Math.max(0,Math.min(1,t));
}

/* Split the interval [0,1] into n sections. Returns an array [f,dt], where f is the number of the section, and dt is 0 at the start of the section and 1 at the end.
 */
export function enframe(n,t) {
    if(t>=1) {
        return [n-1,1];
    }
    const f = Math.floor(n*t);
    const dt = (n*t)%1;
    return [f,dt];
}

/* When substituting numbers into a template literal, format them to two decimal places.
 */
export function dp(x){
    function dper(n) {
        return function(x) {
            const out = [];
            for(let i=0;i<x.length-1;i++) {
                out.push(x[i]);
                out.push(arguments[i+1].toFixed(n));
            }
            out.push(x[x.length-1]);
            return out.join('');
        }
    }
    if(typeof x=='number') {
        return dper(x);
    } else {
        return dper(2)(...arguments);
    }
}

export function golden(k,m,i) {
  return ((1+Math.sqrt(5))/2 * k * i) % m;
}

export function color(hue,sat,lum) {
    return dp`hsl(${hue},${sat}%,${lum}%)`;
}

export function blur(t1,t2,ctx,draw) {
    const steps = 10;
    function alpha_for(steps,limit=0.99) {
        return 1-Math.pow(Math.E,Math.log(1-limit)/steps);
    }
    const oa = ctx.globalAlpha;
    ctx.globalAlpha = alpha_for(steps);
    for(let i=0;i<steps;i++) {
        draw(lerp(t1,t2,i/steps));
    }
    ctx.globalAlpha = oa;
}