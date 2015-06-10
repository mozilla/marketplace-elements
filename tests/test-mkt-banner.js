(function() {
    afterEach(function() {
        document.body.innerHTML = '';
        localStorage.clear();
    });

    describe('mkt-banner', function() {
        it('can be hidden', function(done) {
            function makeBanner() {
                var div = document.createElement('div');
                div.style.display = 'none';
                div.innerHTML = '<mkt-banner>Heya</mkt-banner>';
                document.body.appendChild(div);
            }

            makeBanner();
            assert(document.querySelector('mkt-banner'), 'element exists');
            setTimeout(function() {
                document.querySelector('.mkt-banner-close')
                        .dispatchEvent(new Event('click'));

                setTimeout(function() {
                    assert(!document.querySelector('mkt-banner'),
                           'element is removed');
                    done();
                }, 500);
            }, 1);
        });

        it('can be hidden permanently', function(done) {
            function makeBanner() {
                var div = document.createElement('div');
                div.style.display = 'none';
                div.innerHTML = '<mkt-banner name="yo" dismiss="remember">Heya</mkt-banner>';
                document.body.appendChild(div);
            }

            makeBanner();
            assert(document.querySelector('mkt-banner'), 'element exists');
            setTimeout(function() {
                document.querySelector('.mkt-banner-close')
                        .dispatchEvent(new Event('click'));

                setTimeout(function() {
                    assert(!document.querySelector('mkt-banner'),
                           'element is removed');

                    makeBanner();
                    setTimeout(function() {
                        assert(!document.querySelector('mkt-banner'),
                               'element is not added');
                        done();
                    }, 1);
                }, 500);
            }, 1);
        });
    });
})();
