import {animate,dp,ease_cubicinout,lerp,between,color,golden,enframe,blur} from './animate.js';

const audio = new Audio("sounds/yellow.mp3");
const realTime = new Date();    
 
 
  
const BOING = 0.1;
const numberPos=1.15
function draw(ctx,t1,t2) {
    ctx.fillStyle = color(90,25,0);
    ctx.fillRect(0,0,100,100);

    ctx.translate(50,50);

    ctx.fillStyle = 'rgb(145,0,190,0.2)';
    ctx.beginPath();
    ctx.ellipse(0,0,32,32,0,0,2*Math.PI)
    ctx.fill();
    function tick(time,r=30,ticks=12) {
        const angle = time*(2*Math.PI)/ticks-Math.PI/2;
        return [r*Math.cos(angle), r*Math.sin(angle)];
    }
    
    ctx.textAlign =  'center' ;
    ctx.textBaseline =  'middle';
    ctx.font = ' 5px serif';
    ctx.lineCap = 'butt';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'rgb(127,  255,212)';
    for(let i=12;i>0;i--) {
        const [x,y] = tick(i);
        ctx.lineWidth = 0.3;
        
        ctx.strokeText(i, x*numberPos,y*numberPos);
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(x*.9,y*.9);
        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.fill();
    }
  
    function hand(r,period,ticks=12) {
      blur(t1,t2,ctx,function(t) {
          const boing = BOING*period/60/ticks;
          const [frame,dt] = enframe(ticks,(t*period)%1);

          const [tx1,ty1] = tick(frame,r,ticks);
          const [tx2,ty2] = tick(frame+1,r,ticks);

          function ease_cubic_out(t) {
              return Math.pow(1-t,3);
          }
          ctx.beginPath();

          ctx.moveTo(0,0);
          if(dt<1-boing) {
              const ddt = ease_cubicinout(between(0,1-boing,dt));
              const [cx1,cy1] = tick(frame+ddt,r,ticks);
              ctx.bezierCurveTo(cx1*0.5,cy1*0.5,tx1,ty1,tx1,ty1);
          } else {
              const wt = between(1-boing,1,dt);
              const [cx2,cy2] = tick(frame+1-ease_cubic_out(wt)*Math.cos(10*Math.PI*wt),r,ticks);
              ctx.bezierCurveTo(tx2*0.5,ty2*0.5,cx2*0.9,cy2*0.9,cx2,cy2);
            //   audio.play();

          }

          ctx.stroke();
      });
    }
  
  
    ctx.lineCap = 'round';
  
    //hours
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(140, 0, 255,0.5)';
    hand(20,1,60);

    // ctx.lineWidth = .2;
    // ctx.strokeStyle = 'rgb(140, 0, 255)';
    // hand(20,1);

    // minutes
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(17, 0, 255,0.5)';
    hand(30,12,60);

    // ctx.lineWidth = .1;
    // ctx.strokeStyle = 'rgb(17, 0, 255)';
    // hand(30,12);

    // seconds
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgb(251, 255, 0,0.5)';
    hand(27,60*12);

    // ctx.lineWidth = 0.1;
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    // hand(27,60*12,600);
    
    // let now = new Date()
    // var options = { hour: 'numeric', minute: 'numeric',second: 'numeric' };
    // var timeNow = now.toLocaleDateString("en-GB", options)
    // ctx.strokeText(timeNow,0,43)
    // let hours = now.getHours()
    // let minutes = now.getMinutes()
    // let seconds = now.getSeconds()
    // if(minutes < 10) {
    //     minutes = `0${minutes}`;
    // }

    // if(seconds < 10) {
    //     seconds = `0${seconds}`
    // }
    // ctx.font = ' 5px Arial';
    // // ctx.strokeText(realTime.getHours()+":"+realTime.getMinutes()+":"+realTime.getSeconds(),0,43)
    // ctx.strokeStyle = 'rgb(140, 0, 255)';
    // ctx.lineWidth = 0.3;
    // const timePos=-5
    // ctx.strokeText(hours+":",timePos,43)
    // ctx.strokeStyle = 'rgb(17, 0, 255)';
    // ctx.strokeText(minutes+":",timePos+6,43)
    // ctx.strokeStyle = 'rgb(251, 220, 0,20)';
    // ctx.lineWidth = 0.1;
    // ctx.strokeText(seconds,timePos+12.5,43)


}

animate({
    draw: draw,
    size: 800,
    runtime: 60*60*12,
    
});

document.body.addEventListener('click',function() {
  document.body.requestFullscreen();
})