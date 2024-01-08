
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

const user = {
    x: 0,
    y: cvs.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "White",
    score: 0
}
const comp = {
    x: cvs.width-10,
    y: cvs.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "White",
    score: 0
}

const ball = {
    x: cvs.width/2,
    y: cvs.height/2,
    r: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "White"
}


const drawRect = (x,y,w,h,color)=>{
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h)
}

const net = {
    x: cvs.width/2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "White"
}
const drawNet = ()=> {
    for (let i = 0; i < cvs.height; i+=15){
        drawRect(net.x,net.y + i,net.width,net.height,net.color)
    }
}
const drawCircle = (x,y,r,color)=>{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}
drawCircle(100,100,50,"White")

const drawText = (text,x,y,color)=>{
    ctx.fillStyle = color;
    ctx.font = "45px Poppins";
    ctx.fillText(text,x,y);
}
// drawText("something",300,200);


const render = ()=> {
    // clear the canvas
    drawRect(0,0,cvs.width,cvs.height,"Black");
    // draw the net
    drawNet();
    // draw score
    drawText(user.score,cvs.width/4,cvs.height/5,"Yellow")
    drawText(comp.score,3*cvs.width/4,cvs.height/5,"Red")

    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(comp.x,comp.y,comp.width,comp.height,comp.color);

    drawCircle(ball.x,ball.y,ball.r,ball.color);
}

// user paddle 


const movePaddle = (evt)=> {
    let rect = cvs.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}
cvs.addEventListener("mousemove",movePaddle);

const collision = (b,p)=>{
    b.top = b.y - b.r;
    b.bottom = b.y + b.r;
    b.left = b.x - b.r;
    b.right = b.x + b.r;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}
// reset game
const resetBall = ()=>{
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}
// game logic
const update = ()=>{
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    let computerLevel = 0.1;
    comp.y += (ball.y - (comp.y + comp.height/2)) * computerLevel;

    if (ball.y + ball.r > cvs.height || ball.y - ball.r < 0) {
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < cvs.width/2) ? user : comp;

    if (collision(ball,player)) {
        let collidePoint = ball.y - (player.y + player.height/2);
        collidePoint = collidePoint/(player.height/2);

        let angleRad = collidePoint * Math.PI/4;

        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.5;
    }

    if (ball.x - ball.r < 0) {
        comp.score++;
        resetBall();
    } else if (ball.x + ball.r > cvs.width) {
        user.score++;
        resetBall();
    }
    if (user.score === 10) {
        resetBall();
        user.score = 0;
        comp.score = 0;
    } else if (comp.score === 10) {
        resetBall();
        comp.score = 0;
        user.score = 0;
    }
}

const game = ()=> {
    update();
    render();
}

const framePerSecond = 50;
setInterval(game,1000/framePerSecond);