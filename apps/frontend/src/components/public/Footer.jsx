// Footer.jsx

import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  ArrowUp,
  Zap,
  MapPin,
} from "lucide-react";
import { HashLink } from "react-router-hash-link";

const Footer = () => {
  const PRIMARY_COLOR = "text-blue-400";
  const DARK_BG = "bg-[#0b173e]";
  const ACCENT_COLOR_BG = "bg-blue-600";
  const ACCENT_COLOR_HOVER = "hover:bg-blue-700";

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`${DARK_BG} text-blue-200 pt-16 pb-8 font-sans`}>
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* ===== Logo & Disclosure ===== */}
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-3xl font-extrabold text-white flex items-center">
            Finova <Zap className="w-6 h-6 ml-2 text-yellow-400" />
          </h2>
          <p className="text-sm leading-relaxed">
            Investing in a brighter future, with purpose. Providing tailored
            financial solutions for MSMEs across various industries.
          </p>

          <div className="pt-4">
            <h4 className="text-sm font-semibold text-white mb-2">Follow Us</h4>
            <div className="flex space-x-3">
              <HashLink
                to="www.facebook.com"
                className={`${ACCENT_COLOR_BG} p-2 rounded-full text-white ${ACCENT_COLOR_HOVER} transition`}
              >
                <Facebook className="w-5 h-5" />
              </HashLink>
              <HashLink
                to="www.twitter.com"
                className={`${ACCENT_COLOR_BG} p-2 rounded-full text-white ${ACCENT_COLOR_HOVER} transition`}
              >
                <Twitter className="w-5 h-5" />
              </HashLink>
              <HashLink
                to="https://www.instagram.com/"
                className={`${ACCENT_COLOR_BG} p-2 rounded-full text-white ${ACCENT_COLOR_HOVER} transition`}
              >
                <Linkedin className="w-5 h-5" />
              </HashLink>
            </div>
          </div>
        </div>

        {/* ===== Quick Links ===== */}
        <div className="grid grid-cols-2 gap-8 md:col-span-2">
          <div>
            <h3 className="text-white font-bold text-lg mb-4 border-b-2 border-blue-600 inline-block pb-1">
              Company
            </h3>
            <ul className="mt-2 space-y-3 text-sm">
              <li>
                <HashLink
                  to="/#home"
                  className={`hover:${PRIMARY_COLOR} transition`}
                >
                  Home
                </HashLink>
              </li>
              <li>
                <HashLink
                  to="/about-us/#about"
                  className={`hover:${PRIMARY_COLOR} transition`}
                >
                  About Us
                </HashLink>
              </li>
              <li>
                <HashLink
                  to="/board-of-directors/#board-of-directors"
                  className={`hover:${PRIMARY_COLOR} transition`}
                >
                  Board Of Directors
                </HashLink>
              </li>
              <li>
                <HashLink
                  to="/news-and-media/#news-and-media"
                  className={`hover:${PRIMARY_COLOR} transition`}
                >
                  News & Media
                </HashLink>
              </li>
              <li>
                <HashLink
                  to="/opportunity/#opportunity"
                  className={`hover:${PRIMARY_COLOR} transition`}
                >
                  opportunity
                </HashLink>
              </li>
              <li>
                <HashLink
                  to="/contact/#contact"
                  className={`hover:${PRIMARY_COLOR} transition`}
                >
                  Contact Us
                </HashLink>
              </li>
            </ul>
          </div>

          {/* ===== Products & Support ===== */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 border-b-2 border-blue-600 inline-block pb-1">
              Products & Support
            </h3>
            <ul className="mt-2 space-y-3 text-sm">
              <li>
                <HashLink
                  to="/products"
                  className={`hover:${PRIMARY_COLOR} transition`}
                >
                  MSME Business Loan
                </HashLink>
              </li>
              <li>
                <HashLink
                  to="/products"
                  className={`hover:${PRIMARY_COLOR} transition`}
                >
                  Home Loan
                </HashLink>
              </li>
              <li>
                <HashLink
                  to="/products"
                  className={`hover:${PRIMARY_COLOR} transition`}
                >
                  Personal Loan
                </HashLink>
              </li>
              <li>
                <a href="#" className={`hover:${PRIMARY_COLOR} transition`}>
                  Pay EMI Online
                </a>
              </li>
              <li>
                <a href="#" className={`hover:${PRIMARY_COLOR} transition`}>
                  Grievance Redressal
                </a>
              </li>
              <li>
                <a href="#" className={`hover:${PRIMARY_COLOR} transition`}>
                  Branch Locator
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== Legal & Contact ===== */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4 border-b-2 border-blue-600 inline-block pb-1">
            Legal & Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <HashLink
                to="/policies"
                className={`hover:${PRIMARY_COLOR} transition`}
              >
                Blog
              </HashLink>
            </li>
            <li>
              <HashLink
                to="/policies"
                className={`hover:${PRIMARY_COLOR} transition`}
              >
                Privacy Policy
              </HashLink>
            </li>
            <li>
              <HashLink
                to="/sarfaesi"
                className={`hover:${PRIMARY_COLOR} transition`}
              >
                SARFAESI
              </HashLink>
            </li>
            <li>
              <HashLink
                to="/policies-and-codes"
                className={`hover:${PRIMARY_COLOR} transition`}
              >
                Policies & Codes
              </HashLink>
            </li>
            <li>
              <a href="#" className={`hover:${PRIMARY_COLOR} transition`}>
                Schedule of Charges
              </a>
            </li>
            <li>
              <a href="#" className={`hover:${PRIMARY_COLOR} transition`}>
                Interest Rate Policy
              </a>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-blue-700">
            <p className="text-sm font-semibold text-white flex items-start mb-2">
              <MapPin className="w-4 h-4 mr-2 mt-[2px] text-yellow-400 flex-shrink-0" />
              Head Office
            </p>
            <p className="text-sm pl-6">
              4th Floor, Unique Aspire Amrapali Marg, Vaishali Nagar, Jaipur,
              Rajasthan – 302021
            </p>
          </div>
        </div>
      </div>

      {/* ===== Copyright ===== */}
      <div className="border-t border-blue-800 mt-12 pt-8 text-xs text-center text-blue-300 px-6">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} Finova Capital. All rights reserved.
        </p>
        <p className="max-w-4xl mx-auto leading-relaxed text-blue-400/80">
          **RBI Disclosure:** The company is having a valid Certificate of
          Registration dated 02.03.2016 issued by the Reserve Bank of India
          ("RBI")...
        </p>
      </div>

      {/* ===== Back to Top ===== */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={handleScrollToTop}
          className={`${ACCENT_COLOR_BG} p-3 rounded-full text-white ${ACCENT_COLOR_HOVER} transition shadow-xl`}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
