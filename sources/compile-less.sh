clear
curdir="${0%/*}"
lessc -yui-compress \
	$curdir/screen.less \
	$curdir/../bundles/screen.css
echo 'LESS files compiled successfully!'