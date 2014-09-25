default: js css

js:
	cp -f marketplace-elements.js dist/js/marketplace-elements.js

css:
	stylus marketplace-elements.styl -o dist/css
