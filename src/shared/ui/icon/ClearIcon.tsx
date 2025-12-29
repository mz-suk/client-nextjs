interface ClearIconSVGProps {
  size?: number;
  className?: string;
}

/**
 * Clear 아이콘 SVG (순수 아이콘)
 */
export function ClearIconSVG({ size = 18, className }: ClearIconSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="9" cy="9" r="9" fill="#E2E5EB" />
      <path d="M11.5 6.5L6.5 11.5M6.5 6.5L11.5 11.5" stroke="#5F646F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

interface ClearIconProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

/**
 * Clear 아이콘 버튼 (button 래퍼 포함)
 * - FormInput 등에서 사용
 */
export function ClearIcon({ size = 18, className, onClick }: ClearIconProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label="입력 내용 지우기"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <ClearIconSVG size={size} />
    </button>
  );
}
