import React from 'react';
import { redirect } from 'next/navigation';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  redirect(`/products?q=${encodeURIComponent(q || '')}`);
}
