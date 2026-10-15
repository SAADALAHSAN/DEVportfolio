/**
 * VariableProximity - Vanilla JS implementation of React Bits VariableProximity component
 * Creates proximity-based variable font weight/optical size hover animation for text.
 */
(function () {
  function parseSettings(settingsStr) {
    var map = new Map();
    if (!settingsStr) return map;
    settingsStr.split(',').forEach(function (s) {
      var parts = s.trim().split(' ');
      if (parts.length >= 2) {
        var name = parts[0].replace(/['"]/g, '');
        var value = parseFloat(parts[1]);
        map.set(name, value);
      }
    });
    return map;
  }

  function initVariableProximity(options) {
    var container = typeof options.container === 'string' 
      ? document.querySelector(options.container) 
      : options.container;

    if (!container) return;

    var fromStr = options.fromFontVariationSettings || "'wght' 400, 'opsz' 14";
    var toStr = options.toFontVariationSettings || "'wght' 1000, 'opsz' 144";
    var radius = options.radius || 220;
    var falloff = options.falloff || 'linear';

    var fromSettings = parseSettings(fromStr);
    var toSettings = parseSettings(toStr);

    var parsedSettings = [];
    fromSettings.forEach(function (fromValue, axis) {
      var toValue = toSettings.has(axis) ? toSettings.get(axis) : fromValue;
      parsedSettings.push({
        axis: axis,
        fromValue: fromValue,
        toValue: toValue
      });
    });

    var letterElements = Array.from(container.querySelectorAll('span'));
    if (letterElements.length === 0) return;

    var mousePosition = { x: -9999, y: -9999 };
    var lastPosition = { x: null, y: null };
    var animFrameId = null;

    function updateMousePosition(clientX, clientY) {
      var rect = container.getBoundingClientRect();
      mousePosition = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function onMouseMove(ev) {
      updateMousePosition(ev.clientX, ev.clientY);
    }

    function onTouchMove(ev) {
      if (ev.touches && ev.touches[0]) {
        updateMousePosition(ev.touches[0].clientX, ev.touches[0].clientY);
      }
    }

    function onMouseLeave() {
      mousePosition = { x: -9999, y: -9999 };
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('mouseleave', onMouseLeave, { passive: true });

    function calculateFalloff(distance) {
      var norm = Math.min(Math.max(1 - distance / radius, 0), 1);
      switch (falloff) {
        case 'exponential':
          return Math.pow(norm, 2);
        case 'gaussian':
          return Math.exp(-Math.pow(distance / (radius / 2), 2) / 2);
        case 'linear':
        default:
          return norm;
      }
    }

    function tick() {
      var x = mousePosition.x;
      var y = mousePosition.y;

      if (lastPosition.x !== x || lastPosition.y !== y) {
        lastPosition = { x: x, y: y };

        var containerRect = container.getBoundingClientRect();

        letterElements.forEach(function (el) {
          if (!el) return;

          var rect = el.getBoundingClientRect();
          var letterCenterX = rect.left + rect.width / 2 - containerRect.left;
          var letterCenterY = rect.top + rect.height / 2 - containerRect.top;

          var distance = Math.sqrt(
            Math.pow(x - letterCenterX, 2) + Math.pow(y - letterCenterY, 2)
          );

          if (distance >= radius) {
            el.style.fontVariationSettings = fromStr;
          } else {
            var falloffVal = calculateFalloff(distance);
            var newSettings = parsedSettings
              .map(function (item) {
                var val = item.fromValue + (item.toValue - item.fromValue) * falloffVal;
                return "'" + item.axis + "' " + val.toFixed(1);
              })
              .join(', ');

            el.style.fontVariationSettings = newSettings;
          }
        });
      }

      animFrameId = requestAnimationFrame(tick);
    }

    animFrameId = requestAnimationFrame(tick);

    return function cleanup() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    initVariableProximity({
      container: '#footWord',
      fromFontVariationSettings: "'wght' 400, 'opsz' 14",
      toFontVariationSettings: "'wght' 1000, 'opsz' 144",
      radius: 240,
      falloff: 'linear'
    });
  });

  window.initVariableProximity = initVariableProximity;
})();
