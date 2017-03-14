# MoveTo [![npm version](https://badge.fury.io/js/moveto.svg)](https://badge.fury.io/js/moveto) [![Bower version](https://badge.fury.io/bo/moveTo.svg)](https://badge.fury.io/bo/moveTo) [![Build Status](https://travis-ci.org/hsnaydd/moveTo.svg?branch=master)](https://travis-ci.org/hsnaydd/moveTo.js)

A lightweight, smooth scrolling javascript library without any dependency.

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

```html
  <a href="#target" class="js-trigger" data-duration="300">Trigger</a>
```

## Options

The default options are as follows:

```js
new MoveTo({
  tolerance: 0,
  duration: 800,
  ease: 'outQuart'
})
```

| Option    | Desctiption                                                              |
|-----------|--------------------------------------------------------------------------|
| tolerance | The tolerance of the target to be scrolled, can be negative or positive. |
| duration  | Duration of scrolling, in milliseconds.                                  |
| ease      | Ease function name                                                       |

## API

### move(target, options)

Scrolls to target

### target
Type: HTMLElement|Number

Target element/position to be scrolled. Target position is the distance to the top of the page

#### options
Type: Object

Pass custom options

### addEaseFunction(name, fn)

Adds custom ease function

#### name
Type: string

Ease function name

#### fn
Type: function

Ease function. See [http://gizma.com/easing/](http://gizma.com/easing/) for more ease function.

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

yarn test tests/**

# or

npm test tests/**
```

## Browser Support

It should work in the current stable releases of Chrome, Firefox, Safari as well as IE9 and up.

## License

Copyright (c) 2017 Hasan Aydoğdu. See the [LICENSE](/LICENSE) file for license rights and limitations (MIT).
