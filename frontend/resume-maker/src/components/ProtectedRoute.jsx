import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    
    // If still loading, you could show a loading spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
            </div>
        );
    }
    
    // If not authenticated, redirect to landing page
    if (!user) {
        console.log('User not authenticated, redirecting to landing page');
        return <Navigate to="/" replace />;
    }
    
    // If authenticated, render the children components
    return children;
};

export default ProtectedRoute;