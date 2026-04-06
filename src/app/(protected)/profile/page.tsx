import { ProfilePage } from "@/components/pages/Profile";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default function Profile() {
  return <ProfilePage />;
}
