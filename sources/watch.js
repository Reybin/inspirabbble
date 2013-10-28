require('shelljs/global');

var fs   = require('fs'),
	path = require('path');

var curdir        = path.resolve(__dirname),
	jsCompiling   = false,
	lessCompiling = false;

fs.watch(curdir + '/screen.less', function(event, filename) {
	if (event === 'change' && ! lessCompiling) {
		echo('Change detected: ' + filename);
		lessCompiling = true;
		exec('sh ' + curdir + '/compile-less.sh', function() {
			lessCompiling = false;
			echo('Less file compiled!');
		});
	}
});

fs.watch(curdir + '/app.js', function(event, filename) {
	if (event === 'change' && ! jsCompiling) {
		echo('Change detected: ' + filename);
		jsCompiling = true;
		exec('sh ' + curdir + '/compile-js.sh', function() {
			jsCompiling = false;
			echo('JS file compiled!');
		});
	}
});

echo('Watching for changes...')