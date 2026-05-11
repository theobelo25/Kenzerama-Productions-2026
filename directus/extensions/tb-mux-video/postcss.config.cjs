// Local PostCSS config so the Directus extension build does not inherit the
// project root's Tailwind PostCSS plugins (which would fail because they are
// not installed in this extension's package).
module.exports = { plugins: [] };
