
"use client"

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


// Dummy data for dropdowns
const districts = ["Godda", "Madhepura"];
const blocks = {
    "Godda": ["Godda Sadar", "Poreyahat", "Pathargama"],
    "Madhepura": ["Madhepura", "Singheshwar", "Ghailadh"]
};

export default function CoordinatorApplicationPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        fatherName: '',
        dob: '',
        gender: '',
        mobile: '',
        altMobile: '',
        email: '',
        address: '',
        state: 'Jharkhand', // Default
        district: '',
        block: '',
        panchayat: '',
        pinCode: '',
        landmark: '',
        qualification: '',
        computerKnowledge: '',
        experience: '',
        prevJob: '',
        languages: [] as string[],
        aadharNo: '',
        panNo: '',
        voterId: '',
        positionType: '',
        preferredLocation: '',
        whyJoin: '',
        declaration1: false,
        declaration2: false,
        declaration3: false,
    });
    const [files, setFiles] = useState({
        photo: null as File | null,
        aadhar: null as File | null,
        pan: null as File | null,
        signature: null as File | null,
        passbook: null as File | null,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (name: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'district') {
            setFormData(prev => ({...prev, block: ''})); // Reset block on district change
        }
    };
    
    const handleRadioChange = (name: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCheckboxChange = (name: keyof typeof formData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleLanguageCheckbox = (lang: string) => {
        setFormData(prev => {
            const newLangs = prev.languages.includes(lang) 
                ? prev.languages.filter(l => l !== lang)
                : [...prev.languages, lang];
            return { ...prev, languages: newLangs };
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files: inputFiles } = e.target;
        if (inputFiles && inputFiles[0]) {
            setFiles(prev => ({...prev, [id]: inputFiles[0]}));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.declaration1 || !formData.declaration2 || !formData.declaration3) {
            toast({ variant: 'destructive', title: 'Declaration Required', description: 'You must agree to all declarations to submit.' });
            return;
        }
        setIsLoading(true);
        
        try {
            // NOTE: File uploads to Firebase Storage are not implemented in this step.
            // This will only save the text-based data.
            const applicationData = {
                ...formData,
                submittedAt: serverTimestamp()
            };
            await addDoc(collection(db, "coordinator-applications"), applicationData);
            
            toast({ title: 'Application Submitted', description: 'Your application has been received. We will get back to you shortly.' });
            // Consider resetting the form state here if desired
        } catch (error) {
            console.error("Error submitting application: ", error);
            toast({ variant: "destructive", title: "Submission Failed", description: "Could not submit your application. Please try again." });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold tracking-tight text-foreground sm:text-5xl">Coordinator Application Form</h1>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">Apply to become a coordinator at the District, Block, or Panchayat level.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            
            <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={formData.fullName} onChange={handleInputChange} required /></div>
                    <div className="grid gap-2"><Label htmlFor="fatherName">Father’s Name</Label><Input id="fatherName" value={formData.fatherName} onChange={handleInputChange} required /></div>
                    <div className="grid gap-2"><Label htmlFor="dob">Date of Birth</Label><Input id="dob" type="date" value={formData.dob} onChange={handleInputChange} required /></div>
                    <div className="grid gap-2"><Label>Gender</Label><RadioGroup onValueChange={(v) => handleRadioChange('gender', v)} value={formData.gender} className="flex gap-4 pt-2"><RadioGroupItem value="male" id="male" /><Label htmlFor="male">Male</Label><RadioGroupItem value="female" id="female" /><Label htmlFor="female">Female</Label><RadioGroupItem value="other" id="other" /><Label htmlFor="other">Other</Label></RadioGroup></div>
                    <div className="grid gap-2"><Label htmlFor="mobile">Mobile Number (WhatsApp)</Label><Input id="mobile" type="tel" value={formData.mobile} onChange={handleInputChange} required /></div>
                    <div className="grid gap-2"><Label htmlFor="altMobile">Alternate Contact Number</Label><Input id="altMobile" type="tel" value={formData.altMobile} onChange={handleInputChange} /></div>
                    <div className="grid gap-2 md:col-span-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={formData.email} onChange={handleInputChange} required /></div>
                    <div className="grid gap-2"><Label htmlFor="photo">Photograph Upload</Label><Input id="photo" type="file" onChange={handleFileChange} accept="image/*" required /></div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Address Details</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-2 md:col-span-2"><Label htmlFor="address">Complete Address</Label><Input id="address" value={formData.address} onChange={handleInputChange} required /></div>
                    <div className="grid gap-2"><Label htmlFor="state">State</Label><Input id="state" value={formData.state} readOnly /></div>
                    <div className="grid gap-2"><Label htmlFor="district">District</Label><Select onValueChange={(v) => handleSelectChange('district', v)} value={formData.district} required><SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger><SelectContent>{districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
                    <div className="grid gap-2"><Label htmlFor="block">Block</Label><Select onValueChange={(v) => handleSelectChange('block', v)} value={formData.block} disabled={!formData.district} required><SelectTrigger><SelectValue placeholder="Select Block" /></SelectTrigger><SelectContent>{formData.district && blocks[formData.district as keyof typeof blocks].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></div>
                    <div className="grid gap-2"><Label htmlFor="panchayat">Panchayat / Village</Label><Input id="panchayat" value={formData.panchayat} onChange={handleInputChange} required /></div>
                    <div className="grid gap-2"><Label htmlFor="pinCode">Pin Code</Label><Input id="pinCode" value={formData.pinCode} onChange={handleInputChange} required /></div>
                    <div className="grid gap-2"><Label htmlFor="landmark">Nearby Landmark</Label><Input id="landmark" value={formData.landmark} onChange={handleInputChange} /></div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Qualification & Experience</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-2"><Label htmlFor="qualification">Highest Qualification</Label><Select onValueChange={(v) => handleSelectChange('qualification', v)} value={formData.qualification}><SelectTrigger><SelectValue placeholder="Select Qualification" /></SelectTrigger><SelectContent><SelectItem value="10th">10th Pass</SelectItem><SelectItem value="12th">12th Pass</SelectItem><SelectItem value="graduate">Graduate</SelectItem><SelectItem value="post-graduate">Post-Graduate</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
                    <div className="grid gap-2"><Label>Computer Knowledge</Label><RadioGroup onValueChange={(v) => handleRadioChange('computerKnowledge', v)} value={formData.computerKnowledge} className="flex gap-4 pt-2"><RadioGroupItem value="yes" id="ck_yes" /><Label htmlFor="ck_yes">Yes</Label><RadioGroupItem value="no" id="ck_no" /><Label htmlFor="ck_no">No</Label></RadioGroup></div>
                    <div className="grid gap-2"><Label htmlFor="experience">Work Experience (in Years)</Label><Input id="experience" type="number" value={formData.experience} onChange={handleInputChange} /></div>
                    <div className="grid gap-2"><Label htmlFor="prevJob">Previous Job Role / Designation</Label><Input id="prevJob" value={formData.prevJob} onChange={handleInputChange} /></div>
                    <div className="grid gap-2 md:col-span-2"><Label>Languages Known</Label><div className="flex gap-4 pt-2"><Checkbox id="lang_hi" onCheckedChange={() => handleLanguageCheckbox('Hindi')} /><Label htmlFor="lang_hi">Hindi</Label><Checkbox id="lang_en" onCheckedChange={() => handleLanguageCheckbox('English')} /><Label htmlFor="lang_en">English</Label><Checkbox id="lang_local" onCheckedChange={() => handleLanguageCheckbox('Local')} /><Label htmlFor="lang_local">Local</Label></div></div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Identification & Bank Details</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-2"><Label htmlFor="aadharNo">Aadhar Number</Label><Input id="aadharNo" value={formData.aadharNo} onChange={handleInputChange} required /></div>
                    <div className="grid gap-2"><Label htmlFor="panNo">PAN Number (optional)</Label><Input id="panNo" value={formData.panNo} onChange={handleInputChange} /></div>
                    <div className="grid gap-2 md:col-span-2"><Label htmlFor="voterId">Voter ID Number</Label><Input id="voterId" value={formData.voterId} onChange={handleInputChange} /></div>
                    <div className="grid gap-2"><Label htmlFor="aadhar">Upload Aadhar Card (PDF/JPG)</Label><Input id="aadhar" type="file" onChange={handleFileChange} required /></div>
                    <div className="grid gap-2"><Label htmlFor="pan">Upload PAN Card (PDF/JPG)</Label><Input id="pan" type="file" onChange={handleFileChange} /></div>
                    <div className="grid gap-2"><Label htmlFor="signature">Upload Signature</Label><Input id="signature" type="file" onChange={handleFileChange} accept="image/*" required /></div>
                    <Separator className="md:col-span-2" />
                    <p className="text-sm text-muted-foreground md:col-span-2">Bank details are optional and only required if a stipend is involved.</p>
                     <div className="grid gap-2"><Label>Bank Name</Label><Input id="bankName" /></div>
                    <div className="grid gap-2"><Label>Account Number</Label><Input id="accountNumber" /></div>
                    <div className="grid gap-2"><Label>IFSC Code</Label><Input id="ifscCode" /></div>
                    <div className="grid gap-2"><Label>Passbook Front Page Upload</Label><Input id="passbook" type="file" onChange={handleFileChange} /></div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Position Details</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-2"><Label htmlFor="positionType">Applying for Coordinator Type</Label><Select onValueChange={(v) => handleSelectChange('positionType', v)} value={formData.positionType} required><SelectTrigger><SelectValue placeholder="Select Position" /></SelectTrigger><SelectContent><SelectItem value="district">District Coordinator</SelectItem><SelectItem value="block">Block Coordinator</SelectItem><SelectItem value="panchayat">Panchayat Coordinator</SelectItem></SelectContent></Select></div>
                    <div className="grid gap-2"><Label htmlFor="preferredLocation">Preferred Location (Optional)</Label><Input id="preferredLocation" value={formData.preferredLocation} onChange={handleInputChange} /></div>
                    <div className="grid gap-2 md:col-span-2"><Label htmlFor="whyJoin">Why do you want to join us?</Label><Textarea id="whyJoin" value={formData.whyJoin} onChange={handleInputChange} /></div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Declaration</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3"><Checkbox id="declaration1" checked={formData.declaration1} onCheckedChange={(c) => handleCheckboxChange('declaration1', !!c)}/><Label htmlFor="declaration1" className="text-sm text-muted-foreground">I confirm that all information provided in this form is true and correct to the best of my knowledge.</Label></div>
                    <div className="flex items-start gap-3"><Checkbox id="declaration2" checked={formData.declaration2} onCheckedChange={(c) => handleCheckboxChange('declaration2', !!c)}/><Label htmlFor="declaration2" className="text-sm text-muted-foreground">I understand that submitting this application does not guarantee selection for the position.</Label></div>
                    <div className="flex items-start gap-3"><Checkbox id="declaration3" checked={formData.declaration3} onCheckedChange={(c) => handleCheckboxChange('declaration3', !!c)}/><Label htmlFor="declaration3" className="text-sm text-muted-foreground">I agree to the terms and conditions of the coordinator program.</Label></div>
                </CardContent>
            </Card>

            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-6 w-6 animate-spin"/> : null}
                {isLoading ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
