function draw_maze(maze){
    //1 for walls and 0 for non-walls

    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        var h=20, w=20;

        for(let i=0;i<maze.length;i++){
            for(let j=0;j<maze[i].length;j++){
                if(maze[i][j]==1){
                    ctx.fillRect(j*w,i*h,w,h);
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
    var edges = [];
    for(let i=0;i<n-1;i++){
        for(let j=0;j<m-1;j++){
            edges.push({weight: Math.ceil(Math.random()*100), v: j+i*m,w: j+i*m+1});
            edges.push({weight: Math.ceil(Math.random()*100), v: j+i*m,w: j+i*m+m});
        }
    }

    for(let j=0;j<m-1;j++){
        edges.push({weight: Math.ceil(Math.random()*100), v: j+(n-1)*m,w: j+(n-1)*m+1});
    }

    for(let i=0;i<n-1;i++){
        edges.push({weight: Math.ceil(Math.random()*100), v: m-1+i*m,w: m-1+i*m+m});
    }

    //create adj list
    var adj = new Array(n*m+1);
    for(let i=0;i<n*m;i++){
        adj[i] = new Array();
    }

    //find-minimum-spanning-tree and store it in a adj list
    var aux = new DSU(n*m);
    edges.sort(comparator);
    for(i of edges){
        console.log(i);
        console.log(aux.isSameSet(i.v,i.w));
        if(!aux.isSameSet(i.v,i.w)){
            aux.union(i.v,i.w);
            adj[i.w].push(i.v);
            adj[i.v].push(i.w);
        }
    }

    return adj;
}

var maze = [ 
            [1,1,1],
            [1,0,0,1],
            [1,1,1],
];