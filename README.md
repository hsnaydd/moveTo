# MoveTo [![Version](https://img.shields.io/npm/v/moveto.svg?style=flat)](https://www.npmjs.com/package/moveto) [![CDNJS version](https://img.shields.io/cdnjs/v/moveTo.svg?style=flat)](https://cdnjs.com/libraries/moveTo) [![CI Status](https://github.com/hsnaydd/moveTo/actions/workflows/pr.yml/badge.svg)](https://github.com/hsnaydd/moveTo/actions/workflows/pr.yml)

A lightweight (only 1kb gzipped) scroll animation javascript library without any dependency.

[Demo](https://hsnaydd.github.io/moveTo/demo/)

## Installation

### Using npm

```sh
$ npm install moveto --save
```

### Using Yarn

```sh
$ yarn add moveto
```

## Usage

```js
const moveTo = new MoveTo();

const target = document.getElementById('target');

moveTo.move(target);

// Or register a trigger

const trigger = document.getElementsByClassName('js-trigger')[0];

moveTo.registerTrigger(trigger);

```

Trigger HTML markup

You can pass all options as data attributes with the `mt` prefix. Option name should be written in kebab case format, for example:

```html
<a href="#target" class="js-trigger" data-mt-duration="300">Trigger</a>

<!-- Or -->

<button type="button" class="js-trigger" data-target="#target" data-mt-duration="300">Trigger</button>
```

## Options

The following options are available:

```js
new MoveTo({
  tolerance: 0,
  duration: 800,
  easing: 'easeOutQuart',
  container: window
})
```

| Option    | Default      | Description                                                                          |
|-----------|--------------|--------------------------------------------------------------------------------------|
| tolerance | 0            | The tolerance of the target to be scrolled, can be negative or positive              |
| duration  | 800          | Duration of scrolling, in milliseconds                                               |
| easing    | easeOutQuart | Ease function name                                                                   |
| container | window       | The container been computed and scrolled
| callback  | noop         | The function to be run after scrolling complete. Target passes as the first argument |

## API

### move(target, options)

Start scroll animation from current position to the anchor point.

#### target
Type: HTMLElement|Number

Target element/position to be scrolled. Target position is the scrolling distance. It must be negative if the upward movement is desired.

#### options
Type: Object

Pass custom options.

### registerTrigger(trigger, callback)

#### trigger
Type: HTMLElement

This is the trigger element for starting to scroll when on click.

#### callback

This is the callback function to be ran after the scroll completes. This will overwrite the callback option.

### addEaseFunction(name, fn)

Adds custom ease function.

#### name
Type: String

Ease function name.

#### fn
Type: Function

Ease function. See [Easing Equations](http://gizma.com/easing/) for more ease functions.

## Examples

<details>
  <summary>Pass ease function(s) when creating an instance</summary>

  ```js
  document.addEventListener('DOMContentLoaded', function () {
    const easeFunctions = {
      easeInQuad: function (t, b, c, d) {
        t /= d;
        return c * t * t + b;
      },
      easeOutQuad: function (t, b, c, d) {
        t /= d;
        return -c * t* (t - 2) + b;
      }
    }

    const moveTo = new MoveTo({
      duration: 1000,
      easing: 'easeInQuad'
    }, easeFunctions);

    const trigger = document.getElementsByClassName('js-trigger')[0];

    moveTo.registerTrigger(trigger);
  });
  ```
</details>

<details>
  <summary>Working with callback function</summary>

  ```js
  document.addEventListener('DOMContentLoaded', function () {
    const moveTo = new MoveTo({
      duration: 1000,
      callback: function (target) {
        // This will run if there is no overwrite
      }
    });

    const trigger = document.getElementsByClassName('js-trigger')[0];

    moveTo.registerTrigger(trigger, function (target) {
      // Overwrites global callback
    });

    // Or

    moveTo.move(1200, {
      duration: 500,
      callback: function () {
        // Overwrites global callback
      }
    });
  });
```
</details>

<details>
  <summary>Unregister a trigger</summary>

  ```js
  document.addEventListener('DOMContentLoaded', function () {
    const moveTo = new MoveTo();

    const trigger = document.getElementsByClassName('js-trigger')[0];

    // Register a trigger
    const unregister = moveTo.registerTrigger(trigger, { duration: 500 });

    // Unregister a trigger
    unregister();
  });
```
</details>

<details>
  <summary>Back to top</summary>

  ```js
  document.addEventListener('DOMContentLoaded', function () {
    const moveTo = new MoveTo();
    const triggers = document.getElementsByClassName('js-back-to-top');

    for (var i = 0; triggers.length < i; i++) {
      moveTo.registerTrigger(triggers[i]);
    }
  });
  ```

  ```html
  <a href="#" class="js-back-to-top" data-mt-duration="300">Back to top!</a>
  ```
</details>

## Development setup

```sh
# To install dev dependencies run:

$ yarn

# Or so if using npm:

$ npm install

# To start the development server run:

$ yarn start

# Or so if using npm:

$ npm run start

# To lint your code run:

$ yarn lint

# Or so if using npm:

$ npm run lint

# To make a full new build run:

$ yarn build

# Or so if using npm:

$ npm run build

# To run tests:

$ yarn test

# Or so if using npm:

$ npm test
```

## Browser support

It should work in the current stable releases of Chrome, Firefox, Safari and Edge. To add support for older browsers, consider including polyfills/shims for the [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) and [Element.scroll](https://github.com/idmadj/element-scroll-polyfill).

## License

Copyright (c) 2017 Hasan Aydoğdu. See the [LICENSE](/LICENSE) file for license rights and limitations (MIT).
