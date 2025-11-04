import logo from 'figma:asset/e251b5c18758a36c694bcd1e83413a4344519727.png';

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="animate-fade-in text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Megapro Innovation" className="h-16" />
        </div>
        
        {/* Company Name */}
        <h1 className="text-white mb-2">Megapro Innovation</h1>
        
        {/* Tagline */}
        <p className="text-white text-opacity-90">Sales Force Automation</p>
        
        {/* Loading indicator */}
        <div className="mt-8 flex justify-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
