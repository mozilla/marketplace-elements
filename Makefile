default: js css

js:
	cp -f marketplace-elements.js dist/js/marketplace-elements.js

css:
	stylus site-banner.styl -o dist/css
