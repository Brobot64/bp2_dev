export interface Package {
    id: number;
    name: string;
    price: number;
    features: string[];
  }
  
  export interface User {
    id: number;
    email: string;
    payment_method: string;
    package_id: number;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
  }
  
  export interface Payment {
    id?: number;
    user_id: number;
    package_id: number;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    stripe_payment_id?: string;
    payment_type: string;
    paid_at?: Date;
  }