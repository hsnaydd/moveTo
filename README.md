# MoveTo [![npm version](https://badge.fury.io/js/moveto.svg)](https://badge.fury.io/js/moveto) [![Bower version](https://badge.fury.io/bo/moveTo.svg)](https://badge.fury.io/bo/moveTo) [![CDNJS version](https://img.shields.io/cdnjs/v/moveTo.svg)](https://cdnjs.com/libraries/moveTo) [![Build Status](https://travis-ci.org/hsnaydd/moveTo.svg?branch=master)](https://travis-ci.org/hsnaydd/moveTo.js)

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

### Using Bower

```sh
$ bower install moveTo --save
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

You can pass all options as data attributes with `mt` prefix. Option name should be written in kebab case format, for example:

```html
<a href="#target" class="js-trigger" data-mt-duration="300">Trigger</a>

<!-- Or -->

<button type="button" class="js-trigger" data-target="#target" data-mt-duration="300">Trigger</button>
```

## Options

The default options are as follows:

```js
new MoveTo({
  tolerance: 0,
  duration: 800,
  easing: 'easeOutQuart',
  container: window
})
```

| Option    | Default      | Desctiption                                                                          |
|-----------|--------------|--------------------------------------------------------------------------------------|
| tolerance | 0            | The tolerance of the target to be scrolled, can be negative or positive              |
| duration  | 800          | Duration of scrolling, in milliseconds                                               |
| easing    | easeOutQuart | Ease function name                                                                   |
| container | window       | The container been computed and scrolled
| callback  | noop         | The function to be run after scrolling complete. Target passes as the first argument |

## API

### move(target, options)

Start scroll animation from current position to the anchor point

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

This is the callback function to be run after the scroll complete. This will overwrite the callback option.

### addEaseFunction(name, fn)

Adds custom ease function.

#### name
Type: String

Ease function name.

#### fn
Type: Function

Ease function. See [Easing Equations](http://gizma.com/easing/) for more ease function.

## Examples

<details>
  <summary>Pass ease function(s) when creating instance</summary>

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

It should work in the current stable releases of Chrome, Firefox, Safari as well as IE10 and up. To add support for older browsers, consider including polyfills/shims for the [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

## License

Copyright (c) 2017 Hasan Aydoğdu. See the [LICENSE](/LICENSE) file for license rights and limitations (MIT).
