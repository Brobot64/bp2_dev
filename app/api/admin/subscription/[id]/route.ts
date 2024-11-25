import { responseHandler } from "@/src/backends/utils/responseHandler";
import { stripe } from "@/src/backends/utils/stripe";

export const PUT = async (
    request: Request,
    { params }: { params: { id: string } },
) => {
    try {
        const {name, description, oldPriceId, newUnitAmount, newCurrency, newInterval } = await request.json();

        if (!params.id) {
            return responseHandler({ error: 'Product ID is required' }, 400);
        }

        const updatedProduct = await stripe.products.update(params.id, {
            name,
            description,
          });
      
          // Step 2: If price needs to be updated, deactivate the old price and create a new one
          let newPrice;
          if (oldPriceId && newUnitAmount && newCurrency && newInterval) {
            // Deactivate the old price
            await stripe.prices.update(oldPriceId, { active: false });
      
            // Create a new price
            newPrice = await stripe.prices.create({
              unit_amount: newUnitAmount, // Amount in smallest currency unit (e.g., cents)
              currency: newCurrency,
              recurring: { interval: newInterval },
              product: params.id,
            });
        }

        return responseHandler({updatedProduct, newPrice}, 200);

    } catch (error: any) {
        console.error('Error updating product and price:', error.message);
        return responseHandler(error?.message, 500);
        
    }
}

export const DELETE = async (
    request: Request,
    { params }: { params: { id: string } },
) => {
    try {
        if (!params.id) {
            return responseHandler({ error: 'Product ID is required' }, 400);
        }

        const deletedProduct = await stripe.products.update(params.id, { active: false });

        return responseHandler(deletedProduct, 200)

    } catch (error: any) {
        return responseHandler(error?.message, 500);
    }
}