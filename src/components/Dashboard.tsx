"use client";

import { useState, useEffect } from 'react';
import WaterfallChart from './WaterfallChart';
import AIAssistant from './AIAssistant';

interface YearData {
    id: number;
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

export default function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: string }>({
        '2023': '',
        '2024': '',
        '2025': '',
        '2026': '',
        '2027': '',
    });
    const [modalOpen, setModalOpen] = useState(false);

    const [headerImage, setHeaderImage] = useState('/schneider_f400_diagram.png');
    const [selectedChartYear, setSelectedChartYear] = useState('2025');

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.headerImageUrl) setHeaderImage(data.headerImageUrl);
            });

        fetch('/api/products')
            .then(res => res.json())
            .then((data: Product[]) => {
                setProducts(data);

                const defaults: { [key: string]: string } = {};

                // 2023: Prefer 'NL GL6-1250A', otherwise first available
                const p2023 = data.find(p => p.name === 'NL GL6-1250A') || data.find(p => p.yearData.some(d => d.year === 2023));
                if (p2023) defaults['2023'] = p2023.id.toString();

                // 2024-2027: First available
                [2024, 2025, 2026, 2027].forEach(year => {
                    const p = data.find(p => p.yearData.some(d => d.year === year));
                    if (p) defaults[year.toString()] = p.id.toString();
                });

                setSelectedProducts(prev => ({ ...prev, ...defaults }));
            });
    }, []);

    const handleProductChange = (year: string, productId: string) => {
        setSelectedProducts(prev => ({ ...prev, [year]: productId }));
    };

    const getProductData = (year: string) => {
        const productId = selectedProducts[year];
        if (!productId) return null;
        const product = products.find(p => p.id.toString() === productId);
        if (!product) return null;
        return product.yearData.find(d => d.year === parseInt(year));
    };

    const formatNumber = (num: number | null) => {
        if (num === null || num === undefined) return '--';
        return num.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
    };

    const formatPercent = (num: number | null) => {
        if (num === null || num === undefined) return '--';
        return (num * 100).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + '%';
    };

    const formatPercentInput = (num: number | null) => {
        if (num === null || num === undefined) return '';
        return (num * 100).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto" id="app">
            {/* HEADER */}
            <header className="flex justify-between items-center mb-6">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-primary">Schneider</h2>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Electric</p>
                </div>
                <div className="flex-1 text-center">
                    <h1 className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-wide">F400 MANUFACTURING TIME DEFINITION</h1>
                </div>
                <div className="flex-1 flex justify-end gap-3">
                    <button onClick={() => window.location.href = "mailto:ahmet.mersin@se.com?subject=F400%20Yardım%20İsteği"}
                        className="bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 text-sm flex items-center gap-1">
                        <span className="material-icons-outlined text-base">help</span>
                        <span>Yardım</span>
                    </button>
                    <button onClick={() => setModalOpen(true)}
                        className="bg-primary hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <span>Hazırlayan</span>
                    </button>
                    {/* Link to Admin Panel */}
                    <a href="/admin"
                        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center">
                        <span>Admin</span>
                    </a>
                </div>
            </header>

            {/* 1. BÜYÜK GÖRSEL ALANI */}
            <div className="relative mb-8 rounded-lg liquid-glass shadow-xl p-4 border border-white/80 w-full lg:w-8/12 mx-auto">
                <div className="image-placeholder-inner rounded-lg overflow-hidden flex justify-center items-center">
                    <img src={headerImage}
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/2816x1536/F5F5F5/3DCD58?text=CUBICLE+MODEL+VISUALISATION'; }}
                        alt="F400 Technical Diagram Placeholder" className="w-full h-full object-cover p-0" />
                </div>
            </div>

            {/* 2. VERİ PANELLERİ */}
            <main className="liquid-glass rounded-lg border border-white/80 shadow-xl overflow-hidden p-0">
                <div className="scroll-container">
                    <div className="flex">

                        {/* 2.1. SABİT ETİKET SÜTUNU */}
                        <div className="sticky-labels hidden lg:flex w-48 flex-col justify-end space-y-2 py-4 px-3">
                            <div className="text-right font-medium h-10 flex items-center justify-end pr-2 text-text-secondary-light">Cubicle Types:</div>
                            <div className="text-right font-medium h-10 flex items-center justify-end pr-2 text-text-secondary-light">Design Time (DT):</div>
                            <div className="text-right font-medium h-10 flex items-center justify-end pr-2 text-text-secondary-light">Useful Time (UT):</div>
                            <div className="text-right font-medium h-10 flex items-center justify-end pr-2 text-text-secondary-light">Non-Value Added:</div>
                            <div className="text-right font-medium h-10 flex items-center justify-end pr-2 text-text-secondary-light">KD (%):</div>
                            <div className="text-right font-medium h-10 flex items-center justify-end pr-2 text-text-secondary-light">KE:</div>
                            <div className="text-right font-medium h-10 flex items-center justify-end pr-2 text-text-secondary-light">KER:</div>
                            <div className="text-right font-medium h-10 flex items-center justify-end pr-2 text-text-secondary-light">KSR:</div>
                            <div className="text-right font-medium h-10 flex items-center justify-end pr-2 text-text-secondary-light">OT:</div>
                            <div className="text-right font-medium h-10 flex items-center justify-end pr-2 text-text-secondary-light">TSR:</div>
                        </div>

                        {/* 2.2. YILLIK VERİ PANELLERİ */}
                        {['2023', '2024', '2025', '2026', '2027'].map(year => {
                            const data = getProductData(year);
                            return (
                                <div key={year} className="data-panel p-4 border-r border-border-light">
                                    <h4 className="text-lg font-bold text-center mb-3">{year}</h4>
                                    <div className="space-y-2">
                                        <select
                                            value={selectedProducts[year] || ''}
                                            onChange={(e) => handleProductChange(year, e.target.value)}
                                            className="product-select w-full bg-primary/10 border-primary/20 text-center rounded-lg h-10 flex items-center justify-center font-semibold text-text-primary-light p-2 transition text-sm"
                                        >
                                            <option value="" disabled>Ürün Seçiniz...</option>
                                            {products.filter(p => p.yearData.some(d => d.year === parseInt(year))).map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>

                                        <div className="bg-white/50 dark:bg-black/20 data-row">
                                            <span className="lg:hidden">Design Time (DT):</span>
                                            <span className="data-value">{formatNumber(data?.dt ?? null)}</span>
                                        </div>
                                        <div className="bg-white/50 dark:bg-black/20 data-row">
                                            <span className="lg:hidden">Useful Time (UT):</span>
                                            <span className="data-value">{formatNumber(data?.ut ?? null)}</span>
                                        </div>
                                        <div className="bg-white/50 dark:bg-black/20 data-row">
                                            <span className="lg:hidden">Non-Value Added:</span>
                                            <span className="data-value">{formatNumber(data?.nva ?? null)}</span>
                                        </div>
                                        <div className="bg-white/50 dark:bg-black/20 data-row">
                                            <span className="lg:hidden">KD (%):</span>
                                            <span className="data-value text-primary">{formatPercent(data?.kd ?? null)}</span>
                                        </div>
                                        <div className="bg-white/50 dark:bg-black/20 data-row">
                                            <span className="lg:hidden">KE:</span>
                                            <span className="data-value">{formatPercent(data?.ke ?? null)}</span>
                                        </div>
                                        <div className="flex items-center h-10 justify-end lg:justify-start">
                                            <span className="lg:hidden mr-2">KER:</span>
                                            <span className="w-1/4 text-center hidden lg:inline">%</span>
                                            <input className="ker-input ker-red" type="text" readOnly value={formatPercentInput(data?.ker ?? null)} />
                                        </div>
                                        <div className="flex items-center h-10 justify-end lg:justify-start">
                                            <span className="lg:hidden mr-2">KSR:</span>
                                            <span className="w-1/4 text-center hidden lg:inline">%</span>
                                            <input className="ker-input bg-white/50 dark:bg-black/20 border-border-light text-center" type="text" readOnly value={formatPercentInput(data?.ksr ?? null)} />
                                        </div>
                                        <div className="bg-white/50 dark:bg-black/20 data-row">
                                            <span className="lg:hidden">OT:</span>
                                            <span className="data-value">{formatNumber(data?.otr ?? null)}</span>
                                        </div>
                                        <div className="bg-white/50 dark:bg-black/20 data-row">
                                            <span className="lg:hidden">TSR:</span>
                                            <span className="data-value text-red-500 font-mono">{data?.tsr || '#DIV/0!'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </main>

            {/* 3. SPS WATERFALL ANALYSIS SECTION */}
            <section className="mt-8 liquid-glass rounded-lg border border-white/80 shadow-xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="material-icons-outlined text-primary">bar_chart</span>
                        SPS Time Analysis (Waterfall)
                    </h3>

                    {/* Year Tabs */}
                    <div className="flex p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        {['2023', '2024', '2025', '2026', '2027'].map(year => (
                            <button
                                key={year}
                                onClick={() => setSelectedChartYear(year)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${selectedChartYear === year
                                    ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white/40 dark:bg-black/20 rounded-xl p-6 border border-white/50 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-2xl text-gray-700 dark:text-gray-200">{selectedChartYear} Analysis</h4>
                        <span className="text-sm font-mono text-gray-500 bg-white/50 px-3 py-1 rounded border border-white/50">
                            Product: <span className="font-bold text-gray-800">{products.find(p => p.id.toString() === selectedProducts[selectedChartYear])?.name || 'No Product Selected'}</span>
                        </span>
                    </div>

                    <div className="h-[400px]">
                        <WaterfallChart
                            ot={getProductData(selectedChartYear)?.otr ?? null}
                            dt={getProductData(selectedChartYear)?.dt ?? null}
                            ut={getProductData(selectedChartYear)?.ut ?? null}
                            nva={getProductData(selectedChartYear)?.nva ?? null}
                        />
                    </div>
                </div>
            </section>

            {/* Popup Modal */}
            <div className={`modal fixed inset-0 z-50 flex items-center justify-center p-4 ${modalOpen ? 'active' : ''}`}>
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setModalOpen(false)}></div>
                <div className="modal-content liquid-glass bg-white/95 rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden z-10 border border-white/80">
                    <div className="bg-primary h-20 w-full absolute top-0 left-0"></div>
                    <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-white/90 hover:text-white transition-colors z-20">
                        <span className="material-icons-outlined">close</span>
                    </button>
                    <div className="pt-12 px-6 pb-6 text-center relative">
                        <div className="w-20 h-20 mx-auto bg-white rounded-full p-1 shadow-md mb-3 flex items-center justify-center relative z-10 border-4 border-primary">
                            <span className="material-icons-outlined text-4xl text-primary">person</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Ahmet Mersin</h3>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-6 font-semibold">Proje Yöneticisi</p>
                        <a href="mailto:ahmet.mersin@se.com" className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg border border-gray-200 transition-colors mb-3 group text-sm">
                            <span className="material-icons-outlined text-gray-500 group-hover:text-primary text-base">mail_outline</span>
                            ahmet.mersin@se.com
                        </a>
                        <button onClick={() => setModalOpen(false)} className="w-full py-2.5 bg-primary hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition-all text-sm">
                            Kapat
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Assistant Widget */}
            <AIAssistant />
        </div>
    );
}
