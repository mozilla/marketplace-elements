default: js css

install:
	bower install

js:
	cp -f marketplace-elements.js dist/js/marketplace-elements.js

css:
	stylus marketplace-elements.styl -o dist/css

serve:
	python -m SimpleHTTPServer
