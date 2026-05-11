import type { Metadata } from "next";
import UserProfile from "../components/UserProfile";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your ShopNext profile",
};

export default function ProfilePage() {
  return <UserProfile />;
}
