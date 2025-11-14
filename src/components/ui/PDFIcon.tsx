import React from 'react';

interface PdfBadgeIconProps {
    className?: string;
    size?: number;
}

const PdfBadgeIcon: React.FC<PdfBadgeIconProps> = ({
                                                       className = "h-5 w-5",
                                                       size
                                                   }) => {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M14 2v6h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <text
                x="7"
                y="17"
                fontFamily="Arial, sans-serif"
                fontSize="6"
                fontWeight="bold"
                fill="currentColor"
            >
                PDF
            </text>
        </svg>
    );
};

export default PdfBadgeIcon;