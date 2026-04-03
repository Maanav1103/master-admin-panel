"use client";
import { ReactNode } from "react";
import BackButton from "./BackButton";

interface BreadcrumbProps {
  pageName: string;
  isShowBackButton?: boolean; // Optional back button text
  onBack?: () => void; // Optional custom back handler
  breadcrumbTrail?: ReactNode; // Optional custom breadcrumb trail
  previousPage?: string;
  lastButton?: any;
}

const Breadcrumb = ({
  pageName,
  isShowBackButton = false,
  previousPage = "",
  // isShowLastButton,
  lastButton,
}: BreadcrumbProps) => {
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {isShowBackButton && <BackButton previousPage={previousPage} />}
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          {pageName}
        </h2>
      </div>

      {lastButton && <div>{lastButton}</div>}
      {/* <nav>
        <ol className="flex items-center gap-2 text-sm text-primary">
          {breadcrumbTrail || (
            <>
              <li>
                <Link className="font-medium text-primary" href="/user">
                  users /
                </Link>
                <Link className="font-medium text-primary" href="#">
                  user view /
                </Link>
              </li>
              <li className="font-medium text-primary">{pageName}</li>
            </>
          )}
        </ol>
      </nav> */}
    </div>
  );
};

export default Breadcrumb;
