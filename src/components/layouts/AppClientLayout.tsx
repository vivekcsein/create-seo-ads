"use client";

import Footer from "./Footer";
import Header from "./Header";

interface AppClientLayoutProps {
  children: React.ReactNode;
}
const AppClientLayout = ({ children }: AppClientLayoutProps) => {
  return (
    <>
      <Header />
      <main className="global-blogs-layout min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default AppClientLayout;
