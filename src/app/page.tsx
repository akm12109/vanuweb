
"use client"

import React from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Leaf, Shield, Heart, User, Sparkles, Loader2, Search } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { ProductCard } from "@/components/product-card";
import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { ServiceSlideshow } from "@/components/service-slideshow";
import { FilterSidebar, FilterState } from "@/components/filter-sidebar";
import { TypewriterWelcome } from "@/components/typewriter-welcome";


interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  image: string;
  imageHover?: string;
  aiHint?: string;
  category?: string;
  categoryName?: string;
  featured?: boolean;
  status: 'Active' | 'Draft';
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Home() {
  const { translations } = useLanguage();
  const [user, loadingAuth] = useAuthState(auth);
  const t = translations.home;
  const th = translations.header;
  const tc = translations.customerAuth;
  
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    maxPrice: 1000, // Default max price
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("status", "==", "Active"));
        const productsSnapshot = await getDocs(q);
        const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setAllProducts(productsData);

        const categoriesSnapshot = await getDocs(query(collection(db, 'categories'), orderBy('name')));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(categoriesData);

        const maxProductPrice = productsData.reduce((max, p) => p.price > max ? p.price : max, 0);
        if (maxProductPrice > 0) {
            setFilters(prev => ({...prev, maxPrice: Math.ceil(maxProductPrice)}));
        }

      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const activeProducts = useMemo(() => allProducts.filter(p => p.status === 'Active'), [allProducts]);
  
  const filteredProducts = useMemo(() => {
    return activeProducts
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(p => {
          // Category filter
          if (filters.categories.length > 0) {
              return p.category && filters.categories.includes(p.category);
          }
          return true;
      })
      .filter(p => {
          // Price filter
          return p.price <= filters.maxPrice;
      });
  }, [activeProducts, searchTerm, filters]);

  const productSections = useMemo(() => {
    return categories
      .map(category => {
          const products = activeProducts.filter(p => p.category === category.slug);
          return {
              title: category.name,
              link: `/products/${category.slug}`,
              products: products.slice(0, 4),
              count: products.length,
          };
      })
      .filter(section => section.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [activeProducts, categories]);

  const topPicks = useMemo(() => activeProducts.slice(0, 4), [activeProducts]);


  const renderProductSection = (title: string, products: Product[], link: string, showLoading: boolean) => (
      <section className="w-full py-16 md:py-24 bg-background last-of-type:bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
              <div className="flex justify-between items-center mb-12">
                  <h2 className="text-3xl font-headline font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
                  <Link href={link}>
                      <Button variant="outline">{t.viewAll}</Button>
                  </Link>
              </div>
              {showLoading ? (
                  <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
              ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
              ) : (
                  <p className="text-center text-muted-foreground">No products found in this category yet.</p>
              )}
          </div>
      </section>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        
        { !user && !loadingAuth && (
          <>
             <section className="w-full py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <ServiceSlideshow />
                </div>
            </section>
            
            {renderProductSection("Top Picks for You", topPicks, "/products", loading)}
            {productSections.map(section => (
                <React.Fragment key={section.title}>
                    {renderProductSection(section.title, section.products, section.link, loading)}
                </React.Fragment>
            ))}
          </>
        )}
        
        { user && !loadingAuth && (
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="mb-8">
                    <TypewriterWelcome 
                        user={user} 
                        fullText="Ready to find the perfect products for a thriving farm? Let's get started!" 
                    />
                </div>
                <div className="grid lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1">
                       <FilterSidebar 
                            filters={filters}
                            onFilterChange={setFilters}
                            categories={categories}
                            maxPrice={Math.ceil(allProducts.reduce((max, p) => p.price > max ? p.price : max, 0))}
                       />
                    </aside>
                    <div className="lg:col-span-3">
                        <div className="mb-8">
                            <p className="text-muted-foreground">Showing {filteredProducts.length} of {activeProducts.length} products.</p>
                        </div>
                        {loading ? (
                             <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-16">No products match your current filters.</p>
                        )}
                    </div>
                </div>
            </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
