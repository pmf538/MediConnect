import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        <h2 className="text-3xl font-bold text-slate-800 mt-4">Page Not Found</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="mt-8">
          <Link 
            to="/" 
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <HomeIcon size={18} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;