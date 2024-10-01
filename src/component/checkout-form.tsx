import { PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { FaCircleCheck } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

export default function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
      redirect: 'if_required',
    });

    console.log({
      error,
      paymentIntent,
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message as string);
      } else {
        setMessage('An unexpected error occured.');
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment succeeded!');

      // redirect to completion page
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } else {
      setMessage('An unexpected error occured.');
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {message === 'Payment succeeded!' ? (
        <>
          <div className="text-center mb-4">
            <FaCircleCheck className="text-4xl text-green-500 mx-auto" />
          </div>

          <div id="payment-message">{message}</div>
        </>
      ) : (
        <>
          <PaymentElement id="payment-element" />
          <button
            disabled={isProcessing || !stripe || !elements}
            id="submit"
            className="text-center w-full mt-5"
          >
            <span id="button-text" className="text-base font-bold">
              [ {isProcessing ? 'processing... ' : 'pay now'} ]
            </span>
          </button>
          {message && <div id="payment-message">{message}</div>}
        </>
      )}
    </form>
  );
}
