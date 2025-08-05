"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const ProtectedRoute = ({children}) => {
    const router = useRouter();
    const isAuthenticated = useSelector(state => state.auth.isLogedin);
    const [checkedAuth, setCheckedAuth] = useState(false);

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        setCheckedAuth(true);
      }
    }, [isAuthenticated, router]);
  
    if (!checkedAuth) {
      return null;
    }
  
    return children;
}

export default ProtectedRoute