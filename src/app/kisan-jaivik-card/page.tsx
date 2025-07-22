
"use client"

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function KisanJaivikCardPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        village: '',
        mobile: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.village || !formData.mobile) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill in all details.' });
            return;
        }
        setIsLoading(true);

        try {
            const docData = {
                ...formData,
                status: 'Pending',
                submittedAt: serverTimestamp()
            };
            await addDoc(collection(db, "kisan-jaivik-card-applications"), docData);
            toast({ title: 'Application Submitted', description: 'Your application has been received successfully.'});
            setFormData({ name: '', village: '', mobile: '' }); // Reset form
        } catch (error) {
            console.error("Error submitting application: ", error);
            toast({ variant: 'destructive', title: 'Submission Failed', description: 'There was an error submitting your application.'});
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 md:py-24 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Kisaan Jaivik Card Application</CardTitle>
            <CardDescription>Fill out the form below to apply for your card.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Farmer's Full Name</Label>
                    <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" required disabled={isLoading} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="village">Village Name</Label>
                    <Input id="village" value={formData.village} onChange={handleInputChange} placeholder="Enter your village" required disabled={isLoading} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" type="tel" value={formData.mobile} onChange={handleInputChange} placeholder="Enter your mobile number" required disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
