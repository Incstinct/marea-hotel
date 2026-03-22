import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Marea — Beachside Resort",
  description: "A warm beachside resort where every moment feels like home.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#faf7f2]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}