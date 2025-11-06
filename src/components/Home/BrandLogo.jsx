'use client'

import React, { useEffect, useState } from 'react'
import { InfiniteSlider } from "@/components/ui/InfiniteSlider";
import './BrandLogo.css'
import { getPublicBrands } from "@/service/contentService";

export default function BrandLogos() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getPublicBrands();
      if (!mounted) return;
      if (res?.success && Array.isArray(res.data?.data)) {
        setBrands(res.data.data);
      } else {
        setBrands([]);
      }
      setLoading(false);
    })();
    return () => { mounted = false };
  }, []);

  if (loading) {
    return (
      <section className="relative w-screen overflow-hidden py-8 px-10 md:px-20 bg-slate-900">
        <div className="h-20 w-full bg-slate-800 animate-pulse rounded" />
      </section>
    );
  }

  if (!brands.length) return null;

  const logos = brands.map(b => ({ src: b.logo, alt: b.name, href: b.website }));

  return (
    <section className="relative w-screen overflow-hidden py-8 px-0 md:px-0 bg-slate-900">
      <div className="relative">
        <InfiniteSlider className="w-screen overflow-hidden" duration={40} durationOnHover={Infinity} gap={80}>
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex">
              {logo.href ? (
                <a href={logo.href} target="_blank" rel="noreferrer" aria-label={logo.alt}>
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="mx-auto h-20 w-28 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                  />
                </a>
              ) : (
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="mx-auto h-20 w-28 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                />
              )}
            </div>
          ))}
        </InfiniteSlider>

        {/* Gradient 2 đầu */}
        <div className="absolute inset-y-0 left-0 w-80 bg-gradient-to-r from-slate-900 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-80 bg-gradient-to-l from-slate-900 pointer-events-none"></div>
      </div>
    </section>
  )
}
