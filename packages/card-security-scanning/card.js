Template.card_security_scanning.helpers({
	'scanState':function(){
		return 'internalScanProgress'
	}
})
Template.internalScanProgress.helpers({
	'topView':function(){
		return Flint.a('/Ship Views/Top');
	}
})