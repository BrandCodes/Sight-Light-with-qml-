var segments = [
            {a:{x:0,y:0}, b:{x:700,y:0}},
            {a:{x:700,y:0}, b:{x:700,y:450}},
            {a:{x:700,y:450}, b:{x:0,y:450}},
            {a:{x:0,y:450}, b:{x:0,y:0}},

            {a:{x:100,y:150}, b:{x:120,y:50}},
            {a:{x:120,y:50}, b:{x:200,y:80}},
            {a:{x:200,y:80}, b:{x:140,y:210}},
            {a:{x:140,y:210}, b:{x:100,y:150}},

            {a:{x:100,y:300}, b:{x:120,y:350}},
            {a:{x:120,y:350}, b:{x:60,y:400}},
            {a:{x:60,y:400}, b:{x:100,y:300}},

            {a:{x:120,y:350}, b:{x:220,y:350}},
            {a:{x:220,y:350}, b:{x:100,y:300}},

            {a:{x:340,y:360}, b:{x:360,y:340}},
            {a:{x:360,y:340}, b:{x:370,y:370}},
            {a:{x:370,y:370}, b:{x:340,y:360}},

            {a:{x:550,y:150}, b:{x:650,y:150}},
            {a:{x:500,y:200}, b:{x:600,y:200}},
            {a:{x:450,y:250}, b:{x:550,y:250}}
];

function drawRects(lienzo, P1x, P1y, P2x, P2y){
    var ctx = lienzo.getContext("2d");
    ctx.strokeStyle = "#6802ff";
    ctx.beginPath();
    ctx.moveTo(P1x,P1y);
    ctx.lineTo(P2x,P2y);       //(seg.b.x,seg.b.y)
    ctx.stroke();
}

function drawPolygon(lienzo){
    var ctx = lienzo.getContext("2d");
    ctx.clearRect(0,0,lienzo.width,lienzo.height);
    ctx.strokeStyle = "#6802ff";    //C8C8C8
    for(var a = 0; a < segments.length; a++){
        var seg = segments[a];
        ctx.beginPath();
        ctx.moveTo(seg.a.x, seg.a.y);
        ctx.lineTo(seg.b.x, seg.b.y);
        ctx.stroke();
    }
}

function drawFocus(lienzo, lastX, lastY){
    var puntos = (function (segments){
       var a = [] ;
       segments.forEach(function (seg){         a.push(seg.a, seg.b);       });
       return a;
    })(segments);
    var puntosUnicos = (function(puntos){
        var set = {};
        return puntos.filter(function(p){
           var clave = p.x + ', ' + p.y;
            if(clave in set){ return false; }
            else{
                set[clave] = true;
                return true;
            }
        });
    })(puntos);
    var angulosUnicos = [];
    for(var b = 0; b < puntosUnicos.length ; b++){
        var puntoUnico = puntosUnicos[b];
        var angulo = Math.atan2(puntoUnico.y - lastY, puntoUnico.x - lastX);
        puntoUnico.angulo = angulo;
        angulosUnicos.push(angulo - 0.0001, angulo, angulo + 0.00001);
    }
    var ctx = lienzo.getContext("2d");
    ctx.clearRect(0,0,lienzo.width,lienzo.height);
    var intersects = [];
    for(b = 0; b < angulosUnicos.length; b++){
        angulo = angulosUnicos [b];
        var dx = Math.cos(angulo);
        var dy = Math.sin(angulo);
        var ray = {
            a:{x:lastX, y:lastY},
            b:{x:lastX + dx, y:lastY + dy}
        };
        var closestIntersect = null;
        for(var i = 0; i < segments.length; i++){
            var intersect = obtenerInterseccion(ray, segments[i]);
            if(!intersect) continue;
            if(!closestIntersect || intersect.param < closestIntersect.param){
                closestIntersect = intersect;
            }
        }
        if(!closestIntersect) continue;
        closestIntersect.angulo = angulo;
        intersects.push(closestIntersect);
    }
    intersects = intersects.sort(function(a,b){    return a.angulo - b.angulo;    });
    ctx.fillStyle = "#F0F0F0"; //"#FCFEFE"; (Blanco) //"#8ECFF0"; //"#dd3838";
    ctx.beginPath();
    ctx.moveTo(intersects[0].x, intersects[0].y);
    for(i = 1; i < intersects.length; i++){
        intersect = intersects[i];
        ctx.lineTo(intersect.x, intersect.y);
    }
    ctx.fill();
    ctx.strokeStyle = "#F0F0F0"; //"#06BABA"; //"#0F0BF8";
    for(i = 0; i < intersects.length; i++){
        intersect = intersects[i];
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(intersect.x,intersect.y);
        ctx.stroke();
    }
}

function drawUniqueRays(lienzo, lastX, lastY){
    var puntos = (function (segments){
       var a = [] ;
       segments.forEach(function (seg){         a.push(seg.a, seg.b);       });
       return a;
    })(segments);
    var puntosUnicos = (function(puntos){
        var set = {};
        return puntos.filter(function(p){
           var clave = p.x + ', ' + p.y;
            if(clave in set){ return false; }
            else{
                set[clave] = true;
                return true;
            }
        });
    })(puntos);
    var angulosUnicos = [];
    for(var b = 0; b < puntosUnicos.length ; b++){
        var puntoUnico = puntosUnicos[b];
        var angulo = Math.atan2(puntoUnico.y-lastY, puntoUnico.x-lastX);
        puntoUnico.angulo = angulo;
        angulosUnicos.push(angulo - 0.0001, angulo, angulo + 0.00001);
    }
    var ctx = lienzo.getContext("2d");
    ctx.clearRect(0,0,lienzo.width,lienzo.height);
    var intersects = [];
    for(b = 0; b < angulosUnicos.length; b++){
        angulo = angulosUnicos [b];
        var dx = Math.cos(angulo);
        var dy = Math.sin(angulo);
        var ray = {
            a:{x:lastX,y:lastY},
            b:{x:lastX + dx,y:lastY + dy}
        };
        var closestIntersect = null;
        for(var i = 0; i < segments.length; i++){
            var intersect = obtenerInterseccion(ray,segments[i]);
            if(!intersect) continue;
            if(!closestIntersect || intersect.param < closestIntersect.param){
                closestIntersect = intersect;
            }
        }
        intersects.push(closestIntersect);
    }
    ctx.strokeStyle = "#0F0BF8";
    ctx.fillStyle = "#0F0BF8"; //"#8ECFF0"; //"#dd3838";
    for(i = 0; i < intersects.length; i++){
        intersect = intersects[i];
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(intersect.x,intersect.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(intersect.x, intersect.y, 4, 0, 2*Math.PI, false);
        ctx.fill();
    }
}

function drawRays(lienzo,lastX, lastY){
    var ctx = lienzo.getContext("2d");
    ctx.clearRect(0,0,lienzo.width,lienzo.height);
    var intersects = [];
    for(var angle = 0; angle < Math.PI*2; angle += (Math.PI*2) / 50 ){
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);
        var ray = {
            a:{x:lastX,y:lastY},
            b:{x:lastX + dx,y:lastY + dy}
        };
        var closestIntersect = null;
        for(var i = 0; i < segments.length; i++){
            var intersect = obtenerInterseccion(ray,segments[i]);
            if(!intersect) continue;
            if(!closestIntersect || intersect.param < closestIntersect.param){
                closestIntersect = intersect;
            }
        }
        intersects.push(closestIntersect);
    }
    ctx.strokeStyle = "#0F0BF8";
    ctx.fillStyle = "#0F0BF8"; //"#8ECFF0"; //"#dd3838";
    for(i = 0; i < intersects.length; i++){
        intersect = intersects[i];
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(intersect.x,intersect.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(intersect.x, intersect.y, 4, 0, 2*Math.PI, false);
        ctx.fill();
    }
}

function drawPoint(lienzo,lastX, lastY){
    var ctx = lienzo.getContext("2d");
    ctx.clearRect(0,0,lienzo.width,lienzo.height);
    ctx.strokeStyle = "#999";
    var x = lienzo.width/2;
    var y = lienzo.height/2;
    ctx.fillStyle = "#F6FF03";
    ctx.beginPath();
    ctx.moveTo(lastX+5,lastY);
    ctx.arc(lastX, lastY, 4, 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

function obtenerInterseccion(rayo, segmento){
    var r_px = rayo.a.x;
    var r_py = rayo.a.y;
    var r_dx = rayo.b.x - rayo.a.x;
    var r_dy = rayo.b.y - rayo.a.y;

    var s_px = segmento.a.x;
    var s_py = segmento.a.y;
    var s_dx = segmento.b.x - segmento.a.x;
    var s_dy = segmento.b.y - segmento.a.y;

    var r_mag = Math.sqrt(r_dx*r_dx + r_dy*r_dy);
    var s_mag = Math.sqrt(s_dx*s_dx + s_dy*s_dy);
    if (r_dx / r_mag==s_dx / s_mag && r_dy / r_mag==s_dy / s_mag){      return null;    }
    var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
    var T1 = (s_px + s_dx*T2 - r_px)/r_dx;

    if(T1 < 0) return null;
    if(T2 < 0 || T2 > 1) return null;
    return {
        x: r_px + r_dx * T1,
        y: r_py + r_dy * T1,
        param: T1        };
}
