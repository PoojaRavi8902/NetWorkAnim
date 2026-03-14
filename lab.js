let devices = [];

let pcCount = 0;
let switchCount = 0;
let routerCount = 0;

function drawCables(){

let svg = document.getElementById("cables");
svg.innerHTML = "";

let switchDevice = devices.find(d => d.type === "Switch");
if(!switchDevice) return;

let switchElement = document.getElementById(switchDevice.name);
if(!switchElement) return;

let networkArea = document.getElementById("networkArea");

let switchRect = switchElement.getBoundingClientRect();
let networkRect = networkArea.getBoundingClientRect();

let sx = switchRect.left + switchRect.width/2 - networkRect.left;
let sy = switchRect.top + switchRect.height/2 - networkRect.top;

devices.forEach(device=>{

if(device.type === "Switch") return;

let element = document.getElementById(device.name);
if(!element) return;

let rect = element.getBoundingClientRect();

let dx = rect.left + rect.width/2 - networkRect.left;
let dy = rect.top + rect.height/2 - networkRect.top;

let line = document.createElementNS("http://www.w3.org/2000/svg","line");

line.setAttribute("x1", sx);
line.setAttribute("y1", sy);
line.setAttribute("x2", dx);
line.setAttribute("y2", dy);

line.setAttribute("stroke","#00ff9c");
line.setAttribute("stroke-width","3");

svg.appendChild(line);

});

}


function addPC(){

if(devices.length === 0){
alert("Add a Switch first to start the network.");
return;
}

let switchExists = devices.some(d => d.type === "Switch");

if(!switchExists){
alert("A PC must connect through a Switch.");
return;
}

pcCount++;

devices.push({type:"PC", name:"PC"+pcCount});

updateNetwork();

}


function addSwitch(){

switchCount++;

devices.push({type:"Switch", name:"Switch"+switchCount});

updateNetwork();
drawCables();
}


function addRouter(){

if(devices.length === 0){
alert("Add a Switch first to start the network.");
return;
}

let switchExists = devices.some(d => d.type === "Switch");

if(!switchExists){
alert("A Router must connect through a Switch.");
return;
}

routerCount++;

devices.push({type:"Router", name:"Router"+routerCount});

updateNetwork();

}


function updateNetwork(){

let container = document.getElementById("devices");
container.innerHTML = "";

let switchDevice = devices.find(d => d.type === "Switch");

if(!switchDevice){
updateDeviceSelectors();

requestAnimationFrame(drawCables);
return;
}

let switchWrapper = document.createElement("div");
switchWrapper.className = "device-wrapper switch-center";

let switchImg = document.createElement("img");
switchImg.src = "switch.png";
switchImg.className = "device";
switchImg.id = switchDevice.name;

let switchLabel = document.createElement("div");
switchLabel.innerText = switchDevice.name;

switchWrapper.appendChild(switchImg);
switchWrapper.appendChild(switchLabel);
container.appendChild(switchWrapper);


let pcs = devices.filter(d => d.type === "PC");
let router = devices.find(d => d.type === "Router");

let positions = ["pc-top","pc-left","pc-right","pc-bottom"];

pcs.forEach((pc,index)=>{

let wrapper = document.createElement("div");
wrapper.className = "device-wrapper "+positions[index % positions.length];

let img = document.createElement("img");
img.src = "pc.png";
img.className = "device";
img.id = pc.name;

let label = document.createElement("div");
label.innerText = pc.name;

wrapper.appendChild(img);
wrapper.appendChild(label);

container.appendChild(wrapper);

});


if(router){

let wrapper = document.createElement("div");
wrapper.className = "device-wrapper pc-bottom";

let img = document.createElement("img");
img.src = "router.png";
img.className = "device";
img.id = router.name;

let label = document.createElement("div");
label.innerText = router.name;

wrapper.appendChild(img);
wrapper.appendChild(label);

container.appendChild(wrapper);

}

updateDeviceSelectors();
setTimeout(drawCables,100);
}





function updateDeviceSelectors(){

let source = document.getElementById("sourceDevice");
let dest = document.getElementById("destDevice");

source.innerHTML = "";
dest.innerHTML = "";

devices.forEach(device => {

let option1 = document.createElement("option");
option1.value = device.name;
option1.text = device.name;

let option2 = document.createElement("option");
option2.value = device.name;
option2.text = device.name;

source.appendChild(option1);
dest.appendChild(option2);

});

}


function sendPacketBetween(){

let source = document.getElementById("sourceDevice").value;
let dest = document.getElementById("destDevice").value;

if(source === dest){
alert("Source and destination cannot be the same.");
return;
}

let packet = document.getElementById("packet");

let sourceElement = document.getElementById(source);
let destElement = document.getElementById(dest);

let switchDevice = devices.find(d => d.type === "Switch");
let switchElement = document.getElementById(switchDevice.name);

let sRect = sourceElement.getBoundingClientRect();
let swRect = switchElement.getBoundingClientRect();
let dRect = destElement.getBoundingClientRect();
let nRect = document.getElementById("networkArea").getBoundingClientRect();

let startX = sRect.left + sRect.width/2 - nRect.left;
let startY = sRect.top + sRect.height/2 - nRect.top;

let switchX = swRect.left + swRect.width/2 - nRect.left;
let switchY = swRect.top + swRect.height/2 - nRect.top;

let endX = dRect.left + dRect.width/2 - nRect.left;
let endY = dRect.top + dRect.height/2 - nRect.top;

packet.style.display="block";
packet.style.left=startX+"px";
packet.style.top=startY+"px";

movePacket(startX,startY,switchX,switchY,()=>{
movePacket(switchX,switchY,endX,endY,()=>{
setTimeout(()=>packet.style.display="none",300);
});
});

}


function movePacket(x1,y1,x2,y2,callback){

let packet=document.getElementById("packet");

let steps=60;
let dx=(x2-x1)/steps;
let dy=(y2-y1)/steps;

let i=0;

let move=setInterval(()=>{

x1+=dx;
y1+=dy;

packet.style.left=x1+"px";
packet.style.top=y1+"px";

i++;

if(i>=steps){
clearInterval(move);
if(callback) callback();
}

},15);

}

function analyzeIP(){

let ip=document.getElementById("ipInput").value;

let first=parseInt(ip.split(".")[0]);

let type="";

if(first<128) type="Class A";
else if(first<192) type="Class B";
else type="Class C";

document.getElementById("ipResult").innerText =
"Detected: "+type;

}


function dnsLookup(){

let domain = document.getElementById("dnsInput").value;
let resultBox = document.getElementById("dnsResult");

resultBox.innerText = "";

setTimeout(()=>{
resultBox.innerText = "1. Checking browser cache...";
},500);

setTimeout(()=>{
resultBox.innerText += "\n2. Querying DNS server...";
},1500);

setTimeout(()=>{
resultBox.innerText += "\n3. DNS server found record for " + domain;
},2500);

setTimeout(()=>{
resultBox.innerText += "\n4. DNS resolved to IP 142.250.190.78";
},3500);

}


/* default starting network */

/*addPC();*/
/*addSwitch();*/
/*addPC();*/
/*addRouter();*/
