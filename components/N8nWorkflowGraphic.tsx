import type { SVGProps } from 'react'

const N8nWorkflowGraphic = (props: SVGProps<SVGSVGElement>) => (
  <svg width={1440} height={720} viewBox="0 0 1440 720" fill="none" {...props}>
    <defs>
      <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#050505" />
        <stop offset="50%" stopColor="#111827" />
        <stop offset="100%" stopColor="#050505" />
      </linearGradient>
      <linearGradient id="cardGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#9333EA" />
      </linearGradient>
      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
          dx="0"
          dy="10"
          stdDeviation="20"
          floodColor="#000000"
          floodOpacity="0.45"
        />
      </filter>
    </defs>
    <rect width="1440" height="720" fill="url(#bgGradient)" rx="24" />
    <text x="80" y="120" fill="#F9FAFB" fontSize="42" fontFamily="Inter" fontWeight={700}>
      AInTECH Weekly Newsletter
    </text>
    <text x="80" y="160" fill="#9CA3AF" fontSize="20" fontFamily="Inter">
      News with images · Fully automated with n8n
    </text>
    <path d="M180 320 H400" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" />
    <path d="M520 320 H720" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" />
    <path d="M840 320 H1040" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" />
    <path d="M1160 320 H1300" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" />
    <path d="M520 320 V460 H840" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" />
    <path d="M1040 320 V460 H1300" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round" />
    <g filter="url(#shadow)">
      <rect
        x="60"
        y="260"
        width="200"
        height="120"
        rx="24"
        fill="#111827"
        stroke="#4B5563"
        strokeWidth="2"
      />
      <text x="100" y="320" fill="#F9FAFB" fontSize="20" fontFamily="Inter" fontWeight={600}>
        Schedule
      </text>
      <text x="100" y="350" fill="#9CA3AF" fontSize="16" fontFamily="Inter">
        Trigger
      </text>
    </g>
    <g filter="url(#shadow)">
      <rect
        x="280"
        y="240"
        width="220"
        height="160"
        rx="24"
        fill="#111827"
        stroke="#4B5563"
        strokeWidth="2"
      />
      <text x="330" y="305" fill="#F9FAFB" fontSize="20" fontFamily="Inter" fontWeight={600}>
        Research Agent
      </text>
      <text x="330" y="335" fill="#9CA3AF" fontSize="16" fontFamily="Inter">
        Gemini · Perplexity
      </text>
    </g>
    <g filter="url(#shadow)">
      <rect
        x="520"
        y="260"
        width="200"
        height="120"
        rx="24"
        fill="#111827"
        stroke="#4B5563"
        strokeWidth="2"
      />
      <text x="560" y="320" fill="#F9FAFB" fontSize="20" fontFamily="Inter" fontWeight={600}>
        Parse &amp; Split
      </text>
      <text x="560" y="350" fill="#9CA3AF" fontSize="16" fontFamily="Inter">
        News Items
      </text>
    </g>
    <g filter="url(#shadow)">
      <rect
        x="760"
        y="260"
        width="220"
        height="120"
        rx="24"
        fill="#111827"
        stroke="#4B5563"
        strokeWidth="2"
      />
      <text x="810" y="320" fill="#F9FAFB" fontSize="20" fontFamily="Inter" fontWeight={600}>
        Image Pipeline
      </text>
      <text x="810" y="350" fill="#9CA3AF" fontSize="16" fontFamily="Inter">
        SerpAPI · Pick best
      </text>
    </g>
    <g filter="url(#shadow)">
      <rect
        x="1040"
        y="260"
        width="220"
        height="120"
        rx="24"
        fill="#111827"
        stroke="#4B5563"
        strokeWidth="2"
      />
      <text x="1085" y="320" fill="#F9FAFB" fontSize="20" fontFamily="Inter" fontWeight={600}>
        Generate HTML
      </text>
      <text x="1085" y="350" fill="#9CA3AF" fontSize="16" fontFamily="Inter">
        Merge &amp; aggregate
      </text>
    </g>
    <g filter="url(#shadow)">
      <rect x="1280" y="260" width="120" height="120" rx="24" fill="url(#cardGradient)" />
      <text x="1310" y="320" fill="#FDF2F8" fontSize="20" fontFamily="Inter" fontWeight={600}>
        Gmail
      </text>
      <text x="1310" y="350" fill="#E0E7FF" fontSize="16" fontFamily="Inter">
        Send
      </text>
    </g>
    <g filter="url(#shadow)">
      <rect
        x="640"
        y="440"
        width="360"
        height="120"
        rx="24"
        fill="#111827"
        stroke="#4B5563"
        strokeWidth="2"
      />
      <text x="700" y="500" fill="#F9FAFB" fontSize="20" fontFamily="Inter" fontWeight={600}>
        n8n orchestrates everything
      </text>
      <text x="700" y="530" fill="#9CA3AF" fontSize="16" fontFamily="Inter">
        From research to Gmail delivery
      </text>
    </g>
  </svg>
)

export default N8nWorkflowGraphic














