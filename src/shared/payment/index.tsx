'use client';
import { useEffect, useState } from 'react';

import { Elements } from '@stripe/react-stripe-js';
// import CheckoutForm from "./CheckoutForm";
import { Appearance, loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import CheckoutForm from '@/src/component/checkout-form';
import { useRouter, useSearchParams } from 'next/navigation';

const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`
);

const appearance: Appearance = {
  theme: 'night',
};

function SharePaymentPaged() {
  const [clientSecret, setClientSecret] = useState('');
  const query = useSearchParams();

  const amouunt = query.get('amount');

  useEffect(() => {
    const fetchClientSecret = async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment`,
        {
          amount: 100,
        }
      );
      const { client_secret } = response.data;
      setClientSecret(client_secret);
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
