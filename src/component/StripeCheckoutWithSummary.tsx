import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Appearance, loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import CheckoutForm from '@/src/component/checkout-form';

interface StripeCheckoutWithSummaryProps {
  packageName: string;
  amount: number;
  userId: string;
}

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`);

const appearance: Appearance = {
  theme: 'night',
};

const StripeCheckoutWithSummary: React.FC<StripeCheckoutWithSummaryProps> = ({ packageName, amount, userId }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment`,
          {
            user_id: userId,
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
  }, [userId]);

  return (
    <>
        <div className="flex flex-col gap-3">
            <h2>Payment Summary</h2>
        <div className='flex gap-4 w-full justify-center'>
            <p className='text-lg !m-0'><b>Package:</b>&nbsp; {packageName}</p>
            <p className='text-lg !m-0'><b>Amount:</b>&nbsp; € &nbsp;{amount}</p>
        </div>
        <div className="popup default !h-fit black" style={{ width: '100%' }}>
            <div className="desc " style={{ paddingTop: '10px', paddingBottom: '10px' }}>
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
};

export default StripeCheckoutWithSummary; 