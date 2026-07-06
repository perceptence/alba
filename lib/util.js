/* Small shared helpers. */

// Whether the user prefers reduced motion (guarded for SSR).
export const RM =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Format a number as USD, e.g. 18500 -> "$18,500".
export const money = (n) => "$" + n.toLocaleString();

// Ordinal suffix, e.g. 1 -> "1st", 2 -> "2nd".
export const ord = (n) => {
  const t = n % 10,
    h = n % 100;
  return (
    n +
    (t === 1 && h !== 11
      ? "st"
      : t === 2 && h !== 12
        ? "nd"
        : t === 3 && h !== 13
          ? "rd"
          : "th")
  );
};
