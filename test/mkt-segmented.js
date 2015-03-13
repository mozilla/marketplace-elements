describe('<mkt-segmented>', function() {

    this.beforeEach(function() {
        document.body.innerHTML = '<mkt-segmented id="mkt-segmented"><select><option value="1" selected>One</option><option value="2">Two</option><option value="3">Three</option></select></mkt-segmented>';
    });

    it('has buttons in it', function() {
        var root = document.getElementById('mkt-segmented');
        var buttons = root.querySelectorAll('button');
        assert.equal(buttons.length, 3);
    });

    it('sets the first element as the selected value', function() {
        var root = document.getElementById('mkt-segmented');
        assert.equal(root.value, '1');
    });

    it('shows which button is selected', function() {
        var root = document.getElementById('mkt-segmented');
        var selected = root.querySelectorAll('button[selected]');
        assert.equal(selected.length, 1);
        assert.equal(selected[0].textContent, 'One');
    });

    it('can change the selection with value', function() {
        var root = document.getElementById('mkt-segmented');
        var selected = root.querySelectorAll('button[selected]');

        assert.equal(selected.length, 1);
        assert.equal(selected[0].textContent, 'One');
        root.value = '3';

        selected = root.querySelectorAll('button[selected]');
        assert.equal(selected.length, 1);
        assert.equal(selected[0].textContent, 'Three');
    });
});
