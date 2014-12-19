Flint.registerMacro("testMacro", 
	"This macro is intended to test the macro system as a whole", 
	{
		arg1: "A sample argument", 
		arg2: 'Yet another sample', 
		arg3: 'Let\'s use the function for real'
	}, function(macroArgs) {
		Flint.Log.info("TestMacro! ", macroArgs.arg1, macroArgs.arg2, macroArgs.arg3);
		Flint.Log.info("Current number of servers: " + Flint.collection('flintServers').find({}).count());
});
