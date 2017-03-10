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
    }
  };
}

test('Is should create instance successfully', (t) =>{
  t.notThrows(() => {
    new MoveTo();
  });
});

test('It should set defaults', (t) => {
  const inst = new MoveTo();
  t.not(inst.options.tolerance, undefined);
  t.not(inst.options.duration, undefined);
  t.not(inst.options.easeFunctionName, undefined);
});

test('It should change options', (t) => {
  t.is(new MoveTo({tolerance: -10}).options.tolerance, -10);
});

test('It should register trigger', (t) => {
  const instance = new MoveTo();

  const elem = createMockDomElement({});
  t.is(elem._listeners['click'], undefined);

  instance.registerTrigger(elem);

  t.true(typeof elem._listeners['click'] === 'function');
});

test('It should add custom ease function', (t) => {
  const inst = new MoveTo();
  const elem = createMockDomElement({});

  inst.addEaseFunction('test', function() {});

  t.notThrows(() => {
    inst.move(elem, {easeFunctionName: 'test'});
  });
});

test.cb('It should scroll to target element', (t) => {
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

