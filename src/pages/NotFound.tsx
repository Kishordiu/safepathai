import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Home } from "lucide-react";
import { BubbleButton } from "@/components/safepath/BubbleButton";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-hero">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 animate-float">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-xl font-semibold mb-2">Page Not Found</p>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex justify-center gap-3">
          <Link to="/"><BubbleButton><Home className="w-4 h-4" /> Go Home</BubbleButton></Link>
          <Link to="/dashboard"><BubbleButton variant="outline"><ArrowLeft className="w-4 h-4" /> Dashboard</BubbleButton></Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
