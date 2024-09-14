'use client';
import { useEffect, useState } from 'react';

import { Elements } from '@stripe/react-stripe-js';
// import CheckoutForm from "./CheckoutForm";
import { Appearance, loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import CheckoutForm from '@/src/component/checkout-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';

const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`
);

const appearance: Appearance = {
  theme: 'night',
};

function SharePaymentPaged() {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const params = useParams<{ uuid: string }>();
  const uuid = params?.uuid;

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment`,
          {
            user_id: uuid,
          }
        );

        if (!data.success) {
          setError(data.message);
          return;
        }

        const { client_secret } = data;
        setClientSecret(client_secret);
      } catch (error: any) {
        setError(error.response.data.message);
      }
    };

    fetchClientSecret();
  }, []);

  return (
    <>
      <div className="popup-container black">
        <div className="popup default !h-fit black">
          <div className="desc">
            {clientSecret && stripePromise ? (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance }}
              >
                <CheckoutForm />
              </Elements>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SharePaymentPaged;
