export const themeInitScript = `
(function () {
  try {
    var root = document.documentElement;

    // Always apply dark theme on the client
    root.classList.add("dark");
  } catch (_) {}
})();
`;
