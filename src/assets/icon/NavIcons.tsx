import type { JSX, SVGProps } from "react";

type SVGPropsType = SVGProps<SVGSVGElement>;
export type PropsType = SVGProps<SVGSVGElement>;

export function ChevronUp(props: PropsType) {
  return (
    <svg
      width={16}
      height={8}
      viewBox="0 0 16 8"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.553.728a.687.687 0 01.895 0l6.416 5.5a.688.688 0 01-.895 1.044L8 2.155 2.03 7.272a.688.688 0 11-.894-1.044l6.417-5.5z"
      />
    </svg>
  );
}

export function Dashboard(props: PropsType) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="10" width="8" height="11" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Company(props: PropsType) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <rect x="3" y="3" width="10" height="18" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="8" width="8" height="13" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 7h2M6 11h2M6 15h2M16 12h2M16 16h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Story(props: PropsType) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M4 5c0-1.1.9-2 2-2h10a2 2 0 012 2v14a1 1 0 01-1.5.86L12 17l-4.5 2.86A1 1 0 016 19V5z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 7h6M8 10h6M8 13h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function User(props: PropsType) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="9" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M15 9C16.6569 9 18 7.65685 18 6C18 4.34315 16.6569 3 15 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse
        cx="9"
        cy="17"
        rx="7"
        ry="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M18 14C19.7542 14.3847 21 15.3589 21 16.5C21 17.5293 19.9863 18.4229 18.5 18.8704"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const CategoryIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

export function CMS(props: PropsType) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 6h.01M10 6h.01M13 6h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 12h10M7 15.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
