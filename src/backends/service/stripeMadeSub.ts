import { stripe } from '../utils/stripe';



export const createStripePlan = async (data: any) => {
    const { name, description, unit_amount, currency, interval } = data;
    try {
        // Create a Product
        const product = await stripe.products.create({
          name,
          description,
        });
    
        // Create a Price
        const price = await stripe.prices.create({
          unit_amount, // in smallest currency unit (e.g., cents)
          currency,
          recurring: { interval },
          product: product.id,
        });
    
        return { product, price };
      } catch (error: any) {
        console.error(error.message);
        return { error: error.message };
      }
}
