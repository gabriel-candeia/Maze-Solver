function draw_maze(maze, n, m){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        var w=canvas.height/m, h=canvas.width/n;
        ctx.clearRect(0,0,canvas.width,canvas.height);

        for(let i=0;i<n;i++){
            for(let j=0;j<m;j++){
                if(maze[i*m+j].includes(i*m+j+1)==false && j!=m-1){
                    ctx.beginPath();
                    ctx.moveTo((j+1)*w,i*h);
                    ctx.lineTo((j+1)*w,(i+1)*h);
                    ctx.stroke();
                }
                if(maze[i*m+j].includes(i*m+j+m)==false && i!=n-1){
                    ctx.beginPath();
                    ctx.moveTo(j*w,(i+1)*h);
                    ctx.lineTo((j+1)*w,(i+1)*h);
                    ctx.stroke();
                }
            }
        }
        
    }
}

function color_cell(maze,n,m,i,j,color){
    var canvas = document.getElementById("canvas");
    color = ((color) ? color : "white");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        var w=canvas.height/m, h=canvas.width/n;
        ctx.fillStyle = color;
        ctx.fillRect(j*w,i*h,w,h);

        if(maze[i*m+j].includes(i*m+j+1)==false && j!=m-1){
            ctx.beginPath();
            ctx.moveTo((j+1)*w,i*h);
            ctx.lineTo((j+1)*w,(i+1)*h);
            ctx.stroke();
        }
        if(maze[i*m+j].includes(i*m+j+m)==false && i!=n-1){
            ctx.beginPath();
            ctx.moveTo(j*w,(i+1)*h);
            ctx.lineTo((j+1)*w,(i+1)*h);
            ctx.stroke();
        }
        if(maze[i*m+j].includes(i*m+j-1)==false){
            ctx.beginPath();
            ctx.moveTo(j*w,i*h);
            ctx.lineTo(j*w,(i+1)*h);
            ctx.stroke();
        }
        if(maze[i*m+j].includes(i*m+j-m)==false){
            ctx.beginPath();
            ctx.moveTo(j*w,i*h);
            ctx.lineTo((j+1)*w,i*h);
            ctx.stroke();
        }
    }
}


function comparator(a,b){
    return ((a.weight < b.weight) ? -1 : 1);
}

function generate_maze(n,m){
    //create edges and assign random weights to them
    let edges = [];
    for(let i=0;i<n-1;i++){
        for(let j=0;j<m-1;j++){
            edges.push({weight: Math.ceil(Math.random()*100), v: j+i*m,w: j+i*m+1});
            edges.push({weight: Math.ceil(Math.random()*100), v: j+i*m,w: j+i*m+m});
        }
        edges.push({weight: Math.ceil(Math.random()*100), v: m-1+i*m,w: m-1+i*m+m});
    }

    for(let j=0;j<m-1;j++){
        edges.push({weight: Math.ceil(Math.random()*100), v: j+(n-1)*m,w: j+(n-1)*m+1});
    }

    //create adj list
    var adj = new Array(n*m+1);
    for(let i=0;i<n*m;i++){
        adj[i] = new Array();
    }

    //find-minimum-spanning-tree and store it in a adj list
    let aux = new DSU(n*m);
    edges.sort(comparator);
    for(i of edges){
        if(!aux.isSameSet(i.v,i.w)){
            aux.union(i.v,i.w);
            adj[i.w].push(i.v);
            adj[i.v].push(i.w);
        }
    }

    return adj;
}   

function randomize_button(param){
    param.n = Math.ceil(Math.random()*(100-15))+15;
    param.m = param.n;
    param.maze = generate_maze(param.n,param.m);
    draw_maze(param.maze,param.n,param.m);
}

function solve_wrapper(param){
    param.visited = new Array(param.n*param.m);
    for(let i = 0;i<param.m*param.n;i++){
        param.visited[i] = false;
    }
    draw_maze(param.maze,param.n,param.m);
    solve(param,0,param.n*param.m-1);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  

async function solve(param,v,u){
    var aux = false;
    color_cell(param.maze,param.n,param.m,Math.floor(v/param.m),v%param.m,"yellowgreen");
    if(v==u){
        return true;
    }
    await sleep(10);
    for(let w of param.maze[v]){
        if(param.visited[w]==false){
            param.visited[w] = true;
            aux = await solve(param,w,u);
            if(aux==true){
                return true;
            }
        }
    }
    color_cell(param.maze,param.n,param.m,Math.floor(v/param.m),v%param.m,"red");
    await sleep(10);
}

(function(){
    param = {maze: undefined, n: undefined, m: undefined, visited: undefined};
    randomize_button(param);
    document.getElementById("randomize-button").addEventListener("click",()=>randomize_button(param),false);
    document.getElementById("solve-button").addEventListener("click",()=>solve_wrapper(param),false);
})()