interface BrandLogoProps {
  className?: string;
  title?: string;
}

export default function BrandLogo({
  className,
  title = 'Mokhitli Enterprises logo'
}: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 860 320"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      <path
        d="M137 149V74c0-32 24-56 56-56s56 24 56 56v75"
        fill="none"
        stroke="#7a0028"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="42"
      />
      <path
        d="M249 149V74c0-32 24-56 56-56s56 24 56 56v75"
        fill="none"
        stroke="#7a0028"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="42"
      />
      <path
        d="M606 40h94c34 0 54 18 54 44 0 24-18 39-48 39h-44c-6 0-10 4-10 10v1c0 6 4 10 10 10h39c36 0 57 18 57 46 0 29-22 48-56 48h-96z"
        fill="#f6a028"
      />
      <path
        d="M278 74c103-40 234-33 324 18"
        fill="none"
        stroke="#9d9d9f"
        strokeLinecap="round"
        strokeWidth="30"
      />
      <path
        d="M342 108c91-51 198-49 252 2"
        fill="none"
        stroke="#2e6798"
        strokeLinecap="round"
        strokeWidth="25"
      />
      <path
        d="M321 111c49-41 148-53 228-37"
        fill="none"
        stroke="#f6f8ea"
        strokeLinecap="round"
        strokeWidth="12"
      />
      <text
        x="430"
        y="275"
        fill="#050505"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="84"
        fontWeight="400"
        letterSpacing="-2"
        textAnchor="middle"
      >
        Mokhitli Enterprises
      </text>
    </svg>
  );
}
