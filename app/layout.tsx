"use client";
import "@/app/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThirdwebProvider } from "thirdweb/react"; // v5`
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider>
          <main className="flex relative h-full w-full flex-col items-center">
            <Navbar />
            <section className="mb-10 z-10 flex flex-1 w-full px-6 flex-col items-center">
              <div className="flex flex-row w-full justify-center items-center">
                <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-10 text-center text-black">
                  <span className="bg-title max-w-max px-1.5">Marketplace</span>
                </h1>
              </div>
              <TooltipProvider>{children}</TooltipProvider>
              <ToastContainer />
            </section>
            <Footer />
          </main>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
