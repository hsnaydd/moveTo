/* eslint-disable require-jsdoc */

import test from 'ava';
import 'jsdom-global/register';
import MoveTo from '../src/moveTo.js';

function createMockDomElement(options) {
  options.attributes = options.attributes || {};

  return {
    _listeners: {},

    getAttribute: function(name) {
      return options.attributes[name];
    },
    offsetTop: options.offsetTop || 0,
    offsetLeft: 0,
    offsetParent: null,
    addEventListener: function(event, cb) {
      this._listeners[event] = cb;
    },
    removeEventListener: function(event, cb) {
      delete this._listeners[event];
    },
    getBoundingClientRect: function() {
      return {top: options.offsetTop || 0};
    }
  };
}

window.requestAnimationFrame = (function() {
  return function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

test('It should create instance successfully', (t) =>{
  t.notThrows(() => {
    new MoveTo();
  });
});

test('It should set defaults', (t) => {
  const inst = new MoveTo();
  t.not(inst.options.tolerance, undefined);
  t.not(inst.options.duration, undefined);
  t.not(inst.options.easing, undefined);
  t.not(inst.options.callback, undefined);
  t.not(inst.options.container, undefined);
});

test('It should pass ease function(s) when creating instance', (t) => {
  const easeFunctions = {
    easeInQuad: function(t, b, c, d) {
      t /= d;
      return c * t * t + b;
    },
    easeOutQuad: function(t, b, c, d) {
      t /= d;
      return -c * t* (t - 2) + b;
    }
  };
  const inst = new MoveTo({}, easeFunctions);

  t.not(inst.easeFunctions['easeInQuad'], undefined);
  t.not(inst.easeFunctions['easeOutQuad'], undefined);
});

test('It should change options', (t) => {
  t.is(new MoveTo({tolerance: -10}).options.tolerance, -10);
});

test('It should register trigger', (t) => {
  const instance = new MoveTo();
  const elem = createMockDomElement({});

  instance.registerTrigger(elem);

  t.true(typeof elem._listeners['click'] === 'function');
});

test('It should unregister trigger', (t) => {
  const instance = new MoveTo();
  const elem = createMockDomElement({});
  const unregister = instance.registerTrigger(elem);

  t.true(typeof elem._listeners['click'] === 'function');
  unregister();
  t.true(typeof elem._listeners['click'] === 'undefined');
});

test('It should add custom ease function', (t) => {
  const inst = new MoveTo();
  const elem = createMockDomElement({});

  inst.addEaseFunction('test', function() {});

  t.not(inst.easeFunctions['test'], undefined);

  t.notThrows(() => {
    inst.move(elem, {easeFunctionName: 'test'});
  });
});

test.serial.cb('It should scroll to target position', (t) => {
  const inst = new MoveTo();

  const calls = [];

  // mock scroll.
  const originalScroll = window.scroll;
  window.scroll = function(_, y) {
    calls.push(y);
  };

  inst.move(1500);

  setTimeout(() => {
    // revert scroll.
    window.scroll = originalScroll;

    t.is(calls[calls.length - 1], 1500);

    t.end();
  }, 1000);
});

test.serial.cb('It should scroll to target element', (t) => {
  const inst = new MoveTo();
  const elem = createMockDomElement({offsetTop: 1500});

  const calls = [];

  // mock scroll.
  const originalScroll = window.scroll;
  window.scroll = function(_, y) {
    calls.push(y);
  };

  inst.move(elem);

  setTimeout(() => {
    // revert scroll.
    window.scroll = originalScroll;

    t.is(calls[calls.length - 1], 1500);

    t.end();
  }, 1000);
});

test.serial.cb('It should scroll to target position inside an element', (t) => {
  const container = document.createElement('div');

  document.body.appendChild(container);

  const inst = new MoveTo({
    container: container
  });

  const calls = [];

  // mock scroll.
  const originalScroll = container.scroll;
  container.scroll = function(_, y) {
    calls.push(y);
  };

  inst.move(1500);

  setTimeout(() => {
    // revert scroll.
    container.scroll = originalScroll;

    t.is(calls[calls.length - 1], 1500);

    t.end();
  }, 1000);
});

