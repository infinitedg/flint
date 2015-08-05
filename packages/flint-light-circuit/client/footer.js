Template.workspace_footer.events({
	'click #btn-zoom-out':function(){
		Session.set('moduleCanvasScale', Session.get('moduleCanvasScale') - 0.05);
	},
	'click #btn-zoom-zero':function(){
		Session.set('moduleCanvasScale', 1);
	},
	'click #btn-zoom-in':function(){
		Session.set('moduleCanvasScale', Session.get('moduleCanvasScale') + 0.05);
	},
});
