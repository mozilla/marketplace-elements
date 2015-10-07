(function () {
    var CustomEvent, MktEvent;
    (function () {
        // IE Custom Event polyfill.
        CustomEvent = function(event, params) {
            params = params || {};
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        MktEvent = function(event, detail) {
            // Bubbles/cancelable by default;
            return CustomEvent(event, {
                bubbles: true,
                cancelable: true,
                detail: detail,
            });
        };
    })();

    function makeStorage(storage) {
        return {
            getItem: function(key) {
                return JSON.parse(storage.getItem(key));
            },
            setItem: function(key, value) {
                storage.setItem(key, JSON.stringify(value));
            },
        };
    }

    // Mock gettext if it doesn't exist globally.
    var gettext = window.gettext || function (str) { return str; };

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
                var root = this;
                forEach(Object.keys(this.attributeClasses), function (attr) {
                    var className = root.attributeClasses[attr];
                    if (root.hasAttribute(attr) && className) {
                        root.classList.add(className);
                    }
                    root.__defineGetter__(attr, function () {
                        // Treat `foo=""` as `foo=true`.
                        return root.getAttribute(attr) ||
                            root.hasAttribute(attr);
                    });
                    root.__defineSetter__(attr, function (value) {
                        if (value === null || value === false) {
                            root.removeAttribute(attr);
                        } else {
                            root.setAttribute(attr, value || true);
                        }
                    });
                });
            },
        },
    });

    document.registerElement('mkt-banner', {
        prototype: Object.create(MktHTMLElement.prototype, {
            attributeClasses: {
                value: {
                    dismiss: null,
                },
            },
            createdCallback: {
                value: function () {
                    MktHTMLElement.prototype.createdCallback.call(this);
                    this.classList.add('mkt-banner');

                    document.addEventListener('saferesize', function () {
                        this.setMinHeight();
                    }.bind(this));

                    if (!this.hasAttribute('theme')) {
                        this.setAttribute('theme', 'success');
                    }

                    if (this.rememberDismissal && this.dismissed) {
                        this.dismissBanner({immediate: true});
                    }

                    // Format the initial HTML.
                    this.html(this.innerHTML);
                },
            },
            html: {
                value: function (html) {
                    var content = document.createElement('div');
                    content.classList.add('mkt-banner-content');
                    content.innerHTML = html;

                    if (!this.undismissable) {
                        var closeButton = document.createElement('div');
                        closeButton.classList.add('mkt-banner-close');
                        closeButton.href = '#';
                        closeButton.innerHTML = '&times;';
                        closeButton.title = gettext('Close');
                        closeButton.addEventListener('click', function (e) {
                            e.preventDefault();
                            this.dismissBanner();
                        }.bind(this));
                        content.appendChild(closeButton);
                    }

                    this.innerHTML = '';
                    this.appendChild(content);
                    setTimeout(function() {
                        this.setMinHeight();
                    }.bind(this), 20);
                },
            },
            dismissed: {
                get: function () {
                    return this.storage.getItem(this.storageKey);
                },
            },
            dismissBanner: {
                value: function (opts) {
                    // opts.immediate (bool)
                    //     dismiss the banner without a transition.
                    opts = opts || {};
                    if (this.rememberDismissal) {
                        this.storage.setItem(this.storageKey, true);
                    }
                    var removeBanner = function() {
                        // This could get called more than once.
                        if (this.parentNode) {
                            this.parentNode.removeChild(this);
                        }
                    }.bind(this);
                    this.dispatchEvent(new MktEvent('dismiss-banner'));
                    if (opts.immediate) {
                        removeBanner();
                    } else {
                        setTimeout(removeBanner, 500);
                        this.addEventListener('transitionend', removeBanner);
                        this.style.maxHeight = 0;
                    }
                },
            },
            rememberDismissal: {
                get: function () {
                    return this.dismiss === 'remember' ||
                           this.dismiss === 'session';
                },
            },
            setMinHeight: {
                value: function () {
                    this.style.maxHeight = null;
                    this.style.maxHeight = this.clientHeight + 'px';
                },
            },
            storage: {
                get: function () {
                    if (this.dismiss === 'remember') {
                        return makeStorage(localStorage);
                    } else if (this.dismiss === 'session') {
                        return makeStorage(sessionStorage);
                    }
                },
            },
            storageKey: {
                get: function () {
                    if (this.hasAttribute('name')) {
                        return 'mkt-banner-hide-' + this.getAttribute('name');
                    } else {
                        return 'hide_' + this.id.replace(/-/g, '_');
                    }
                },
            },
            undismissable: {
                get: function () {
                    return this.dismiss === 'off';
                },
            },
        }),
    });

    document.registerElement('mkt-login', {
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

    document.registerElement('mkt-segmented', {
        prototype: Object.create(MktHTMLElement.prototype, {
            createdCallback: {
                value: function () {
                    var root = this;
                    var select = this.querySelector('select');
                    this.select = select;
                    select.classList.add('mkt-segmented-select');
                    this.classList.add('mkt-segmented');

                    var buttons = map(select.options, function(option, i) {
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
                        root.dispatchEvent(new Event('change', {bubbles: true}));
                    }

                    buttons.forEach(function(button) {
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

    document.registerElement('mkt-tab-control', {
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
                        root.dispatchEvent(new Event('change', {bubbles: true}));
                    }

                    buttons.forEach(function(button) {
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

    document.registerElement('mkt-tabs', {
        prototype: Object.create(MktHTMLElement.prototype, {
            createdCallback: {
                value: function () {
                    var root = this;
                    var tabs = filter(root.querySelectorAll('section'), function(section) {
                        // Only select immediate sections.
                        return section.parentNode === root;

                    });

                    root.tabs = tabs;
                    var current = root.getAttribute('current');

                    root.classList.add('mkt-tabs');
                    forEach(tabs, function(tab) {
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

    document.registerElement('mkt-prompt', {
        prototype: Object.create(MktHTMLElement.prototype, {
            createdCallback: {
                value: function() {
                    var root = this;
                    this.isModal = this.hasAttribute('data-modal');
                    this.classList.add('mkt-prompt');

                    // Wrap in a section.
                    var section = document.createElement('section');
                    section.className = 'mkt-prompt-content';
                    forEach(this.children, function(child) {
                        section.appendChild(child);
                    });
                    this.appendChild(section);

                    this.querySelector('form > div:last-child')
                        .classList.add('mkt-prompt-btn-wrap');

                    // Default behavior is to allow the first button act as
                    // the cancel button. And the second to be the submit button.
                    forEach(this.querySelectorAll('.mkt-prompt-btn-wrap button'), function(btn, i) {
                        if (i === 0 && !btn.hasAttribute('type')) {
                            btn.setAttribute('data-type', 'cancel');
                        } else if (i === 1 && !btn.hasAttribute('type')) {
                            btn.setAttribute('type', 'submit');
                        }
                    });

                    if (this.isModal) {
                        // Dismiss if click outside of the modal.
                        this.addEventListener('click', function(e) {
                            if (e.target === root) {
                                root.dismissModal();
                            }
                        });

                        // Cancel button closes modal.
                        var cancelButton = this.querySelector('button[data-type="cancel"]');
                        cancelButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            this.dispatchEvent(MktEvent('mkt-prompt-cancel'));
                            root.dismissModal();
                        });
                    }

                    // Submit button triggers event with data.
                    var submitButton = this.querySelector('button[type="submit"]');
                    var form = this.querySelector('form');
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        if (root.validate()) {
                            var detail = serialize(root.querySelector('form'));
                            root.dispatchEvent(MktEvent('mkt-prompt-submit', detail));
                            root.dismissModal();
                        }
                    }, true);
                }
            },
            dismissModal: {
                // Remove the modal from the page.
                value: function() {
                    if (this.isModal) {
                        this.parentNode.removeChild(this);
                    }
                }
            },
            validate: {
                value: function() {
                    return this.querySelector('form').checkValidity();
                }
            },
        }),
    });

    function forEach(arr, fn) {
        // For NodeList.
        return Array.prototype.forEach.call(arr, fn);
    }

    function find(arr, predicate) {
        // For NodeList.
        for (var i = 0, n = arr.length; i < n; i++) {
            if (predicate(arr[i])) {
                return arr[i];
            }
        }
    }

    function map(arr, fn) {
        // For NodeList.
        return Array.prototype.map.call(arr, fn);
    }

    function filter(arr, fn) {
        // For NodeList.
        return Array.prototype.filter.call(arr, fn);
    }

    function serialize(form) {
        var data = {};
        forEach(form.elements, function(ele) {
            if (!ele.disabled && ele.name) {
                data[ele.name] = ele.value;
            }
        });
        return data;
    }
})();
