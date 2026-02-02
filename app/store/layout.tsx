import Footer from 'components/layout/footer';
import Collections from 'components/layout/search/collections';
import FilterList from 'components/layout/search/filter';
import { sorting } from 'lib/constants';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-8 px-4 py-6 text-black dark:text-white">
        {/* Filters + Content */}
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="order-first w-full flex-none md:max-w-[125px]">
            <Collections />
          </div>
          <div className="order-last min-h-screen w-full md:order-none">
            {children}
          </div>
          <div className="order-none flex-none md:order-last md:w-[125px]">
            <FilterList list={sorting} title="Ordenar" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
