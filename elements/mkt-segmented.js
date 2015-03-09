define('elements/mkt-segmented', ['elements/utils'], function(u) {
    'use strict';

    class MktSegmented extends HTMLElement {
        createdCallback() {
            var root = this;
            this.select = this.querySelector('select');
            this.select.classList.add('mkt-segmented-select');
            this.classList.add('mkt-segmented');

            this.buttons = u.map(this.select.options, function (option, i) {
                var button = document.createElement('button');
                button.index = i;
                button.classList.add('mkt-segmented-button');
                button.textContent = option.textContent;
                button.addEventListener('click', function() {
                    root.selectButton(this);
                    root.dispatchEvent(new Event('change', {bubbles: true}));
                });
                return button;
            });
            this.selectButton(this.buttons[this.select.selectedIndex]);
            this.buttons.forEach(function(button) {
                root.appendChild(button);
            });
        }

        selectButton(button) {
            if (this.selected == button) {
                return;
            } else if (this.selected) {
                this.selected.removeAttribute('selected');
            }
            button.setAttribute('selected', '');
            this.selected = button;
            this.select.selectedIndex = button.index;
        }
        get value() {
            console.log('getting value');
            return this.select.value;
        }

        set value(value) {
            if (this.select.value !== value) {
                this.select.value = value;
                this.selectButton(this.buttons[this.select.selectedIndex]);
            }
        }
    }

    document.registerElement('mkt-segmented', MktSegmented);
});
