(function () {
    // Mock gettext if it doesn't exist globally.
    var gettext = window.gettext || function (str) { return str; };

    function forEach(arr, fn) {
        return Array.prototype.forEach.call(arr, fn);
    }

    function find(array, predicate) {
        for (var i = 0, n = array.length; i < n; i++) {
            if (predicate(array[i])) {
                return array[i];
            }
        }
    }

    function map(arr, fn) {
        return Array.prototype.map.call(arr, fn);
    }

    // Abstract element with attribute -> class mappings.
    var MktHTMLElement = function () {};
    MktHTMLElement.prototype = Object.create(HTMLElement.prototype, {
        attributeChangedCallback: {
            value: function (name, previousValue, value) {
                // Handle setting classes based on attributeClasses.
                if (this.attributeClasses.hasOwnProperty(name)) {
                    var className = this.attributeClasses[name];
                    if (value === null) {
                        this.classList.remove(className);
                    } else {
                        this.classList.add(className);
                    }
                }
            },
        },
        attributeClasses: {
            value: {},
        },
        createdCallback: {
            value: function () {
                var self = this;
                Object.keys(this.attributeClasses).forEach(function (attr) {
                    var className = self.attributeClasses[attr];
                    if (self.hasAttribute(attr) && className) {
                        self.classList.add(className);
                    }
                    self.__defineGetter__(attr, function () {
                        // Treat `foo=""` as `foo=true`.
                        return self.getAttribute(attr) ||
                            self.hasAttribute(attr);
                    });
                    self.__defineSetter__(attr, function (value) {
                        if (value === null || value === false) {
                            self.removeAttribute(attr);
                        } else {
                            self.setAttribute(attr, value || true);
                        }
                    });
                });
            },
        },
    });

    var MktBanner = document.registerElement('mkt-banner', {
        prototype: Object.create(MktHTMLElement.prototype, {
            attributeClasses: {
                value: {
                    success: 'mkt-banner-success',
                    dismiss: null,
                },
            },
            createdCallback: {
                value: function () {
                    MktHTMLElement.prototype.createdCallback.call(this);
                    this.classList.add('mkt-banner');

                    // This is a Firefox banner if it isn't a success banner.
                    if (!this.success) {
                        this.classList.add('mkt-banner-firefox');
                    }

                    if (this.rememberDismissal && this.dismissed) {
                        this.dismissBanner();
                    }

                    // Format the initial HTML.
                    this.html(this.innerHTML);
                },
            },
            html: {
                value: function (html) {
                    var self = this;

                    var content = document.createElement('div');
                    content.classList.add('mkt-banner-content');
                    content.innerHTML = html;

                    if (!this.undismissable) {
                        var closeButton = document.createElement('a');
                        closeButton.classList.add('close');
                        closeButton.href = '#';
                        closeButton.textContent = gettext('Close');
                        closeButton.title = gettext('Close');
                        closeButton.addEventListener('click', function (e) {
                            e.preventDefault();
                            self.dismissBanner();
                        });
                        content.appendChild(closeButton);
                    }

                    this.innerHTML = '';
                    this.appendChild(content);
                },
            },
            dismissed: {
                get: function () {
                    return this.storage.getItem(this.storageKey);
                },
            },
            dismissBanner: {
                value: function () {
                    if (this.rememberDismissal) {
                        this.storage.setItem(this.storageKey, true);
                    }
                    this.parentNode.removeChild(this);
                },
            },
            rememberDismissal: {
                get: function () {
                    return this.dismiss === 'remember';
                },
            },
            storage: {
                get: function () {
                    return require('storage');
                },
            },
            storageKey: {
                get: function () {
                    return 'hide_' + this.id.replace(/-/g, '_');
                },
            },
            undismissable: {
                get: function () {
                    return this.dismiss === 'off';
                },
            },
        }),
    });

    var MktLogin = document.registerElement('mkt-login', {
        prototype: Object.create(MktHTMLElement.prototype, {
            createdCallback: {
                value: function () {
                    if (this.isLink) {
                        var link = document.createElement('a');
                        link.href = '#';
                        link.classList.add('persona');
                        link.textContent = this.textContent;
                        this.innerHTML = '';
                        this.appendChild(link);
                    }
                },
            },
            isLink: {
                get: function () {
                    return this.hasAttribute('link');
                },
            },
        }),
    });

    var MktSegmented = document.registerElement('mkt-segmented', {
        prototype: Object.create(MktHTMLElement.prototype, {
            createdCallback: {
                value: function () {
                    var root = this;
                    var select = this.querySelector('select');
                    this.select = select;
                    select.classList.add('mkt-segmented-select');
                    this.classList.add('mkt-segmented');

                    var buttons = map(select.options, function (option, i) {
                        var button = document.createElement('button');
                        button.index = i;
                        button.classList.add('mkt-segmented-button');
                        button.textContent = option.textContent;
                        button.addEventListener('click', selectButton);
                        return button;
                    });

                    var selected;
                    // This call will set `selected`.
                    selectButton.call(buttons[select.selectedIndex]);

                    function selectButton() {
                        if (selected == this) {
                            return;
                        } else if (selected) {
                            selected.removeAttribute('selected');
                        }
                        this.setAttribute('selected', '');
                        selected = this;
                        select.selectedIndex = this.index;
                        root.dispatchEvent(new Event('change'));
                    }

                    buttons.forEach(function (button) {
                        root.appendChild(button);
                    });
                },
            },
            value: {
                get: function () {
                    return this.select.value;
                },
            }
        }),
    });

    var MktTabControl = document.registerElement('mkt-tab-control', {
        prototype: Object.create(MktHTMLElement.prototype, {
            createdCallback: {
                value: function () {
                    var root = this;
                    var select = this.querySelector('select');
                    this.select = select;
                    select.classList.add('mkt-tab-control-select');
                    this.classList.add('mkt-tab-control');

                    var buttons = map(select.options, function (option, i) {
                        var button = document.createElement('button');
                        button.index = i;
                        button.classList.add('mkt-tab-control-button');
                        button.textContent = option.textContent;
                        button.addEventListener('click', selectButton);
                        return button;
                    });

                    // Set the currently selected option.
                    var selected;
                    // This call will set `selected`.
                    selectButton.call(buttons[select.selectedIndex]);

                    // Hook this up to a <mkt-tabs> if `control` is set.
                    var controlledTabsId = root.getAttribute('control');
                    var controlledTabs;
                    if (controlledTabsId) {
                        controlledTabs = document.getElementById(controlledTabsId);
                        controlledTabs.controller = root.id;
                        controlledTabs.setAttribute('current', root.value);
                        root.addEventListener('change', function () {
                            controlledTabs.setAttribute('current', root.value);
                        });
                    }

                    function selectButton() {
                        if (selected == this) {
                            return;
                        } else if (selected) {
                            selected.removeAttribute('selected');
                        }
                        this.setAttribute('selected', '');
                        selected = this;
                        select.selectedIndex = this.index;
                        root.dispatchEvent(new Event('change'));
                    }

                    buttons.forEach(function (button) {
                        root.appendChild(button);
                    });
                },
            },
            value: {
                get: function () {
                    return this.select.value;
                },
            }
        }),
    });

    var MktTabs = document.registerElement('mkt-tabs', {
        prototype: Object.create(MktHTMLElement.prototype, {
            createdCallback: {
                value: function () {
                    var root = this;
                    var tabs = root.querySelectorAll('section');
                    root.tabs = tabs;
                    var current = root.getAttribute('current');

                    root.classList.add('mkt-tabs');
                    forEach(tabs, function (tab) {
                        tab.classList.add('mkt-tab');
                        if (tab.getAttribute('name') == current) {
                            tab.classList.add('mkt-tab-active');
                        }
                    });
                },
            },
            attributeChangedCallback: {
                value: function (name, oldValue, newValue) {
                    var root = this;
                    function findTab(name) {
                        return find(root.tabs, function (tab) {
                            return tab.getAttribute('name') == name;
                        });
                    }
                    if (name == 'current') {
                        if (oldValue) {
                            findTab(oldValue).classList.remove('mkt-tab-active');
                        }
                        if (newValue) {
                            findTab(newValue).classList.add('mkt-tab-active');
                            root.dispatchEvent(new Event('change'));
                        }
                    }
                },
            },
        }),
    });
})();
