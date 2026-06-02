import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center neon-glow">
                <span className="text-primary-foreground font-bold font-orbitron">N</span>
              </div>
              <span className="font-orbitron font-bold text-xl tracking-wider text-white">Nirpesh AI</span>
            </div>
            <p className="text-gray-500 max-w-sm">
              The most advanced artificial intelligence platform, designed to solve the unsolvable.
            </p>
          </div>
          
          <div>
            <h4 className="font-orbitron text-white mb-6 font-bold">Platform</h4>
            <ul className="space-y-4 text-gray-500">
              <li><Link to="/features" className="hover:text-cyan-400 transition-colors">Features</Link></li>
              <li><Link to="/technology" className="hover:text-cyan-400 transition-colors">Technology</Link></li>
              <li><Link to="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-orbitron text-white mb-6 font-bold">Company</h4>
            <ul className="space-y-4 text-gray-500">
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Nirpesh AI Systems. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-cyan-400">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
