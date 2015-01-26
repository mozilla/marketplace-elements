default: css

install:
	@npm install
	@bower install
	@cp bower_components/marketplace-constants/dist/css/regions.styl bower_components/marketplace-frontend/src/media/css/lib
	@node_modules/.bin/stylus bower_components/marketplace-frontend/src/media/css/*.styl

css:
	stylus --include bower_components/marketplace-frontend/src/media/css --include bower_components/marketplace-constants/dist/css marketplace-elements.styl

serve:
	python -m SimpleHTTPServer
