clear
curdir="${0%/*}"
uglifyjs -v \
    $curdir/vendors/modernizr/modernizr-2.6.2.min.js \
    $curdir/vendors/jquery/jquery-1.10.2.min.js \
    $curdir/vendors/mustache/mustache-0.7.2.min.js \
    $curdir/app.js \
	-o $curdir/../bundles/app.js \
	-m
echo 'JS files compiled successfully!'