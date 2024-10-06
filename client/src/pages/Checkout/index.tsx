import { useEffect } from "react";
import StripeCheckout from "@/components/StripeComponents";
import { useAuth } from "@/hooks/useAuth";

const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("Checkout Page - User:", user);
    console.log("Checkout Page - Is Authenticated:", isAuthenticated);
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Loading...</div>; // Or redirect to login
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <StripeCheckout />
    </div>
  );
};

export default CheckoutPage;
