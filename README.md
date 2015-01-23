marketplace-elements
====================

Custom HTML elements for Firefox Marketplace.

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
| theme     | Change the color scheme. May be any of the actions defined in [marketplace-frontend](https://github.com/mozilla/fireplace/blob/master/src/media/css/lib/colors.styl) or a light variant. Examples: `"success"` (default) or `"success-light"`. Additionally `"firefox"` may be specified for a gray banner with the Firefox logo. |
| dismiss   | Configure dismissal. Values: `"on"` (default), `"off"`, `"remember"`, `"session"`. |

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

A form that can take the form of a page or as a modal. As a page, it
has just a submit button. As a modal, it has a cancel and submit button.

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

### Events

| event             | description |
|-------------------|-------------|
| mkt-prompt-cancel | cancel button is clicked |
| mkt-prompt-submit | submit button is clicked. Serialized form data is passed in event details. |

### Configuration

| attribute | description |
|-----------|-------------|
| validate  | function to determine form validity. Defaults to only call form.checkvalidity. |
