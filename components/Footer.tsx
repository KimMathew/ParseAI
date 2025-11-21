import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-linear-to-b from-[#0B0C10] to-[#000000] py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/parseai-logo.png"
                alt="PARSe AI Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-bold text-lg">PARSeAI</span>
            </div>
            <p className="text-white/50 text-sm">
              Instantly understand research papers with AI-powered summaries.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/50 text-sm">
              © 2025 PARSe AI. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-6 mt-6 md:mt-0">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <span className="text-sm font-medium">Twitter</span>
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <span className="text-sm font-medium">GitHub</span>
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
