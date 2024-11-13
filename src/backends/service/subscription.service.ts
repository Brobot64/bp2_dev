import StripeConfig from '../config/stripe';
import { query } from '../config/db'
import { Package, User, Payment } from '../types/sub.types';

class SubscriptionService {
  private stripe = StripeConfig.getInstance();

  async createStripeCustomer(user: User): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: user.email
    });

    // Update user with Stripe customer ID
    // await query({
    //     query: "CREATE TABLE IF NOT EXISTS email_templates (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, content TEXT)",
    //     values: []
    //   });
    await query({
      query: 'UPDATE users SET stripe_customer_id = ? WHERE id = ?',
    //   @ts-ignore
      values: [customer.id, user.id]
  });

    return customer.id;
  }

  async createSubscription(
    user: User, 
    packageDetails: Package, 
    paymentMethodId: string
  ): Promise<string> {
    // Ensure user has a Stripe customer ID
    const customerId = user.stripe_customer_id || 
      await this.createStripeCustomer(user);

    // Attach payment method
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });

    // Create subscription
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price_data: {
          currency: 'gbp',
          unit_amount: Math.round(packageDetails.price * 100),
        //   @ts-ignore
          product_data: { name: packageDetails.name },
          recurring: { interval: 'month' }
        }
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { 
        payment_method_types: ['card'] 
      }
    });

    // Update user with subscription details
    await query({
      query: 'UPDATE users SET stripe_subscription_id = ?, package_id = ? WHERE id = ?',
    //   @ts-ignore
      values: [subscription.id, packageDetails.id, user.id]
  });

    // Create payment record
    await this.createPaymentRecord({
      user_id: user.id,
      package_id: packageDetails.id,
      amount: packageDetails.price,
      currency: 'gbp',
      status: 'pending',
      stripe_payment_id: subscription.id,
      payment_type: 'subscription'
    });

    return subscription.id;
  }

  async changeSubscription(
    user: User, 
    currentPackage: Package, 
    newPackage: Package
  ): Promise<void> {
    const priceDifference = newPackage.price - currentPackage.price;

    if (priceDifference > 0) {
      // Upgrade: Charge the difference
      await this.stripe.invoiceItems.create({
        // @ts-ignore
        customer: user.stripe_customer_id,
        amount: Math.round(priceDifference * 100),
        currency: 'gbp',
        description: 'Prorated package upgrade'
      });
    }

    // Modify subscription
    await this.stripe.subscriptions.update(
        // @ts-ignore
      user.stripe_subscription_id,
      {
        items: [{
          price_data: {
            currency: 'gbp',
            unit_amount: Math.round(newPackage.price * 100),
            product_data: { name: newPackage.name },
            recurring: { interval: 'month' }
          }
        }]
      }
    );

    // Update user's package
    await query({
      query:'UPDATE users SET package_id = ? WHERE id = ?',
    //   @ts-ignore
      values: [newPackage.id, user.id]
  });

    // Create payment record for upgrade
    await this.createPaymentRecord({
      user_id: user.id,
      package_id: newPackage.id,
      amount: priceDifference > 0 ? priceDifference : newPackage.price,
      currency: 'gbp',
      status: 'pending',
      payment_type: priceDifference > 0 ? 'upgrade' : 'subscription'
    });
  }

  async cancelSubscription(user: User): Promise<void> {
    // Cancel Stripe subscription
    // @ts-ignore
    await this.stripe.subscriptions.cancel(user.stripe_subscription_id);

    // Update user
    await query({
      query: 'UPDATE users SET stripe_subscription_id = NULL, package_id = NULL WHERE id = ?',
    //   @ts-ignore
      values: [user.id]
  });

    // Create cancellation payment record
    await this.createPaymentRecord({
      user_id: user.id,
    //   @ts-ignore
      package_id: null,
      amount: 0,
      currency: 'gbp',
      status: 'completed',
      payment_type: 'cancellation'
    });
  }

  private async createPaymentRecord(paymentData: Payment): Promise<void> {
    await query({
      query: `INSERT INTO payments 
      (user_id, package_id, amount, currency, status, 
       stripe_payment_id, payment_type , paid_at, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
    //   @ts-ignore
      values: [paymentData.user_id, paymentData.package_id, paymentData.amount, paymentData.currency, paymentData.status, paymentData.stripe_payment_id, paymentData.payment_type
      ]
  });
  }
}

export default new SubscriptionService();