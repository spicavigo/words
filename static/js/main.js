
function put_slider(){
    $("#slider").slider({
        min: min_len,
        max: max_len,
        value: 1,
        orientation: "horizontal",
        range: "min",
        animate:true,
        change: function( event, ui ) {console.log(ui);$('#slider-val').html("Minimum Length: "+ ui.value)}
    });
}
var data;
var max_len = 0;
var min_len = 1;
var width = window.innerWidth,
    height = window.innerHeight-140;
var fill = d3.scale.category20();
var svg, cluster, diagonal;

var levelWidth = [];
var childCount = function(level, n) {

  if(n.children && n.children.length > 0) {
    if(levelWidth.length <= level + 1) levelWidth.push(0);

    levelWidth[level+1] += n.children.length;
    n.children.forEach(function(d) {
      childCount(level + 1, d);
    });
  }
};

function redraw() {
  svg.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
}

function init_canvas(root){
    levelWidth = [1];
    childCount(0, root);  
    height = d3.max(levelWidth) * 30;
    height = d3.max([height, window.innerHeight-140]);
    cluster = d3.layout.cluster()
            .size([height, width - 200]);

    diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });
            
    d3.select("svg").remove();
    svg = d3.select("#canvas").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .attr("pointer-events", "all")
      .append("svg:g")
        .call(d3.behavior.zoom().on("zoom", redraw))
        .attr("transform", "translate(40,0)")
      .append('svg:g');

    svg.append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'white');
}
function create(root){
    init_canvas(root);
    var nodes = cluster.nodes(root),
          links = cluster.links(nodes);

    var link = svg.selectAll(".link")
          .data(links)
        .enter().append("path")
          .attr("class", "link")
          .attr("d", diagonal);

    var node = svg.selectAll(".node")
          .data(nodes)
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    node.append("circle")
        .attr("r", 4.5);

    node.append("text")
        .attr("dx", function(d) { return d.children ? -8 : 8; })
        .attr("dy", 3)
        .style("text-anchor", function(d) { 
                    if(d.name.length>max_len)max_len=d.name.length;
                    return d.children ? "end" : "start"; })
        .text(function(d) { return d.name; });
    d3.select(self.frameElement).style("height", height + "px");
}
function new_canvas(){
    min_len=0;
    max_len=0;
    var letters = $('#letters').val();
    if(letters.length==0)return;
    

    d3.json("/get_words/?letters=" + letters, function(error, root) {
      init_canvas(root);
        
      data = root;
      var nodes = cluster.nodes(root),
          links = cluster.links(nodes);

      var link = svg.selectAll(".link")
          .data(links)
        .enter().append("path")
          .attr("class", "link")
          .attr("d", diagonal);

      var node = svg.selectAll(".node")
          .data(nodes)
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

      node.append("circle")
          .attr("r", 4.5);

      node.append("text")
          .attr("dx", function(d) { return d.children ? -8 : 8; })
          .attr("dy", 3)
          .style("text-anchor", function(d) { 
                        if(d.name.length>max_len)max_len=d.name.length;
                        return d.children ? "end" : "start"; })
          .text(function(d) { return d.name; });
      put_slider();
      d3.select(self.frameElement).style("height", height + "px");
    });
    
    show_filter();
    
}

function show_filter(){
    $('#get-words').hide();
    $('#filters').show();
}

function show_word(){
    $('#get-words').show();
    $('#filters').hide();
}
function filter_length(d1, l){
    var newd = [];
    if (d1.children == undefined) return [];
    for (var i=0; i<d1.children.length;i++){
        var k = d1.children[i];
        if(k.name.length==l) newd.push(k);
        else {
            newd = newd.concat(filter_length(k,l))
        }
    } 
    return newd;
}

function filter_prefix(d1, pref){
    var newd = [];
    console.log(d1);
    if (d1.children == undefined) return [];
    for (var i=0; i<d1.children.length;i++){
        var k = d1.children[i];
        if(k.name.toLowerCase().indexOf(pref)==0) newd.push(k);
        else {
            newd = newd.concat(filter_prefix(k,pref))
        }
    } 
    return newd;
}
function filter(){
    var l = $('#slider').slider("value");
    var prefix = $('#prefix').val();
    var newd = data;
    if(l>0){
        newd = {"name":"root", "children":filter_length(newd,l)};
    }
    if(prefix.length>0)
        newd = {"name":"root", "children":filter_prefix(newd,prefix.toLowerCase())};
    create(newd);
}
