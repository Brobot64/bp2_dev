'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import style from './page.module.css';

const Page = () => {
  const router = useRouter();

  const params = useParams<{ token: string }>();
  const token = params?.token;
  const [status, setStatus] = useState<string>('Activating your account...');
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      axios.get<{ message: string }>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/activate-account/${token}`, {})
        .then(response => {
          setStatus(response.data.message);
        })
        .catch(error => {
          setStatus('Failed to activate your account. Please try again later.');
        });
    }
  }, [token]);

  return (
    <section className={style.activationPage}>
      <div className={style.pageContainer}>
        <div className={style.cardContainer}>
          <p>{status}</p>
        </div>
      </div>
    </section>
  );
};

export default Page;
