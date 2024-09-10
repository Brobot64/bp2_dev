'use Client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/context/AuthProvider';

const withAuth = (WrappedComponent: React.FC, allowedRoles: number[]) => {
  const WithAuthComponent: React.FC = (props) => {
    const { loggedUser, token, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (
          !token ||
          (loggedUser && !allowedRoles.includes(loggedUser.role_id))
        ) {
          router.replace('/');
        }
      }
    }, [loggedUser, token, router, loading, allowedRoles]);

    if (
      loading ||
      !token ||
      (loggedUser && !allowedRoles.includes(loggedUser.role_id))
    ) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
