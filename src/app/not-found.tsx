import Link from "next/link";
import { routes } from "@/constants/routes";
import { GoBackButton } from "./GoBackButton";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4">
      <div className="text-center max-w-lg w-full">

        {/* Big 404 */}
        <div className="relative select-none mb-6">
          <p className="text-[160px] font-black leading-none text-gray-100 tracking-tighter">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-sm px-6 py-3">
              <p className="text-lg font-bold text-gray-800">Page Not Found</p>
            </div>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="100" height="60" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
            <rect x="10" y="10" width="100" height="18" rx="6" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2"/>
            <circle cx="24" cy="19" r="3" fill="#FCA5A5"/>
            <circle cx="36" cy="19" r="3" fill="#FDE68A"/>
            <circle cx="48" cy="19" r="3" fill="#6EE7B7"/>
            <rect x="22" y="38" width="40" height="4" rx="2" fill="#E5E7EB"/>
            <rect x="22" y="48" width="60" height="4" rx="2" fill="#E5E7EB"/>
            <rect x="22" y="58" width="30" height="4" rx="2" fill="#E5E7EB"/>
            <circle cx="90" cy="52" r="14" fill="#EDE9FE"/>
            <path d="M86 52h8M90 48v8" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Message */}
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Link
            href={routes.dashboard}
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors"
          >
            Back to Dashboard
          </Link>
          <GoBackButton />
        </div>

      </div>
    </div>
  );
}
