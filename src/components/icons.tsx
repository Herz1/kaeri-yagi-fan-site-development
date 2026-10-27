import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const stroke = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});
const solid = (size = 20) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true });

export const IPlay = ({ size, ...p }: P) => (
  <svg {...solid(size)} {...p}>
    <path d="M8 5.6v12.8a1 1 0 0 0 1.52.85l10.2-6.4a1 1 0 0 0 0-1.7L9.52 4.75A1 1 0 0 0 8 5.6z" />
  </svg>
);
export const IPause = ({ size, ...p }: P) => (
  <svg {...solid(size)} {...p}>
    <rect x="6" y="5" width="4.2" height="14" rx="1.2" />
    <rect x="13.8" y="5" width="4.2" height="14" rx="1.2" />
  </svg>
);
export const INext = ({ size, ...p }: P) => (
  <svg {...solid(size)} {...p}>
    <path d="M5 6.2v11.6a1 1 0 0 0 1.55.83L15 13v4.5a1 1 0 0 0 2 0v-11a1 1 0 0 0-2 0V11L6.55 5.37A1 1 0 0 0 5 6.2z" />
  </svg>
);
export const IPrev = ({ size, ...p }: P) => (
  <svg {...solid(size)} {...p}>
    <path d="M19 6.2v11.6a1 1 0 0 1-1.55.83L9 13v4.5a1 1 0 0 1-2 0v-11a1 1 0 0 1 2 0V11l8.45-5.63A1 1 0 0 1 19 6.2z" />
  </svg>
);
export const IClose = ({ size, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IExternal = ({ size = 14, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </svg>
);
export const IHeart = ({ size, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />
  </svg>
);
export const ICheck = ({ size, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const IBolt = ({ size, ...p }: P) => (
  <svg {...solid(size)} {...p}>
    <path d="M13.2 2.5L4.5 13.6h6.1l-1 7.9 8.9-11.3h-6.2l.9-7.7z" />
  </svg>
);
export const IMenu = ({ size, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);
export const IMusic = ({ size, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <path d="M9 18V5.5l11-2v12.5" />
    <circle cx="6.5" cy="18" r="2.5" />
    <circle cx="17.5" cy="16" r="2.5" />
  </svg>
);
export const IPin = ({ size, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const ITicket = ({ size, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <path d="M3 8.5A2.5 2.5 0 0 0 5.5 6h13A2.5 2.5 0 0 0 21 8.5v1.5a2 2 0 0 0 0 4v1.5a2.5 2.5 0 0 0-2.5 2.5h-13A2.5 2.5 0 0 0 3 15.5V14a2 2 0 0 0 0-4V8.5z" />
    <path d="M14 7v10" strokeDasharray="2 2.2" />
  </svg>
);
export const IFilm = ({ size, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M10 9.3v5.4l4.6-2.7L10 9.3z" fill="currentColor" stroke="none" />
  </svg>
);
export const IArrow = ({ size, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ISparkle = ({ size, ...p }: P) => (
  <svg {...solid(size)} {...p}>
    <path d="M12 2.5l1.9 6.1 6.1 1.9-6.1 1.9-1.9 6.1-1.9-6.1L4 10.5l6.1-1.9L12 2.5z" />
  </svg>
);
export const ITrash = ({ size = 16, ...p }: P) => (
  <svg {...stroke(size)} {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
  </svg>
);
