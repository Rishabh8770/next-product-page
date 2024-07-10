import Link from "next/link";

const PageHeader = () => {
  return (
    <nav className="bg-slate-200 p-4 min-w-full">
      <div className="mx-auto px-2 lg:px-2">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <Link href="/">Product-page</Link>
            </div>
            <div className="sm:block ml-6 lg:ml-6">
              <div className="flex space-x-4">
                <Link href="/" passHref>
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PageHeader;
