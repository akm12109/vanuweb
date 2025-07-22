
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { ServiceSlideshow } from "@/components/service-slideshow";
import { Separator } from "@/components/ui/separator";

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
            <g>
                <path d="M22.56,12.25C22.56,11.47,22.5,10.72,22.38,10H12V14.5H18.06C17.71,16.27,16.55,17.75,14.9,18.61V21.19H18.8C21.11,19.07,22.56,15.91,22.56,12.25Z" fill="#4285F4"></path>
                <path d="M12,23C14.73,23,17.07,22.09,18.8,20.61L14.9,18.11C13.97,18.76,12.9,19.14,11.64,19.14C9.23,19.14,7.2,17.58,6.38,15.38L2.39,15.38V17.96C4.18,20.93,7.84,23,12,23Z" fill="#34A853"></path>
                <path d="M6.38,15.38C6.18,14.82,6.07,14.22,6.07,13.61C6.07,13,6.18,12.4,6.38,11.84L2.39,11.84V9.26C1.48,10.99,1,12.75,1,14.61C1,16.47,1.48,18.23,2.39,19.96L6.38,15.38Z" fill="#FBBC05"></path>
                <path d="M12,6.38C13.34,6.38,14.48,6.86,15.3,7.63L18.88,4.19C17.07,2.4,14.73,1.5,12,1.5C7.84,1.5,4.18,3.57,2.39,6.54L6.38,9.12C7.2,6.92,9.23,5.36,11.64,5.36H12V6.38Z" fill="#EA4335"></path>
            </g>
        </svg>
    )
}


export default function CustomerLoginPage() {
    const { translations } = useLanguage();
    const t = translations.customerAuth;
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: "Login Successful", description: "Welcome back!" });
            router.push('/');
        } catch (error: any) {
            console.error("Login Error:", error);
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 md:py-24">
        <div className="container grid lg:grid-cols-2 gap-12 items-stretch h-full">
            <div className="h-full">
                 <ServiceSlideshow />
            </div>
            <Card className="w-full max-w-sm mx-auto flex flex-col justify-center">
              <form onSubmit={handleSignIn}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-headline">{t.loginTitle}</CardTitle>
                    <CardDescription>{t.loginDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Button variant="outline" className="w-full" disabled>
                        <GoogleIcon />
                        Sign in with Google (Coming Soon)
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">{t.emailLabel}</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="m@example.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">{t.passwordLabel}</Label>
                            <Link href="/forgot-password" passHref>
                               <span className="ml-auto inline-block text-sm underline cursor-pointer">{t.forgotPasswordLink}</span>
                            </Link>
                        </div>
                      <Input 
                        id="password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? t.signingIn : t.signInButton}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      {t.noAccountPrompt}{' '}
                      <Link href="/register" className="underline">
                        {t.signUpLink}
                      </Link>
                    </p>
                    <Separator />
                     <p className="text-center text-sm text-muted-foreground">
                      Are you an employee?{' '}
                      <Link href="/employee-login" className="underline font-semibold text-primary">
                        Employee Login
                      </Link>
                    </p>
                  </CardFooter>
              </form>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
