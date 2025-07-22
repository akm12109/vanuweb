
"use client"

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Fee {
    name: string;
    value: number;
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { translations } = useLanguage();
  const t = translations.cart;
  const [shipping, setShipping] = useState(0);
  const [additionalFees, setAdditionalFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharges = async () => {
      setLoading(true);
      try {
        const shippingDoc = await getDoc(doc(db, 'settings', 'shipping'));
        if (shippingDoc.exists()) {
          setShipping(shippingDoc.data().charge || 0);
        }

        const feesDoc = await getDoc(doc(db, 'settings', 'fees'));
        if (feesDoc.exists()) {
            setAdditionalFees(feesDoc.data().charges || []);
        }

      } catch (error) {
        console.error("Error fetching charges:", error);
        setShipping(50); // Fallback shipping
      } finally {
        setLoading(false);
      }
    };
    fetchCharges();
  }, []);
  
  const getPriceAsNumber = (price: string | number) => {
    if (typeof price === 'number') {
      return price;
    }
    // Handle potential currency symbols or commas
    return parseFloat(price.replace(/[^0-9.]/g, ''));
  }

  const subtotal = cart.reduce((sum, item) => sum + (getPriceAsNumber(item.price) * item.quantity), 0);
  const totalFees = additionalFees.reduce((sum, fee) => sum + fee.value, 0);
  const total = subtotal + shipping + totalFees;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-headline font-bold tracking-tight text-foreground sm:text-4xl mb-8">{t.title}</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">{t.emptyCart}</p>
              <Link href="/products">
                <Button>{t.continueShopping}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline">{t.yourItems} ({cart.length})</CardTitle>
                        <Button variant="outline" size="sm" onClick={clearCart}>{t.clearCart}</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-start gap-4">
                          <div className="w-24 h-24 relative rounded-md overflow-hidden">
                             <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" data-ai-hint={item.aiHint} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">₹{getPriceAsNumber(item.price).toFixed(2)}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                    <Minus className="h-4 w-4"/>
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                    <Plus className="h-4 w-4"/>
                                </Button>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-5 w-5 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">{t.orderSummary}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin"/></div>
                    ) : (
                        <>
                            <div className="flex justify-between">
                                <span>{t.subtotal}</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t.shipping}</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>
                            {additionalFees.map(fee => (
                                <div key={fee.name} className="flex justify-between">
                                    <span>{fee.name}</span>
                                    <span>₹{fee.value.toFixed(2)}</span>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>{t.total}</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href="/checkout" className="w-full">
                        <Button className="w-full" disabled={loading}>{t.proceedToCheckout}</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

    