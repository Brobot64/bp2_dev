import { responseHandler } from "@/src/backends/utils/responseHandler";
import { stripe } from "@/src/backends/utils/stripe";


export const POST = async (request: Request) => {
    try {
        const { name, description, unit_amount, currency, interval } = await request.json();

        if (!name || !unit_amount || !currency || !interval) {
            return responseHandler({ error: 'Missing required fields' }, 400);
        }

        const product = await stripe.products.create({
            name, description
        });

        // create price
        const price = await stripe.prices.create({
            unit_amount,
            currency,
            recurring: { interval },
            product: product.id,
        })  
        return responseHandler({product, price}, 201);
    } catch (error: any) {
        return responseHandler(error?.message, 500);
    }
}


export const GET = async (request: Request) => {
    try {
        const products = await stripe.products.list({ active: true });
        const prices = await stripe.prices.list({ active: true });
        return responseHandler({ products, prices }, 200);
    } catch (error: any) {
        return responseHandler(error?.message, 500);
    }
}