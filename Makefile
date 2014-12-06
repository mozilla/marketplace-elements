default: clean js css

clean:
	rm -f dist/js/*.js dist/css/*.css

js:
	cp -f marketplace-elements.js dist/js/marketplace-elements.js
	cp -f document-register-element.js dist/js/document-register-element.js

css:
	stylus marketplace-elements.styl marketplace-elements-self.styl -o dist/css
