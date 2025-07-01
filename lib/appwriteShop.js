import { databases,config, functions } from './appwrite';

export async function loadShopItems() {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.shopCollectionId
        );
        return response.documents;
    } catch (error) {
        console.error("❌Error", error.message);
    }
}

export async function useActionCode(actionCodeID){
    try {
        const response = await databases.getDocument(
            config.databaseId,
            config.aktionsCodesCollectionId,
            actionCodeID
        );
        return response;
    } catch (error) {
        return null;
    }
}

export async function stripeFunction({price=1099}) {
    console.log("Price", price)
  try {
    
    const res = await functions.createExecution('684cfd47003509ae622e', JSON.stringify({
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Max Mustermann'
        },
        amount: price, // Cent-Betrag, z.B. 10,99 EUR
        currency: 'eur',
      }));
      console.log("Res of the new Function", res)

    return res;
  } catch (error) {
    console.log("Function error:", error);
  }
}

export async function stripeFunctionWeb({ 
  price = 1099, 
  successUrl= 'https://qready-app.com/shop', 
  failureUrl= 'https://qready-app.com/shop',
  productID= 'product-123',
  userID = 'user-123',
  amount = 1,
  currency = 'eur'

 }) {
  console.log("Price", price);
  try {
    const res = await functions.createExecution('6853b428000b446fadbd', JSON.stringify({
      path:'/checkout',
      price:price,
      amount: amount,
      currency: currency,
      successUrl:successUrl,
      failureUrl:failureUrl,
      userID:userID,
      productID :productID,
    }));
    console.log("Res of the new Function", res);
    return res; 
  } catch (error) {
    console.log("Function error:", error);
  }
}