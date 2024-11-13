import Stripe from 'stripe';

class StripeConfig {
  private static instance: Stripe;

  private constructor() {}

  public static getInstance(): Stripe {
    if (!this.instance) {
      this.instance = new Stripe('pk_test_51Pw4HYFuNyy45OgnjqTfciuQZl0iaxrcl7XG9shsEMMRQOLsuyqzNer3WBtoHcMAUIBOrQtWWf8QkqJjPvsgSmr500b2wUqOGv', {
        // @ts-ignore
        apiVersion: '2023-08-16'
      });
    }
    return this.instance;
  }
}

export default StripeConfig;