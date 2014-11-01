Template.timelineEditor_timeline.created = function() {
};

Template.timelineEditor_timeline.destroyed = function() {
	this.subs.stop();
};

Template.timelineEditor_timeline.rendered = function() {
	var self = this;

	this.subs = Meteor.subscribe('timelineEditor_timeline', this.data._id);
	
	// set up SVG for D3
	var width  = 960,
	    height = 500,
	    colors = d3.scale.category10(),
	    holdingNode = this.find('div');

	var svg = d3.select(holdingNode)
	  .append('svg')
	  .attr('width', width)
	  .attr('height', height);

	// set up initial nodes and links
	//  - nodes are known by 'id', not by index in array.
	//  - reflexive edges are indicated on the node (as a bold black circle).
	//  - links are always source < target; edge directions are set by 'left' and 'right'.
	var nodes = [],
		lastNodeId = 0,
	  links = [];

	function refreshNodes() {
		for (var i = nodes.length - 1; i >= 0; i--) {
			nodes[i].index = i;
		};
	}

	// Setup node and link observers
	Flint.collection('flintCues').find().observe({
		added: function(doc) {
			// insert new node at point
			var node = {cueId: doc._id, id: ++lastNodeId};
			nodes.push(node);
			restart();
		},
		changed: function(newDoc, oldDoc) {
			// nodes[nodes.indexOf(oldDoc)] = newDoc;
			// restart();
		},
		removed: function(doc) {
			var i = _.indexOf(nodes, _.findWhere(nodes, {cueId: doc._id}));
			nodes.splice(i,1);
			restart();
		}
	});

	Flint.collection('flintCuePaths').find().observe({
		added: function(doc) {
			var source = _.findWhere(nodes, {cueId: doc.fromCueId}),
				target = _.findWhere(nodes, {cueId: doc.toCueId});
			var link = {
				source: source.id, 
				target: target.id, 
				pathId: doc._id, 
				fromCueId: doc.fromCueId, 
				toCueId: doc.toCueId
			};

	        links.push(link);
			restart();
		},
		changed: function(newDoc, oldDoc) {
			// links[links.indexOf(oldDoc)] = newDoc;
			// restart();
		},
		removed: function(doc) {
			links.splice(_.indexOf(links, _.findWhere(links, {pathId: doc._id})), 1);
			restart();
		}
	});

	// init D3 force layout
	var force = d3.layout.force()
	    .nodes(nodes)
	    .links(links)
	    .size([width, height])
	    .linkDistance(150)
	    .charge(-500)
	    .on('tick', tick)

	// define arrow markers for graph links
	svg.append('svg:defs').append('svg:marker')
	    .attr('id', 'end-arrow')
	    .attr('viewBox', '0 -5 10 10')
	    .attr('refX', 6)
	    .attr('markerWidth', 3)
	    .attr('markerHeight', 3)
	    .attr('orient', 'auto')
	  .append('svg:path')
	    .attr('d', 'M0,-5L10,0L0,5')
	    .attr('fill', '#000');

	svg.append('svg:defs').append('svg:marker')
	    .attr('id', 'start-arrow')
	    .attr('viewBox', '0 -5 10 10')
	    .attr('refX', 4)
	    .attr('markerWidth', 3)
	    .attr('markerHeight', 3)
	    .attr('orient', 'auto')
	  .append('svg:path')
	    .attr('d', 'M10,-5L0,0L10,5')
	    .attr('fill', '#000');

	// line displayed when dragging new nodes
	var drag_line = svg.append('svg:path')
	  .attr('class', 'link dragline hidden')
	  .attr('d', 'M0,0L0,0');

	// handles to link and node element groups
	var path = svg.append('svg:g').selectAll('path'),
	    circle = svg.append('svg:g').selectAll('g');

	// mouse event vars
	var selected_node = null,
	    selected_link = null,
	    mousedown_link = null,
	    mousedown_node = null,
	    mouseup_node = null;

	function resetMouseVars() {
	  mousedown_node = null;
	  mouseup_node = null;
	  mousedown_link = null;
	}

	// update force layout (called automatically each iteration)
	function tick() {
	  // draw directed edges with proper padding from node centers
	  path.attr('d', function(d) {
	  	var deltaX = d.target.x - d.source.x,
	        deltaY = d.target.y - d.source.y,
	        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
	        normX = deltaX / dist,
	        normY = deltaY / dist,
	        sourcePadding = 17,
	        targetPadding = 12,
	        sourceX = d.source.x + (sourcePadding * normX),
	        sourceY = d.source.y + (sourcePadding * normY),
	        targetX = d.target.x - (targetPadding * normX),
	        targetY = d.target.y - (targetPadding * normY);
	    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
	  });

	  circle.attr('transform', function(d) {
	    return 'translate(' + d.x + ',' + d.y + ')';
	  });
	}

	// update graph (called when needed)
	function restart() {

	  refreshNodes();
	  // path (link) group
	  path = path.data(links);

	  // update existing links
	  path.classed('selected', function(d) { return d === selected_link; });

	  // add new links
	  path.enter().append('svg:path')
	    .attr('class', 'link')
	    .classed('selected', function(d) { return d === selected_link; })
	    .on('mousedown', function(d) {
	      if(d3.event.metaKey) return;

	      // select link
	      mousedown_link = d;
	      if(mousedown_link === selected_link) selected_link = null;
	      else selected_link = mousedown_link;
	      selected_node = null;
	      restart();
	    });

	  // remove old links
	  path.exit().remove();


	  // circle (node) group
	  // NB: the function arg is crucial here! nodes are known by id, not by index!
	  circle = circle.data(nodes, function(d) { return d.id; });

	  // update existing nodes (reflexive & selected visual states)
	  circle.selectAll('circle')
	    .style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
	    // .classed('reflexive', function(d) { return d.reflexive; });

	  // add new nodes
	  var g = circle.enter().append('svg:g');

	  g.append('svg:circle')
	    .attr('class', 'node')
	    .attr('r', 12)
	    .style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
	    .style('stroke', function(d) { return d3.rgb(colors(d.id)).darker().toString(); })
	    // .classed('reflexive', function(d) { return d.reflexive; })
	    .on('mouseover', function(d) {
	      if(!mousedown_node || d === mousedown_node) return;
	      // enlarge target node
	      d3.select(this).attr('transform', 'scale(1.1)');
	      d3.select(this).select('text').text("HOWDY");
	    })
	    .on('mouseout', function(d) {
	      if(!mousedown_node || d === mousedown_node) return;
	      // unenlarge target node
	      d3.select(this).attr('transform', '');
	    })
	    .on('mousedown', function(d) {
	      if(d3.event.metaKey) return;

	      // select node
	      mousedown_node = d;
	      if(mousedown_node === selected_node) selected_node = null;
	      else selected_node = mousedown_node;
	      selected_link = null;

	      // reposition drag line
	      drag_line
	        .style('marker-end', 'url(#end-arrow)')
	        .classed('hidden', false)
	        .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

	      restart();
	    })
	    .on('mouseup', function(d) {
	      if(!mousedown_node) return;

	      // needed by FF
	      drag_line
	        .classed('hidden', true)
	        .style('marker-end', '');

	      // check for drag-to-self
	      mouseup_node = d;
	      if(mouseup_node === mousedown_node) { resetMouseVars(); return; }

	      // unenlarge target node
	      d3.select(this).attr('transform', '');

	      // add link to graph (update if exists)
	      // NB: links are strictly source < target; arrows separately specified by booleans
	      var source = mousedown_node, target = mouseup_node;
	      // if(mousedown_node.id < mouseup_node.id) {
	      //   source = mousedown_node;
	      //   target = mouseup_node;
	      // } else {
	      //   source = mouseup_node;
	      //   target = mousedown_node;
	      // }

	      var link;
	      link = links.filter(function(l) {
	        return (l.source === source && l.target === target);
	      })[0];

	      if(link) {
	      } else {
	        // link = {source: source, target: target, left: false, right: false};
	        // link[direction] = true;
	        // links.push(link);

	        Flint.collection('flintCuePaths').insert({
	        	fromCueId: source.cueId,
	        	toCueId: target.cueId,
    			timelineId: self.data._id,
    			description: ""
	        });
	      }

	      // select new link
	      // selected_link = link;
	      // selected_node = null;
	      // restart();
	    });

	  // show node IDs
	  g.append('svg:text')
	      .attr('x', 0)
	      .attr('y', 4)
	      .attr('class', 'id')
	      .text(function(d) { return ""; });

	  // remove old nodes
	  circle.exit().remove();

	  // set the graph in motion
	  console.log(nodes, links);
	  force.start();
	}

	function mousedown() {
	  // prevent I-bar on drag
	  //d3.event.preventDefault();
	  
	  // because :active only works in WebKit?
	  svg.classed('active', true);

	  if(d3.event.metaKey || mousedown_node || mousedown_link) return;

	  // insert new node at point
	  Flint.collection('flintCues').insert({
		notes: "",
		timelineId: self.data._id,
		macros: []
	  });
	}

	function mousemove() {
	  if(!mousedown_node) return;

	  // update drag line
	  drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

	  restart();
	}

	function mouseup() {
	  if(mousedown_node) {
	    // hide drag line
	    drag_line
	      .classed('hidden', true)
	      .style('marker-end', '');
	  }

	  // because :active only works in WebKit?
	  svg.classed('active', false);

	  // clear mouse event vars
	  resetMouseVars();
	}

	// only respond once per keydown
	var lastKeyDown = -1;

	function keydown() {
	  d3.event.preventDefault();

	  if(lastKeyDown !== -1) return;
	  lastKeyDown = d3.event.keyCode;

	  // meta
	  if(d3.event.keyCode === 17) {
	    circle.call(force.drag);
	    svg.classed('meta', true);
	  }

	  if(!selected_node && !selected_link) return;
	  switch(d3.event.keyCode) {
	    case 8: // backspace
	    case 46: // delete
	      if(selected_node) {
	      	console.log(selected_node.cueId);
	      	Flint.collection('flintCues').remove({_id: selected_node.cueId})
	      	Flint.collection('flintCuePaths').find({$or: [{fromCueId: selected_node.cueId}, {toCueId: selected_node.cueId}]}).forEach(function(doc) {
	      		Flint.collection('flintCuePaths').remove(doc._id);
	      	});
	      } else if(selected_link) {
	      	var cuePath = Flint.collection('flintCuePaths').findOne({fromCueId: selected_link.fromCueId, toCueId: selected_link.toCueId}) || {};
	      	Flint.collection('flintCuePaths').remove(cuePath._id);
	      }
	      selected_link = null;
	      selected_node = null;
	      break;
	    // case 66: // B
	    //   if(selected_link) {
	    //     // set link direction to both left and right
	    //     selected_link.left = true;
	    //     selected_link.right = true;
	    //   }
	    //   restart();
	    //   break;
	    // case 76: // L
	    //   if(selected_link) {
	    //     // set link direction to left only
	    //     selected_link.left = true;
	    //     selected_link.right = false;
	    //   }
	    //   restart();
	    //   break;
	    // case 82: // R
	    //   if(selected_node) {
	    //     // toggle node reflexivity
	    //     selected_node.reflexive = !selected_node.reflexive;
	    //   } else if(selected_link) {
	    //     // set link direction to right only
	    //     selected_link.left = false;
	    //     selected_link.right = true;
	    //   }
	    //   restart();
	    //   break;
	  }
	}

	function keyup() {
	  lastKeyDown = -1;

	  // meta == 91
	  if(d3.event.keyCode === 91) {
	    circle
	      .on('mousedown.drag', null)
	      .on('touchstart.drag', null);
	    svg.classed('meta', false);
	  }
	}

	// app starts here
	svg.on('mousedown', mousedown)
	  .on('mousemove', mousemove)
	  .on('mouseup', mouseup);
	d3.select(window)
	  .on('keydown', keydown)
	  .on('keyup', keyup);
	restart();
};
