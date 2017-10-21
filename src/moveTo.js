
const MoveTo = (() => {
  /**
   * Defaults
   * @type {object}
   */
  const defaults = {
    tolerance: 0,
    duration: 800,
    easing: 'easeOutQuart',
    callback: function() {},
  };

  /**
   * easeOutQuart Easing Function
   * @param  {number} t - current time
   * @param  {number} b - start value
   * @param  {number} c - change in value
   * @param  {number} d - duration
   * @return {number} - calculated value
   */
  function easeOutQuart(t, b, c, d) {
    t /= d;
    t--;
    return -c * (t * t * t * t - 1) + b;
  }

  /**
   * Merge two object
   *
   * @param  {object} obj1
   * @param  {object} obj2
   * @return {object} merged object
   */
  function mergeObject(obj1, obj2) {
    const obj3 = {};
    Object.keys(obj1).forEach((propertyName) => {
      obj3[propertyName] = obj1[propertyName];
    });

    Object.keys(obj2).forEach((propertyName) => {
      obj3[propertyName] = obj2[propertyName];
    });
    return obj3;
  };

  /**
   * Converts camel case to kebab case
   * @param  {string} val the value to be converted
   * @return {string} the converted value
   */
  function kebabCase(val) {
    return val.replace(/([A-Z])/g, function($1) {
      return '-' + $1.toLowerCase();
    });
  };

  /**
   * MoveTo Constructor
   * @param {object} options Options
   * @param {object} easeFunctions Custom ease functions
   */
  function MoveTo(options = {}, easeFunctions = {}) {
    this.options = mergeObject(defaults, options);
    this.easeFunctions = mergeObject({easeOutQuart}, easeFunctions);
  }

  /**
   * Register a dom element as trigger
   * @param  {HTMLElement} dom Dom trigger element
   * @param  {function} callback Callback function
   * @return {function|void} unregister function
   */
  MoveTo.prototype.registerTrigger = function(dom, callback) {
    if (!dom) {
      return;
    }

    const href = dom.getAttribute('href') || dom.getAttribute('data-target');
    // The element to be scrolled
    const target = (href && href !== '#')
      ? document.getElementById(href.substring(1))
      : document.body;
    const options = mergeObject(this.options, _getOptionsFromTriggerDom(dom, this.options));

    if (typeof callback === 'function') {
      options.callback = callback;
    }

    const listener = (e) => {
      e.preventDefault();
      this.move(target, options);
    };

    dom.addEventListener('click', listener, false);

    return () => dom.removeEventListener('click', listener, false);
  };

  /**
   * Move
   * Scrolls to given element by using easeOutQuart function
   * @param  {HTMLElement|number} target Target element to be scrolled or target position
   * @param  {object} options Custom options
   */
  MoveTo.prototype.move = function(target, options = {}) {
    if (target !== 0 && !target) {
      return;
    }

    options = mergeObject(this.options, options);

    let distance = typeof target === 'number' ? target : target.getBoundingClientRect().top;
    const from = window.pageYOffset;
    let startTime = null;
    let lastPageYOffset;
    distance -= options.tolerance;

    // rAF loop
    const loop = (currentTime) => {
      let currentPageYOffset = window.pageYOffset;

      if (!startTime) {
        // To starts time from 1, we subtracted 1 from current time
        // If time starts from 1 The first loop will not do anything,
        // because easing value will be zero
        startTime = currentTime - 1;
      }

      const timeElapsed = currentTime - startTime;

      if (lastPageYOffset) {
        if (
          (distance > 0 && lastPageYOffset > currentPageYOffset) ||
          (distance < 0 && lastPageYOffset < currentPageYOffset)
        ) {
          return options.callback(target);
        }
      }
      lastPageYOffset = currentPageYOffset;

      const val = this.easeFunctions[options.easing](
        timeElapsed, from, distance, options.duration
      );

      window.scroll(0, val);

      if (timeElapsed < options.duration) {
        window.requestAnimationFrame(loop);
      } else {
        window.scroll(0, distance + from);
        options.callback(target);
      }
    };

    window.requestAnimationFrame(loop);
  };

  /**
   * Adds custom ease function
   * @param {string}   name Ease function name
   * @param {function} fn   Ease function
   */
  MoveTo.prototype.addEaseFunction = function(name, fn) {
    this.easeFunctions[name] = fn;
  };

  /**
   * Returns options which created from trigger dom element
   * @param  {HTMLElement} dom Trigger dom element
   * @param  {object} options The instance's options
   * @return {object} The options which created from trigger dom element
   */
  function _getOptionsFromTriggerDom(dom, options) {
    const domOptions = {};

    Object.keys(options).forEach((key) => {
      let value = dom.getAttribute(`data-mt-${kebabCase(key)}`);
      if (value) {
        domOptions[key] = isNaN(value) ? value : parseInt(value, 10);
      }
    });
    return domOptions;
  }

  return MoveTo;
})();

if (typeof module !== 'undefined') {
  module.exports = MoveTo;
} else {
  window.MoveTo = MoveTo;
}
