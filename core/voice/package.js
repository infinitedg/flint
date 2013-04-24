Package.describe({
  summary: "Speak."
});

Package.on_use(function(api) { 
  api.use('log');
  
  // Do we really need all of these?
  // You can update this list manually or by going into the voices directory and
  // copy-pasting the result of `ls -1 | awk '{ print "\"voices/" $1 "\"," }'`
  api.add_files([
    "voices/mespeak_config.json",
    "voices/ca.json",
    "voices/cs.json",
    "voices/de.json",
    "voices/el.json",
    "voices/en-n.json",
    "voices/en-rp.json",
    "voices/en-sc.json",
    "voices/en-us.json",
    "voices/en-wm.json",
    "voices/en.json",
    "voices/eo.json",
    "voices/es-la.json",
    "voices/es.json",
    "voices/fi.json",
    "voices/fr.json",
    "voices/hu.json",
    "voices/it.json",
    "voices/kn.json",
    "voices/la.json",
    "voices/lv.json",
    "voices/nl.json",
    "voices/pl.json",
    "voices/pt-pt.json",
    "voices/pt.json",
    "voices/ro.json",
    "voices/sk.json",
    "voices/sv.json",
    "voices/tr.json"
  ], "client");
  
  api.add_files(['lib/mespeak.js', 'voice.js'], 'client');
});
