marketplace-elements
====================

Web component UI elements for Firefox Marketplace.

    make install
    make
    make serve

[View Demo](http://mozilla.github.io/marketplace-elements/)

Banner
------

The banner is used to show messages to users.

```html
<mkt-banner>
  Hey! You should read this.
  <a href="#do-something">Perform some action</a>
  <small>This small text will be hidden on narrow screens.</small>
</mkt-banner>
```

### Configuration


| attribute | description |
|-----------|-------------|
| success   | Make it green |
| dismiss   | Configure dismissal. Values: `"on"` (default), `"off"`, `"remember"`. |

Segmented
---------

The segmented control acts like a select but provides a horizontal layout.

```html
<mkt-segmented>
    <select>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3" selected>Three</option>
    </select>
</mkt-segmented>
```

```js
document.querySelector('mkt-segmented').value;  // "3"
```

Login
-----

A login link. This is pretty basic. It will add the "persona" class to a link.

```html
<mkt-login link>Login!</mkt-login>
```

### Configuration

| attribute | description |
|-----------|-------------|
| link      | Required. Link is the only supported type right now. |


Prompt
------

A form that can take the form of a page or as a modal. As a page, just
has a submit button. As a modal, has a cancel and submit button.

As a page:

```html
<mkt-prompt>
  <form>
    <p>What is your name?</p>
    <textarea name="name"></textarea>
    <div>
      <button>Cancel</button>
      <button>Submit</button>
    </div>
  </form>
</mkt-prompt>
```

As a modal:

```
<mkt-prompt data-modal>
...
```

The prompt modal fires two events:

- **mkt-prompt-cancel** - fired when the cancel button is clicked
- **mkt-prompt-submit** - fired when the submit button is clicked.
  Passes the serialized form data in the event's details.
