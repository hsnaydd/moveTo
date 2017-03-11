/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "MoveTo" }] */

const MoveTo = (() => {
  /**
   * Defaults
   * @type {Object}
   */
  const defaults = {
    tolerance: 0,
    duration: 800,
    easeFunctionName: 'outQuart',
  };

  /**
   * outQuart Easing Fonksiyonu
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
      this.easeFunctions = mergeObject({outQuart: easeOutQuart}, easeFunctions);
    }

    /**
     * Register a dom element as trigger
     * @param  {HTMLElement} dom Dom trigger element
     */
    registerTrigger(dom) {
      if (!dom) {
        return;
      }

      const href = dom.getAttribute('href');
      // The element to be scrolled
      const target = href && document.getElementById(href.substring(1));
      const options = mergeObject(this.options, _getOptionsFromTriggerDom(dom));

      dom.addEventListener('click', (e) => {
        e.preventDefault();
        this.move(target, options);
      });
    }

    /**
     * Move
     * Scrolls to given element by using easeOutQuart function
     * @param  {HTMLElement} target Target element to be scrolled
     * @param  {Object} options Custom options
     */
    move(target, options = {}) {
      if (!target) {
        return;
      }

      options = mergeObject(this.options, options);

      let to = getOffsetSum(target).top;
      const from = window.pageYOffset;
      to -= options.tolerance;
      const change = to - from;
      let currentTime = 0;
      const increment = 20;
      let lastPageYOffset = 0;

      /*
       * Scroll Animasyon Fonkstionu
       */
      const animate = () => {
        let currentPageYOffset = window.pageYOffset;
        if (lastPageYOffset !== 0) {
          if (
            (lastPageYOffset === currentPageYOffset) ||
            (change > 0 && lastPageYOffset > currentPageYOffset) ||
            (change < 0 && lastPageYOffset < currentPageYOffset)
          ) {
            return;
          }
        }
        lastPageYOffset = currentPageYOffset;
        currentTime += increment;
        const val = this.easeFunctions[options.easeFunctionName](
          currentTime, from, change, options.duration
        );
        window.scroll(0, val);
        if (currentTime < options.duration) {
          setTimeout(animate, increment);
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
   * @return {Object} The options which created from trigger dom element
   */
  function _getOptionsFromTriggerDom(dom) {
    const options = {};
    const optionsMap = {
      'tolerance': 'tolerance',
      'duration': 'duration',
      'easeFunctionName': 'ease-function-name'
    };

    Object.keys(optionsMap).forEach((key) => {
      let value = dom.getAttribute(`data-${optionsMap[key]}`);
      if (value) {
        options[key] = value;
      }
    });
    return options;
  }

  return MoveTo;
})();

window.moveTo = MoveTo;
module.exports = MoveTo;
