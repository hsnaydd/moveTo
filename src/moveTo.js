
const MoveTo = (() => {
  /**
   * Defaults
   * @type {Object}
   */
  const defaults = {
    tolerance: 0,
    duration: 800,
    easing: 'easeOutQuart',
    callback: function() {},
  };

  /**
   * easeOutQuart Easing Function
   * @param  {Integer} t - current time
   * @param  {Integer} b - start value
   * @param  {Integer} c - change in value
   * @param  {Integer} d - duration
   * @return {Integer} - calculated value
   */
  function easeOutQuart(t, b, c, d) {
    t /= d;
    t--;
    return -c * (t * t * t * t - 1) + b;
  }

  /**
   * Returns html element's top and left offset
   * @param  {Node} elem - Element
   * @return {Object} Element top and left offset
   */
  function getOffsetSum(elem) {
    let top = 0;
    let left = 0;
    while (elem) {
      top += parseInt(elem.offsetTop, 10);
      left += parseInt(elem.offsetLeft, 10);
      elem = elem.offsetParent;
    }
    return {
      top: top,
      left: left,
    };
  }

  /**
   * Merge two object
   *
   * @param  {Object} obj1
   * @param  {Object} obj2
   * @return {Object} merged object
   */
  function mergeObject(obj1, obj2) {
    let obj3 = {};
    let propertyName;
    for (propertyName in obj1) {
      if (obj1.hasOwnProperty(propertyName)) {
        obj3[propertyName] = obj1[propertyName];
      }
    }
    for (propertyName in obj2) {
      if (obj2.hasOwnProperty(propertyName)) {
        obj3[propertyName] = obj2[propertyName];
      }
    }
    return obj3;
  };

  /**
   * Converts camel case to kebab case
   * @param  {string} val the value to be converted
   * @return {String} the converted value
   */
  function kebabCase(val) {
    return val.replace(/([A-Z])/g, function($1) {
      return '-' + $1.toLowerCase();
    });
  };


  /**
   * Scrolls to an element
   */
  class MoveTo {

    /**
     * Constructer
     * @param {Object} options Options
     * @param {Object} easeFunctions Custom ease functions
     */
    constructor(options = {}, easeFunctions = {}) {
      this.options = mergeObject(defaults, options);
      this.easeFunctions = mergeObject({easeOutQuart}, easeFunctions);
    }

    /**
     * Register a dom element as trigger
     * @param  {HTMLElement} dom Dom trigger element
     * @param  {Function} callback Callback function
     */
    registerTrigger(dom, callback) {
      if (!dom) {
        return;
      }

      const href = dom.getAttribute('href');
      // The element to be scrolled
      const target = (href && href !== '#')
        ? document.getElementById(href.substring(1))
        : 0;
      const options = mergeObject(this.options, _getOptionsFromTriggerDom(dom, this.options));

      if (typeof callback === 'function') {
        options.callback = callback;
      }

      dom.addEventListener('click', (e) => {
        e.preventDefault();
        this.move(target, options);
      });
    }

    /**
     * Move
     * Scrolls to given element by using easeOutQuart function
     * @param  {HTMLElement|Number} target Target element to be scrolled or target position
     * @param  {Object} options Custom options
     */
    move(target, options = {}) {
      if (target !== 0 && !target) {
        return;
      }

      options = mergeObject(this.options, options);

      let to = typeof target === 'number' ? target : getOffsetSum(target).top;
      const from = window.pageYOffset;
      to -= options.tolerance;
      const change = to - from;
      let currentTime = 0;
      const increment = 20;
      let lastPageYOffset = 0;

      /*
       * Scroll Animation Function
       */
      const animate = () => {
        let currentPageYOffset = window.pageYOffset;
        if (lastPageYOffset !== 0) {
          if (
            (lastPageYOffset === currentPageYOffset) ||
            (change > 0 && lastPageYOffset > currentPageYOffset) ||
            (change < 0 && lastPageYOffset < currentPageYOffset)
          ) {
            return options.callback(target);
          }
        }
        lastPageYOffset = currentPageYOffset;
        currentTime += increment;
        const val = this.easeFunctions[options.easing](
          currentTime, from, change, options.duration
        );
        window.scroll(0, val);
        if (currentTime < options.duration) {
          setTimeout(animate, increment);
        } else {
          options.callback(target);
        }
      };
      animate();
    }

    /**
     * Adds custom ease function
     * @param {String}   name Ease function name
     * @param {Function} fn   Ease Function
     */
    addEaseFunction(name, fn) {
      this.easeFunctions[name] = fn;
    }
  }

  /**
   * Returns options which created from trigger dom element
   * @param  {HTMLElement} dom Trigger dom element
   * @param  {Object} options The instance's options
   * @return {Object} The options which created from trigger dom element
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
  window.moveTo = MoveTo;
}
