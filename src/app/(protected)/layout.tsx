import PrivateGuard from "@/components/guards/PrivateGuard";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <PrivateGuard>{children}</PrivateGuard>;
}
