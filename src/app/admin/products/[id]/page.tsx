"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface YearData {
    id?: number;
    year: number;
    dt: number | null;
    ut: number | null;
    nva: number | null;
    kd: number | null;
    ke: number | null;
    ker: number | null;
    ksr: number | null;
    otr: number | null;
    tsr: string | null;
}

interface Product {
    id: number;
    name: string;
    image: string | null;
    yearData: YearData[];
}

export default function EditProduct() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setProduct(data);
        } catch (error) {
            console.error(error);
            alert('Failed to load product');
            router.push('/admin');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        setSaving(true);

        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: product.name }),
            });
            if (!res.ok) throw new Error('Failed to update');
            alert('Product updated successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    if (loading || !product) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Edit Product: {product.name}</h2>
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input
                            type="text"
                            value={product.name}
                            onChange={(e) => setProduct({ ...product, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 p-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
                    >
                        {saving ? 'Saving...' : 'Update Product Details'}
                    </button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Manage Year Data</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    To manage numerical data (DT, UT, etc.), please go back to the Admin Dashboard and select the specific year.
                </p>
                <div className="flex gap-4">
                    {[2023, 2024, 2025, 2026, 2027].map(year => (
                        <Link key={year} href={`/admin/year/${year}`} className="text-primary hover:underline font-medium">
                            Manage {year} Data &rarr;
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
