interface LoadingSpinnerProps {
    fullScreen?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    className?: string;
}

export const LoadingSpinner = ({
                                   fullScreen = false,
                                   size = 'lg',
                                   text,
                                   className = ''
                               }: LoadingSpinnerProps) => {

    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-[3px]',
        lg: 'h-12 w-12 border-4',
        xl: 'h-16 w-16 border-4'
    };

    const spinnerContent = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`
                    animate-spin rounded-full 
                    border-gray-200 border-t-[#027BFF] 
                    ${sizeClasses[size]}
                `}
            />
            {text && (
                <p className="text-gray-500 font-medium text-sm animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {spinnerContent}
            </div>
        );
    }

    return (
        <div className={`flex justify-center items-center ${className}`}>
            {spinnerContent}
        </div>
    );
};