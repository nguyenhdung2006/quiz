const users = [
    { username: "dung", password: "mph13nhd" },
    { username: "mit", password: "mph13nhd" }
];

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const remember = document.getElementById("remember");

// Tự động điền nếu có trong LocalStorage
window.addEventListener("load", () => {
    const savedUser = localStorage.getItem("savedUser");
    const savedPass = localStorage.getItem("savedPass");
    if (savedUser) {
        usernameInput.value = savedUser;
        passwordInput.value = savedPass || "";
        remember.checked = true;
    }
});

function login() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // CẤP VÉ THÔNG HÀNH (Session) - Tắt tab là mất
        sessionStorage.setItem("isAuthorized", "true");

        // Ghi nhớ thông tin (Local) - Để lần sau tự điền
        if (remember.checked) {
            localStorage.setItem("savedUser", username);
            localStorage.setItem("savedPass", password);
        } else {
            localStorage.removeItem("savedUser");
            localStorage.removeItem("savedPass");
        }

        window.location.href = "index.html";
    } else {
        const box = document.querySelector(".login-box");
        box.classList.add("shake");
        setTimeout(() => box.classList.remove("shake"), 300);
        passwordInput.focus();
    }
}

// Gán sự kiện
document.getElementById("loginBtn").addEventListener("click", login);
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
});

// CHỈ KHAI BÁO CÁI NÀY 1 LẦN DUY NHẤT
const togglePassBtn = document.getElementById("togglePass");
togglePassBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassBtn.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        togglePassBtn.textContent = "👁️";
    }
});



// ================= GOD EVOLUTION =================

const container = document.getElementById("butterfly-container");
const uiElements = document.querySelectorAll("input, button, .login-box");

const frames = [
    "../images/frame1.png","../images/frame2.png","../images/frame3.png",
    "../images/frame4.png","../images/frame5.png","../images/frame6.png",
    "../images/frame7.png","../images/frame8.png","../images/frame9.png",
    "../images/frame10.png"
];

const butterflies = [];
const COUNT = 10;

// ===== MOUSE =====
let mouse = {x:0,y:0};
let dangerLevel = 0;

window.addEventListener("mousemove", e=>{
    mouse.x=e.clientX;
    mouse.y=e.clientY;
    dangerLevel+=0.02;
});

setInterval(()=>dangerLevel*=0.9,1000);

// ===== NOISE =====
function noise(t){
    return Math.sin(t)*0.5 + Math.sin(t*0.7)*0.3 + Math.sin(t*1.3)*0.2;
}

// ===== CREATE =====
function createButterfly(){

    const el = document.createElement("div");
    el.className="butterfly";

    const shadow = document.createElement("div");
    shadow.className="shadow";

    container.appendChild(shadow);
    container.appendChild(el);

    const genders = ["male","female"];
    const personality = {
        speed:0.6 + Math.random()*1.2,
        curiosity:Math.random()
    };

    const b = {
        el, shadow,
        x:Math.random()*container.clientWidth,
        y:Math.random()*container.clientHeight,
        vx:0, vy:0,
        angle:0,
        frame:Math.random()*frames.length,
        noiseT:Math.random()*1000,

        gender:genders[Math.floor(Math.random()*2)],
        personality,

        targetX:0, targetY:0,
        state:"explore",
        stateTime:200
    };

    butterflies.push(b);
}

for(let i=0;i<COUNT;i++) createButterfly();

// ===== LOOP =====

function update(){

    const rect = container.getBoundingClientRect();

    butterflies.forEach(b=>{

        b.noiseT+=0.01;
        b.stateTime--;

        let dx=b.targetX-b.x;
        let dy=b.targetY-b.y;
        let dist=Math.hypot(dx,dy);

        // ===== FLOCK =====
        // ===== FLOCK (GIẢM HÚT - TĂNG ĐẨY) =====
        let ax=0, ay=0, cx=0, cy=0, sx=0, sy=0, count=0;

        butterflies.forEach(o=>{
            if(o===b) return;
            let dx=o.x-b.x, dy=o.y-b.y;
            let d=Math.hypot(dx,dy);

            if(d < 100){ // Chỉ tính toán khi ở gần nhau
                ax += o.vx; 
                ay += o.vy;
                cx += o.x; 
                cy += o.y;
                count++;

                if(d < 60){ // NẾU QUÁ GẦN THÌ ĐẨY NHAU RA MẠNH
                    sx -= dx * 0.6;
                    sy -= dy * 0.6;
                }
            }
        });

        if(count > 0){
            ax /= count;
            cx = (cx/count - b.x) * 0.005; // Lực hút tâm cực nhẹ
            cy = (cy/count - b.y) * 0.005;

            b.vx += ax*0.02 + cx + sx*0.08; 
            b.vy += ay*0.02 + cy + sy*0.08;
        }
        // ===== AI =====
        if(b.stateTime<=0){
            b.state = Math.random()<0.5 ? "explore" : "wander";
            b.stateTime = 200;
        }

        if(b.state==="explore" && dist<50){
            b.targetX=Math.random()*rect.width;
            b.targetY=Math.random()*rect.height;
        }

        if(b.state==="wander"){
            b.vx+=noise(b.noiseT)*0.3;
            b.vy+=noise(b.noiseT+100)*0.3;
        }

        // ===== MOUSE AVOID =====
        let mdx=b.x-mouse.x;
        let mdy=b.y-mouse.y;
        let md=Math.hypot(mdx,mdy);

        if(md<120){
            let fear=0.3+dangerLevel;
            b.vx+=(mdx/md)*fear;
            b.vy+=(mdy/md)*fear;
        }

        // ===== MOVE =====
        b.vx+=(dx/(dist||1))*0.05*b.personality.speed;
        b.vy+=(dy/(dist||1))*0.05*b.personality.speed;

        b.vx*=0.96;
        b.vy*=0.96;

        let speed=Math.hypot(b.vx,b.vy);
        let max=2*b.personality.speed;

        if(speed>max){
            b.vx=(b.vx/speed)*max;
            b.vy=(b.vy/speed)*max;
        }

        b.x+=b.vx;
        b.y+=b.vy;

        // ===== HARD BOUND (BẤT TỬ & CHỐNG DỒN CỤC) =====
        const m = 50; 
        const W = rect.width;
        const H = rect.height;

        // Nếu bay văng quá xa thì "hồi sinh" ngẫu nhiên (không để dồn vào giữa)
        if (b.x < -200 || b.x > W + 200 || b.y < -200 || b.y > H + 200) {
            b.x = Math.random() * W;
            b.y = Math.random() * H;
            b.vx = (Math.random() - 0.5) * 4;
            b.vy = (Math.random() - 0.5) * 4;
        }

        // Chạm biên thì đẩy ngược lại nhẹ nhàng
        if (b.x < m) { b.vx += 0.4; }
        if (b.x > W - m) { b.vx -= 0.4; }
        if (b.y < m) { b.vy += 0.4; }
        if (b.y > H - m) { b.vy -= 0.4; }

        // ===== ROTATE =====
        let ta=Math.atan2(b.vy,b.vx);
        let diff=ta-b.angle;
        diff=Math.atan2(Math.sin(diff),Math.cos(diff));
        b.angle+=diff*0.08;

        // ===== SCALE + FILTER (FIX GỘP) =====
        let scale=0.6+(b.y/rect.height)*0.6;
        let depth=Math.abs(0.5-(b.y/rect.height));
        let blur=depth*2 + speed*0.3;

        b.el.style.filter =
            `blur(${blur}px)
             brightness(${1.05 + scale*0.2})
             contrast(1.05)
             saturate(1.05)`;

        // ===== WING =====
        b.frame+=0.15+speed*0.3;
        let idx=Math.floor(b.frame)%frames.length;
        b.el.style.backgroundImage=`url(${frames[idx]})`;

        // ===== SHADOW =====
        b.shadow.style.transform =
            `translate(${b.x}px,${b.y+20}px) scale(${scale*0.8})`;
        b.shadow.style.opacity = 0.2 + scale*0.3;

        // ===== APPLY =====
        b.el.style.transform =
            `translate(${b.x}px,${b.y}px)
             rotate(${b.angle*180/Math.PI}deg)
             scale(${scale})`;
    });

    requestAnimationFrame(update);
}

update();



// ================= WEBGL ENGINE =================

const canvas = document.getElementById("butterfly-gl");
const gl = canvas.getContext("webgl");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== SHADER =====
const vertex = `
attribute vec2 position;
void main(){
    gl_Position = vec4(position,0.0,1.0);
}
`;

const fragment = `
precision mediump float;
uniform float time;
uniform vec2 resolution;

void main(){
    vec2 uv = gl_FragCoord.xy / resolution;

    // gradient động
    float r = 0.5 + 0.5*sin(time + uv.x*3.0);
    float g = 0.5 + 0.5*sin(time*0.7 + uv.y*4.0);
    float b = 0.5 + 0.5*sin(time*1.3);

    gl_FragColor = vec4(r,g,b,0.15); // nền nhẹ
}
`;

// ===== COMPILE =====
function createShader(type, source){
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return s;
}

const program = gl.createProgram();
gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertex));
gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragment));
gl.linkProgram(program);
gl.useProgram(program);

// ===== FULLSCREEN QUAD =====
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1, 1,-1, -1,1,
    -1,1, 1,-1, 1,1
]), gl.STATIC_DRAW);

const pos = gl.getAttribLocation(program,"position");
gl.enableVertexAttribArray(pos);
gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);

const timeLoc = gl.getUniformLocation(program,"time");
const resLoc = gl.getUniformLocation(program,"resolution");

// ===== PARTICLES (PHẤN HOA) =====
const particles = [];

for(let i=0;i<80;i++){
    particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        vx: (Math.random()-0.5)*0.5,
        vy: (Math.random()-0.5)*0.5,
        life: Math.random()*100
    });
}

// ===== SEASON SYSTEM =====
let season = 0; // 0 xuân, 1 hè, 2 thu, 3 đông

setInterval(()=>{
    season = (season+1)%4;
}, 15000);

// ===== DRAW LOOP =====
// ===== DRAW LOOP =====
function renderGL(t){
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.uniform1f(timeLoc, t*0.001);
    gl.uniform2f(resLoc, canvas.width, canvas.height);

    gl.drawArrays(gl.TRIANGLES,0,6);

    // ===== TỐI ƯU PARTICLE (PHẤN HOA) =====
    particles.forEach(p=>{
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // Hiệu ứng gió theo mùa
        if(season===0) p.vy -= 0.05; 
        if(season===1) p.vx += 0.05;
        if(season===2) p.vy += 0.05;

        if(p.life <= 0){
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
            p.life = 100;
        }

        // TÌM VÀ CẬP NHẬT DOT (Thay vì tạo mới liên tục)
        // Cách này giúp trình duyệt không bị quá tải và không bị chấm đè lên Form
        let dotId = `dot-${particles.indexOf(p)}`;
        let dot = document.getElementById(dotId);
        
        if(!dot) {
            dot = document.createElement("div");
            dot.id = dotId;
            dot.style.position = "fixed";
            dot.style.width = "2px";
            dot.style.height = "2px";
            dot.style.background = "rgba(255,255,200,0.4)";
            dot.style.borderRadius = "50%";
            dot.style.pointerEvents = "none";
            // QUAN TRỌNG: Cho nó nằm dưới cùng để không đè lên ô Password
            dot.style.zIndex = "0"; 
            document.body.appendChild(dot);
        }

        dot.style.left = p.x + "px";
        dot.style.top = p.y + "px";
        dot.style.opacity = p.life / 100; // Làm mờ dần khi sắp hết "thọ"
    });

    requestAnimationFrame(renderGL);
}
renderGL(0);