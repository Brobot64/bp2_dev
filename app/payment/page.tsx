import SharePaymentPaged from '@shared/payment';
import React, { Suspense } from 'react';

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="">Loading...</div>}>
      <SharePaymentPaged />
    </Suspense>
  );
}
