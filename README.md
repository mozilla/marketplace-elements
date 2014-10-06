marketplace-elements
====================

Web component base UI elements for Firefox Marketplace.

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
