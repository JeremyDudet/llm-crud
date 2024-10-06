import { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Stripe } from "@stripe/stripe-js";
import apiClient from "@/api/apiClient";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const App = () => {
  const [error, setError] = useState<string | null>(null);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      setError("Stripe publishable key is missing");
      return;
    }
    setStripePromise(loadStripe(publishableKey));
  }, []);

  const fetchClientSecret = useCallback(() => {
    console.log("Fetching client secret..."); // Add this line
    return apiClient
      .post("/create-checkout-session")
      .then((response) => {
        console.log("Checkout session response:", response.data);
        return response.data.clientSecret;
      })
      .catch((error) => {
        console.error("Error creating checkout session:", error);
        setError("Failed to create checkout session. Please try again.");
        throw error;
      });
  }, []);

  const options = { fetchClientSecret };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  console.log("Rendering Stripe component..."); // Add this line

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default App;
