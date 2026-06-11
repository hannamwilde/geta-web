/* Sanity HTTP client — no build step required. Exposes window.sanity */
(function () {
  var PROJECT_ID = 'a8gycbga';
  var DATASET = 'production';
  var API_VERSION = '2026-06-05';
  var BASE_URL = 'https://' + PROJECT_ID + '.api.sanity.io/v' + API_VERSION + '/data/query/' + DATASET;
  var CDN_BASE = 'https://cdn.sanity.io/images/' + PROJECT_ID + '/' + DATASET;

  function query(groq, params) {
    var url = new URL(BASE_URL);
    url.searchParams.set('query', groq);
    if (params) {
      Object.keys(params).forEach(function (k) {
        url.searchParams.set('$' + k, JSON.stringify(params[k]));
      });
    }
    return fetch(url.toString())
      .then(function (r) { return r.json(); })
      .then(function (r) { return r.result; });
  }

  // Accepts a full image object ({ asset: { _ref }, hotspot, crop }) or a bare _ref string.
  // Applies Sanity hotspot (fp-x/fp-y) and crop (rect) when present on the image object.
  function imageUrl(imageOrRef, opts) {
    var ref = typeof imageOrRef === 'string' ? imageOrRef : (imageOrRef && imageOrRef.asset && imageOrRef.asset._ref);
    if (!ref) return '';
    // _ref format: "image-{id}-{WxH}-{ext}"
    var m = ref.match(/^image-([^-]+(?:-[^-]+)*)-(\d+x\d+)-(\w+)$/);
    if (!m) return '';
    var id = m[1], dims = m[2], ext = m[3];
    var base = CDN_BASE + '/' + id + '-' + dims + '.' + ext;
    var p = new URLSearchParams({ auto: 'format' });

    // Apply explicit crop rect before requesting a resized version
    var crop = typeof imageOrRef === 'object' && imageOrRef.crop;
    if (crop && (crop.left || crop.top || crop.right || crop.bottom)) {
      var origW = parseInt(dims.split('x')[0], 10);
      var origH = parseInt(dims.split('x')[1], 10);
      var rx = Math.round((crop.left  || 0) * origW);
      var ry = Math.round((crop.top   || 0) * origH);
      var rw = Math.round((1 - (crop.left || 0) - (crop.right  || 0)) * origW);
      var rh = Math.round((1 - (crop.top  || 0) - (crop.bottom || 0)) * origH);
      p.set('rect', rx + ',' + ry + ',' + rw + ',' + rh);
    }

    if (opts && opts.width)  p.set('w', opts.width);
    if (opts && opts.height) p.set('h', opts.height);
    if ((opts && opts.width) || (opts && opts.height)) p.set('fit', 'crop');

    // Apply hotspot focal point so fit=crop centers on the subject
    var hotspot = typeof imageOrRef === 'object' && imageOrRef.hotspot;
    if (hotspot && hotspot.x != null) {
      p.set('fp-x', hotspot.x);
      p.set('fp-y', hotspot.y);
    }

    return base + '?' + p.toString();
  }

  window.sanity = { query: query, imageUrl: imageUrl };
})();
