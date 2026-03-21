import clsx from 'clsx';

const Price = ({
  amount,
  originalAmount,
  className,
  currencyCode = 'PEN',
  currencyCodeClassName
}: {
  amount: string;
  originalAmount?: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<'p'>) => (
  <p suppressHydrationWarning={true} className={className}>
    {originalAmount && parseFloat(originalAmount) > parseFloat(amount) ? (
      <span className="mr-2 text-current/70 line-through">
        {`${new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currencyCode,
          currencyDisplay: 'narrowSymbol'
        }).format(parseFloat(originalAmount))}`}
      </span>
    ) : null}
    {`${new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol'
    }).format(parseFloat(amount))}`}
    <span className={clsx('ml-1 inline', currencyCodeClassName)}>{`${currencyCode}`}</span>
  </p>
);

export default Price;
