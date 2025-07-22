
"use client"

import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';

interface Location {
    id: string; // District name
    blocks: string[];
}

export default function LocationsPage() {
    const { toast } = useToast();
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [newDistrictName, setNewDistrictName] = useState('');
    const [newBlockName, setNewBlockName] = useState('');
    const [selectedDistrictForBlock, setSelectedDistrictForBlock] = useState('');

    const [isSubmittingDistrict, setIsSubmittingDistrict] = useState(false);
    const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "locations"));
            const locationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Location));
            setLocations(locationsData.sort((a, b) => a.id.localeCompare(b.id)));
        } catch (error) {
            toast({ variant: "destructive", title: "Error fetching locations" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleAddDistrict = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDistrictName.trim()) return;
        setIsSubmittingDistrict(true);
        try {
            await setDoc(doc(db, "locations", newDistrictName), { blocks: [] });
            toast({ title: "District added" });
            setNewDistrictName('');
            fetchLocations();
        } catch (error) {
            toast({ variant: "destructive", title: "Error adding district" });
        } finally {
            setIsSubmittingDistrict(false);
        }
    };
    
    const handleAddBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBlockName.trim() || !selectedDistrictForBlock) return;
        setIsSubmittingBlock(true);
        try {
            const districtRef = doc(db, 'locations', selectedDistrictForBlock);
            await updateDoc(districtRef, {
                blocks: arrayUnion(newBlockName)
            });
            toast({ title: "Block added" });
            setNewBlockName('');
            fetchLocations();
        } catch (error) {
            toast({ variant: "destructive", title: "Error adding block" });
        } finally {
            setIsSubmittingBlock(false);
        }
    };

    const handleDeleteDistrict = async (id: string) => {
        if (!window.confirm(`Are you sure you want to delete the district "${id}"? This will also delete all its blocks.`)) return;
        try {
            await deleteDoc(doc(db, "locations", id));
            toast({ title: "District deleted" });
            fetchLocations();
        } catch (error) {
            toast({ variant: "destructive", title: "Error deleting district" });
        }
    };

    const handleDeleteBlock = async (districtId: string, blockName: string) => {
        if (!window.confirm(`Are you sure you want to delete the block "${blockName}"?`)) return;
        try {
            const districtRef = doc(db, 'locations', districtId);
            await updateDoc(districtRef, {
                blocks: arrayRemove(blockName)
            });
            toast({ title: "Block deleted" });
            fetchLocations();
        } catch (error) {
            toast({ variant: "destructive", title: "Error deleting block" });
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New District</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddDistrict} className="flex gap-2">
                            <Input value={newDistrictName} onChange={(e) => setNewDistrictName(e.target.value)} placeholder="e.g., Godda" disabled={isSubmittingDistrict} />
                            <Button type="submit" disabled={isSubmittingDistrict}>
                                {isSubmittingDistrict ? <Loader2 className="animate-spin"/> : <PlusCircle />}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Add New Block</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddBlock} className="space-y-4">
                             <select value={selectedDistrictForBlock} onChange={(e) => setSelectedDistrictForBlock(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Select a District</option>
                                {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.id}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <Input value={newBlockName} onChange={(e) => setNewBlockName(e.target.value)} placeholder="e.g., Godda Sadar" disabled={isSubmittingBlock || !selectedDistrictForBlock} />
                                <Button type="submit" disabled={isSubmittingBlock || !selectedDistrictForBlock}>
                                    {isSubmittingBlock ? <Loader2 className="animate-spin"/> : <PlusCircle />}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Locations</CardTitle>
                        <CardDescription>Review and manage districts and blocks.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></div>
                        ) : locations.length === 0 ? (
                            <p className="text-center text-muted-foreground">No locations added yet.</p>
                        ) : (
                             <div className="space-y-4">
                                {locations.map(loc => (
                                    <div key={loc.id}>
                                        <div className="flex justify-between items-center bg-muted p-2 rounded-t-md">
                                            <h3 className="font-semibold">{loc.id}</h3>
                                            <Button variant="destructive" size="icon" onClick={() => handleDeleteDistrict(loc.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="p-2 border border-t-0 rounded-b-md space-y-2">
                                            {loc.blocks.length > 0 ? loc.blocks.sort().map(block => (
                                                <div key={block} className="flex justify-between items-center text-sm">
                                                    <span>{block}</span>
                                                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteBlock(loc.id, block)}>
                                                        <Trash2 className="h-3 w-3 text-destructive" />
                                                    </Button>
                                                </div>
                                            )) : <p className="text-xs text-muted-foreground">No blocks added.</p>}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
