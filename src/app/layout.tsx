import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./components/AuthProvider";
import QueryProvider from "./components/QueryProvider";
import { CartProvider } from "./context/CartContext";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: {
    default: "ShopNext",
    template: "%s | ShopNext",
  },
  description:
    "Next.js e-commerce with App Router, Server Components & dynamic routing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <body className="bg-surface text-gray-900 font-sora min-h-screen flex flex-col">
        <AuthProvider>
          <QueryProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
