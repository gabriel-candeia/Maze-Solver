function draw_maze(maze, n, m){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        var w=canvas.height/m, h=canvas.width/n;
        ctx.clearRect(0,0,canvas.width,canvas.height);

        
        /*ctx.moveTo(0,0);
        ctx.lineTo((m+1)*w,0);*/
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

function randomize_button(){
    var n = Math.ceil(Math.random()*(50-15))+15;
    draw_maze(generate_maze(n,n),n,n);
}

(function(){
    document.getElementById("randomize-button").addEventListener("click",randomize_button,false);
})()