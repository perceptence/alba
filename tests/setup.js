/* jsdom lacks a few browser APIs the app touches on mount. Stub only what is
   missing — never stub something a test is meant to be checking. */

if (!window.matchMedia) {
  window.matchMedia = (q) => ({
    matches: false, media: q, onchange: null,
    addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent: () => false,
  });
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; }
    observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
  };
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {} unobserve() {} disconnect() {}
  };
}
