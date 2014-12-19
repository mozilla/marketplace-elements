default: js css

install:
	@npm install
	@bower install
	@cp bower_components/marketplace-constants/dist/css/regions.styl bower_components/marketplace-frontend/src/media/css/lib
	@node_modules/.bin/stylus bower_components/marketplace-frontend/src/media/css/*.styl

js:
	cp -f marketplace-elements.js dist/js/marketplace-elements.js

css:
	stylus marketplace-elements.styl -o dist/css

serve:
	python -m SimpleHTTPServer
