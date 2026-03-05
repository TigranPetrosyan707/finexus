import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useAuth } from '../context/AuthContext';

export default function AuthSync() {
  const { props } = usePage();
  const { setAuthFromServer } = useAuth();

  useEffect(() => {
    setAuthFromServer(props.auth ?? null);
  }, [props.auth, setAuthFromServer]);

  return null;
}
