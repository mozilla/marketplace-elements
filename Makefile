default: css

install:
	@npm install
	@bower install

css:
	@node_modules/.bin/stylus --include bower_components/marketplace-frontend/src/media/css --include bower_components/marketplace-constants/dist/css marketplace-elements.styl

serve: css
	python -m SimpleHTTPServer
