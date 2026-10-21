import { classNames } from "../../utils";

/**
 * Brand logo (SVG mark + wordmark).
 *   <Logo />              full (dark text)
 *   <Logo onLight />      for dark surfaces (sidebar / login panel)
 *   <Logo variant="compact" />  mark only
 */
const Logo = ({ variant = "full", className = "", onLight = false }) => {
  const mark = (
    <svg viewBox="0 0 64 64" fill="none" className="h-9 w-9 shrink-0">
      <rect width="64" height="64" rx="14" fill="#1572FE" />
      <path
        d="M17 17a3 3 0 0 1 3-3h16l8 8v20a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V17z"
        fill="#FBFCFE"
      />
      <path d="M36 14v8h8" fill="#D6E4FF" />
      <path
        d="M24 31h13M24 36h13M24 41h8"
        stroke="#1572FE"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="46" cy="46" r="11" fill="#EEAC5C" />
      <path
        d="M41.5 46.5l3.2 3.2 6.3-7"
        stroke="#292940"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === "compact") return <span className={className}>{mark}</span>;

  return (
    <span className={classNames("inline-flex items-center gap-2.5", className)}>
      {mark}
      <span
        className={classNames(
          "font-kufi text-lg font-bold leading-none",
          onLight ? "text-white" : "text-ink",
        )}
      >
        إديو<span className="text-brand-blue">مس</span>
      </span>
    </span>
  );
};

export default Logo;
