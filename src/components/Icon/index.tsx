import type { SVGProps } from 'react';

// 通用 SVG 图标组件属性
interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

// 基础 SVG 包装
function SvgIcon({ size = 16, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

// ---- 图标定义 ----

export function IconSettings({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </SvgIcon>
  );
}

export function IconClipboard({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </SvgIcon>
  );
}

export function IconCheck({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </SvgIcon>
  );
}

export function IconUpload({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </SvgIcon>
  );
}

export function IconDownload({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </SvgIcon>
  );
}

export function IconBarChart({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </SvgIcon>
  );
}

export function IconEdit({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </SvgIcon>
  );
}

export function IconPencil({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </SvgIcon>
  );
}

export function IconTrash({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </SvgIcon>
  );
}

export function IconX({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </SvgIcon>
  );
}

export function IconGrip({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <circle cx="9" cy="5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </SvgIcon>
  );
}

export function IconPause({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </SvgIcon>
  );
}

export function IconPlay({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
    </SvgIcon>
  );
}

export function IconArrowLeft({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </SvgIcon>
  );
}

export function IconList({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </SvgIcon>
  );
}

export function IconArchive({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </SvgIcon>
  );
}

export function IconFileText({ size = 16, ...props }: IconProps) {
  return (
    <SvgIcon size={size} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </SvgIcon>
  );
}
