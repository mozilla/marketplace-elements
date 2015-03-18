default: install css

install:
	@npm install
	@bower install

css:
	@node_modules/.bin/stylus --include bower_components/marketplace-constants/dist/css --include bower_components/marketplace-frontend/src/media/css -o dist/css/ src/css/marketplace-elements.styl

serve: css
	python -m SimpleHTTPServer
