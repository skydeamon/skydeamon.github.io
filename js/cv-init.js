/**
 * Auto-initialize CVRenderer from data attributes on the script tag.
 * Usage: <script src="cv-init.js" data-profile="contract"></script>
 *        <script src="cv-init.js" data-profile="contract" data-format="engagement" data-base="../../"></script>
 */
(function () {
  'use strict';
  var script = document.currentScript;
  if (!script) return;

  var profile = script.getAttribute('data-profile');
  if (!profile || typeof CVRenderer === 'undefined') return;

  var format = script.getAttribute('data-format');
  var base = script.getAttribute('data-base');

  if (format || base) {
    var opts = {};
    if (format) opts.format = format;
    if (base) opts.base = base;
    CVRenderer.initCV(profile, opts);
  } else {
    CVRenderer.initCV(profile);
  }
})();
