
//use js to laod required libraries here
function edgebundle(thresh = 0.8) {

  var nodes = document.querySelectorAll('.bees')
  var names = d3.range(nodes.length)

  var node_data = {};

  [...nodes].map(function(d,i) {
    node_data[''+i]={x:parseFloat(d.getAttribute('cx')), y:parseFloat(d.getAttribute('cy'))};
  });

var link_data = [];
names.forEach(i=>{
  names.forEach(j=>{
    if (i!=j){
      link_data.push({
        source: ''+i,
        target: ''+j,
        value:1
      });
    }

  })
})

  var fbundling = ForceEdgeBundling()
  .step_size(20)
  .compatibility_threshold(.06)//0.3)
  .nodes(node_data)
  .edges(link_data);
  var results = fbundling();

  var d3line = d3.line()
  .x(function(d) {
    return d.x;
  })
  .y(function(d) {
    return d.y;
  })
  .curve(d3.curveLinear);
  //plot the data
  for (var i = 0; i < results.length; i++) {
    var svg = d3.select("svg");

var weight = link_data[i].value


d3.select('svg')
    .append("g")
    .attr('transform','matrix(1,0,0,'+((180-pitch)/180.)+',0,0)')
    .append("path")
    .attr('class','link')
    .attr("d", d3line(results[i]))
    .style("fill", "none")
    .style("stroke-width",11)
    .style('stroke',d=>'FFCC00')
    .attr('mix-blend-mode','difference')
    .attr('opacity',.6)


}

console.log('bundle',results)

//console.log('fsdf',node_data[33],link_data[33])
}
