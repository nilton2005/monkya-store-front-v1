export default function ProductImage({ 
  alt, 
  className = "" 
}: { 
  alt: string; 
  className?: string; 
}) {
  return (
    <div 
      className={`bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center ${className}`}
      style={{ aspectRatio: '1 / 1' }}
    >
      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {alt}
      </span>
    </div>
  );
}