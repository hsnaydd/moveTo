# MoveTo [![npm version](https://badge.fury.io/js/moveto.svg)](https://badge.fury.io/js/moveto) [![Bower version](https://badge.fury.io/bo/moveTo.svg)](https://badge.fury.io/bo/moveTo) [![Build Status](https://travis-ci.org/hsnaydd/moveTo.svg?branch=master)](https://travis-ci.org/hsnaydd/moveTo.js)

A lightweight, smooth scrolling javascript library without any dependency.

[Demo](https://hsnaydd.github.io/moveTo/demo/)

## Installation

Using NPM

```sh
npm install moveTo --save
```

Using Yarn

```sh
yarn add moveTo
```

Using Bower

```sh
bower install moveTo --save
```

## Usage

```js
const moveTo = new MoveTo();

const target = document.getElementById('target');

moveTo.move(target);

// or register a trigger

const trigger = document.getElementsByClassName('js-trigger')[0];

moveTo.registerTrigger(trigger);

```

Trigger HTML markup

> You can pass all options as data attributes with `mt` prefix. Option name should be written in kebab case format.

```html
  <a href="#target" class="js-trigger" data-mt-duration="300">Trigger</a>
```

## Options

The default options are as follows:

```js
new MoveTo({
  tolerance: 0,
  duration: 800,
  easing: 'easeOutQuart'
})
```

| Option    | Default      | Desctiption                                                                          |
|-----------|--------------|--------------------------------------------------------------------------------------|
| tolerance | 0            | The tolerance of the target to be scrolled, can be negative or positive.             |
| duration  | 800          | Duration of scrolling, in milliseconds.                                              |
| easing    | easeOutQuart | Ease function name                                                                   |
| callback  | noop         | The function to be run after scrolling complete. Target passes as the first argument |

## API

### move(target, options)

Scrolls to target

#### target
Type: HTMLElement|Number

Target element/position to be scrolled. Target position is the distance to the top of the page

#### options
Type: Object

Pass custom options

### registerTrigger(trigger, callback)

#### trigger
Type: HTMLElement

This is the trigger element for starting to scroll when on click.

#### callback

This is the callback function to be run after the scroll complete. This will overwrite the callback option.

### addEaseFunction(name, fn)

Adds custom ease function

#### name
Type: String

Ease function name

#### fn
Type: Function

Ease function. See [http://gizma.com/easing/](http://gizma.com/easing/) for more ease function.

## Examples

<details>
  <summary>Pass ease function(s) when creating instance</summary>

  ```js
  document.addEventListener('DOMContentLoaded', function(){
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
  document.addEventListener('DOMContentLoaded', function(){
    const moveTo = new MoveTo({
      duration: 1000,
      callback: function(target) {
        // This will run if there is no overwrite
      }
    });
    const trigger = document.getElementsByClassName('js-trigger')[0];

    moveTo.registerTrigger(trigger, function(target) {
      // overwrites global callback
    });

    // or

    moveTo.move(1200, {
      duration: 500,
      callback: function() {
        // overwrites global callback
      }
    });
  });
  ```

</details>

## Development setup

```sh
# To install dev dependencies run:

yarn

# or

npm install

# To start the development server run:

gulp serve

# To lint your code run:

gulp scripts:lint

# To make a full new build run:

gulp build

# To run tests

yarn test

# or

npm test
```

## Browser Support

It should work in the current stable releases of Chrome, Firefox, Safari as well as IE9 and up.

## License

Copyright (c) 2017 Hasan Aydoğdu. See the [LICENSE](/LICENSE) file for license rights and limitations (MIT).
