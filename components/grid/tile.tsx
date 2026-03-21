import clsx from 'clsx';
import ProductImageFallback from '../product-image-fallback';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    originalAmount?: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof ProductImageFallback>) {
  const activeStyle = active ? { borderColor: '#f2cd4e', borderWidth: '2px' } : {};

  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white dark:bg-black [&:hover]:border-[#f2cd4e]',
        {
          relative: label,
          'border-neutral-200 dark:border-neutral-800': !active
        }
      )}
      style={activeStyle}
    >
      {props.src ? (
        <ProductImageFallback
          className={clsx('relative h-full w-full object-contain', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          originalAmount={label.originalAmount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
