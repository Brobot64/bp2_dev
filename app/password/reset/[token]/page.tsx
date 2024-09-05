'use client';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import style from './page.module.css';
import axios, { AxiosError } from "axios";

const Page = () => {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params?.token;

  const [status, setStatus] = useState<string>('Please enter your new password');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#000000';

    const validateToken = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/validate-reset-token`, { token });
        if (response.status !== 200) {
          setError('Invalid or expired token.');
          setStatus('Redirecting...');
          setTimeout(() => {
            router.push('/');
          }, 2000);
        }
      } catch (err) {
        setError('Invalid or expired token.');
        setStatus('Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    };

    validateToken();

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    if (!newPassword) {
      setError('Password is required');
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/change-password`, { token, password: newPassword });
  
      if (response.status === 200) {
        setSuccess('Password changed successfully');
        setStatus('Redirecting...');
        setTimeout(() => router.push('/'), 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        if (errorData && errorData.errors && errorData.errors.password) {
          setError(errorData.errors.password.join(', '));
        } else {
          setError('An error occurred while changing the password');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
 

  return (
    <section className={style.activationPage}>
      <div className={style.pageContainer}>
        <div className={style.wrapper}>
          <h2>Reset Your Password</h2>
          <form onSubmit={handleSubmit} className={style.passwordForm}>
            <div className={style.frmGrp}>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='New Password'
                required
              />
            </div>
            <div className={style.frmGrp}>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                placeholder='Confirm Password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className={style.error}>{error}</p>}
            {success && <p className={style.success}>{success}</p>}
            <div className={style.frmGrp}>
              <button type="submit" className={style.submit}>[Change Password]</button>
            </div>
          </form>
          <p>{status}</p>
        </div>
      </div>
    </section>
  );
};

export default Page;
