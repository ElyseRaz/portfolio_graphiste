function Instagram() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function Behance() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.5 11.25c.97 0 1.75-.67 1.75-1.5S8.47 8.25 7.5 8.25H5.25v3H7.5z" />
      <path d="M7.75 13H5.25v3.25H7.75c1.1 0 2-.78 2-1.625S8.85 13 7.75 13z" />
      <path d="M3 6v12h5.25c2.07 0 3.75-1.57 3.75-3.5 0-1.18-.6-2.2-1.5-2.82.6-.55.98-1.34.98-2.18C11.48 7.57 9.87 6 7.82 6H3z" />
      <path d="M15.5 10.5c-2.49 0-4.5 2-4.5 4.5s2.01 4.5 4.5 4.5c1.87 0 3.49-1.12 4.22-2.75h-2.06c-.39.6-1.05 1-1.91.98-.97-.02-1.77-.7-2.03-1.73h6.16c.05-.33.06-.67.06-1C19.94 12.5 17.95 10.5 15.5 10.5zm-2.12 3.75c.26-.95 1.05-1.5 2.12-1.5 1.05 0 1.82.57 2.07 1.5h-4.19z" />
      <rect x="13.5" y="8" width="4" height="1.5" rx=".5" />
    </svg>
  );
}

function Facebook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedIn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const LOGO_MAP: Record<string, React.ReactNode> = {
  Instagram: <Instagram />,
  Behance: <Behance />,
  Facebook: <Facebook />,
  LinkedIn: <LinkedIn />,
};

export default function SocialLogo({ label }: { label: string }) {
  return <>{LOGO_MAP[label] ?? <span style={{ fontSize: 11 }}>{label.slice(0, 2).toUpperCase()}</span>}</>;
}
