/* SVG brand logos for the skills section. */

function PhotoshopLogo() {
  return (
    <svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="46" height="46" fill="#001E36" />
      <text
        x="23" y="29"
        textAnchor="middle"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontWeight="900" fontSize="16"
        fill="#31A8FF"
      >Ps</text>
    </svg>
  );
}

function IllustratorLogo() {
  return (
    <svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="46" height="46" fill="#310000" />
      <text
        x="23" y="29"
        textAnchor="middle"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontWeight="900" fontSize="16"
        fill="#FF9A00"
      >Ai</text>
    </svg>
  );
}

function FigmaLogo() {
  return (
    <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* blue circle — middle right */}
      <path d="M100 150c0-27.614 22.386-50 50-50s50 22.386 50 50-22.386 50-50 50-50-22.386-50-50z" fill="#1ABCFE" />
      {/* green — bottom left */}
      <path d="M0 250c0-27.614 22.386-50 50-50h50v50c0 27.614-22.386 50-50 50S0 277.614 0 250z" fill="#0ACF83" />
      {/* red — top left */}
      <path d="M100 0v100H50C22.386 100 0 77.614 0 50S22.386 0 50 0h50z" fill="#F24E1E" />
      {/* orange — top right */}
      <path d="M200 50c0 27.614-22.386 50-50 50h-50V0h50c27.614 0 50 22.386 50 50z" fill="#FF7262" />
      {/* purple — middle left */}
      <path d="M0 150c0-27.614 22.386-50 50-50h50v100H50c-27.614 0-50-22.386-50-50z" fill="#A259FF" />
    </svg>
  );
}

function CanvaLogo() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="canva-ico-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C4CC" />
          <stop offset="100%" stopColor="#7D2AE8" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#canva-ico-g)" />
      <text
        x="50" y="70"
        textAnchor="middle"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontWeight="900" fontSize="62"
        fill="white"
      >C</text>
    </svg>
  );
}

function CapCutLogo() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="100" height="100" rx="20" fill="#1a1a1a" />
      {/* scissors: two ring handles + crossing blades */}
      <circle cx="30" cy="68" r="11" fill="none" stroke="white" strokeWidth="6" />
      <circle cx="70" cy="68" r="11" fill="none" stroke="white" strokeWidth="6" />
      <line x1="39" y1="59" x2="79" y2="22" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <line x1="61" y1="59" x2="21" y2="22" stroke="white" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function FilmoraLogo() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="filmora-ico-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1665D8" />
          <stop offset="100%" stopColor="#00C8BE" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="18" fill="url(#filmora-ico-g)" />
      {/* Bold F shape built from rectangles */}
      <rect x="25" y="20" width="50" height="11" rx="3" fill="white" />
      <rect x="25" y="20" width="11" height="60" rx="3" fill="white" />
      <rect x="25" y="42" width="36" height="11" rx="3" fill="white" />
    </svg>
  );
}

const LOGO_MAP: Record<string, React.ReactNode> = {
  Photoshop: <PhotoshopLogo />,
  Illustrator: <IllustratorLogo />,
  Figma: <FigmaLogo />,
  Canva: <CanvaLogo />,
  CapCut: <CapCutLogo />,
  Filmora: <FilmoraLogo />,
};

export default function ToolLogo({ name, abbr }: { name: string; abbr: string }) {
  return <>{LOGO_MAP[name] ?? <span>{abbr}</span>}</>;
}
