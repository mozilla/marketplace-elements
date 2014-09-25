default: clean js css

clean:
	rm -f dist/js/*.js dist/css/*.css

js:
	cp -f marketplace-elements.js dist/js/marketplace-elements.js

css:
	stylus marketplace-elements.styl -o dist/css
