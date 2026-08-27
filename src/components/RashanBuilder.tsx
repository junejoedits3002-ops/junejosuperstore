import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Check,
  Plus,
  Trash2,
  Users,
  Wheat,
  Droplet,
  Layers,
  Soup,
  Coffee,
  Sparkle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { RashanPackageItem } from '../types';
import { useStore } from '../context/StoreContext';

interface CustomBuilderState {
  packageName: string;
  familyPreset: 'small' | 'medium' | 'large' | 'custom';
  atta: { id: string; name: string; quantity: string; price: number };
  rice: { id: string; name: string; quantity: string; price: number };
  sugar: { id: string; name: string; quantity: string; price: number };
  oil: { id: string; name: string; quantity: string; price: number };
  tea: { id: string; name: string; quantity: string; price: number };
  selectedDaals: { id: string; name: string; quantity: string; price: number }[];
  selectedSpices: { id: string; name: string; quantity: string; price: number }[];
  selectedDairy: { id: string; name: string; quantity: string; price: number }[];
  selectedHygiene: { id: string; name: string; quantity: string; price: number }[];
}

const ATTA_OPTIONS = [
  { id: 'atta-10', name: 'Sunridge Whole Wheat Chakki Atta', quantity: '10 kg', price: 1450 },
  { id: 'atta-20', name: 'Sunridge Whole Wheat Chakki Atta', quantity: '20 kg (2x10kg)', price: 2900 },
  { id: 'atta-30', name: 'Sunridge Whole Wheat Chakki Atta', quantity: '30 kg (3x10kg)', price: 4350 },
  { id: 'atta-fine-10', name: 'Super Fine Wheat Flour', quantity: '10 kg', price: 1550 },
];

const RICE_OPTIONS = [
  { id: 'rice-5', name: 'Guard Super Kernel Basmati Rice', quantity: '5 kg', price: 1850 },
  { id: 'rice-10', name: 'Guard Super Kernel Basmati Rice', quantity: '10 kg (2x5kg)', price: 3700 },
  { id: 'rice-15', name: 'Guard Super Kernel Basmati Rice', quantity: '15 kg (3x5kg)', price: 5550 },
  { id: 'rice-kainat-5', name: 'Kainat 1121 Long Steam Rice', quantity: '5 kg', price: 1650 },
];

const SUGAR_OPTIONS = [
  { id: 'sugar-2', name: 'Refined White Crystal Sugar', quantity: '2 kg', price: 310 },
  { id: 'sugar-5', name: 'Refined White Crystal Sugar', quantity: '5 kg', price: 750 },
  { id: 'sugar-10', name: 'Refined White Crystal Sugar', quantity: '10 kg (2x5kg)', price: 1500 },
];

const OIL_OPTIONS = [
  { id: 'oil-2', name: 'Dalda / Sufi Canola Oil', quantity: '2 Litres', price: 1040 },
  { id: 'oil-5', name: 'Dalda Cooking Oil Bottle', quantity: '5 Litres', price: 2650 },
  { id: 'oil-10', name: 'Dalda Cooking Oil (2x5L)', quantity: '10 Litres', price: 5300 },
  { id: 'oil-ghee-5', name: 'Habib Banaspati Ghee', quantity: '5 kg Pouch Pack', price: 2550 },
];

const TEA_OPTIONS = [
  { id: 'tea-475', name: 'Tapal Danedar Black Tea', quantity: '475 g', price: 890 },
  { id: 'tea-900', name: 'Tapal Danedar Black Tea Economy', quantity: '900 g', price: 1580 },
  { id: 'tea-1800', name: 'Tapal Danedar Black Tea (2x900g)', quantity: '1.8 kg', price: 3160 },
  { id: 'tea-lipton-475', name: 'Lipton Yellow Label Black Tea', quantity: '475 g', price: 890 },
];

const DAAL_OPTIONS = [
  { id: 'daal-masoor', name: 'Premium Daal Masoor (Red Lentils)', quantity: '1 kg', price: 310 },
  { id: 'daal-chana', name: 'Daal Chana (Bengal Gram)', quantity: '1 kg', price: 290 },
  { id: 'daal-moong', name: 'Daal Moong Dhuli (Yellow)', quantity: '1 kg', price: 330 },
  { id: 'daal-mash', name: 'Daal Mash Dhuli (White Urad)', quantity: '1 kg', price: 490 },
  { id: 'daal-kabuli', name: 'White Kabuli Chickpeas', quantity: '1 kg', price: 380 },
];

const SPICE_OPTIONS = [
  { id: 'sp-salt', name: 'National Pink Himalayan Salt', quantity: '800 g', price: 110 },
  { id: 'sp-haldi', name: 'National Pure Haldi Powder', quantity: '200 g', price: 195 },
  { id: 'sp-mirch', name: 'National Red Chilli Powder', quantity: '200 g', price: 260 },
  { id: 'sp-dhaniya', name: 'National Coriander Powder', quantity: '200 g', price: 180 },
  { id: 'sp-biryani', name: 'Shan Bombay Biryani Masala (Pack of 3)', quantity: '150 g', price: 360 },
];

const DAIRY_OPTIONS = [
  { id: 'dy-olpers', name: 'Olper’s Full Cream Milk (Pack of 6)', quantity: '6 Litres', price: 1740 },
  { id: 'dy-butter', name: 'Nurpur Pure Creamery Butter', quantity: '200 g', price: 360 },
  { id: 'dy-roohafza', name: 'Rooh Afza Summer Sharbat', quantity: '800 ml', price: 390 },
];

const HYGIENE_OPTIONS = [
  { id: 'hy-surf', name: 'Surf Excel Washing Powder', quantity: '2 kg Polybag', price: 1190 },
  { id: 'hy-vim', name: 'Vim Lemon Dishwash Gel', quantity: '500 ml', price: 290 },
  { id: 'hy-soap', name: 'Lifebuoy Antibacterial Soap (4 Bars)', quantity: '460 g', price: 360 },
  { id: 'hy-colgate', name: 'Colgate Cavity Protection Toothpaste', quantity: '150 g', price: 230 },
];

export const RashanBuilder: React.FC = () => {
  const {
    addCustomRashanToCart,
    setIsCartOpen,
    generateWhatsAppOrderUrl,
    storeSettings,
  } = useStore();

  const [packageName, setPackageName] = useState('My Custom Monthly Rashan');
  const [selectedAtta, setSelectedAtta] = useState(ATTA_OPTIONS[0]);
  const [selectedRice, setSelectedRice] = useState(RICE_OPTIONS[0]);
  const [selectedSugar, setSelectedSugar] = useState(SUGAR_OPTIONS[1]);
  const [selectedOil, setSelectedOil] = useState(OIL_OPTIONS[1]);
  const [selectedTea, setSelectedTea] = useState(TEA_OPTIONS[1]);

  const [selectedDaals, setSelectedDaals] = useState<typeof DAAL_OPTIONS>([
    DAAL_OPTIONS[0],
    DAAL_OPTIONS[1],
  ]);
  const [selectedSpices, setSelectedSpices] = useState<typeof SPICE_OPTIONS>([
    SPICE_OPTIONS[0],
    SPICE_OPTIONS[1],
    SPICE_OPTIONS[2],
  ]);
  const [selectedDairy, setSelectedDairy] = useState<typeof DAIRY_OPTIONS>([
    DAIRY_OPTIONS[0],
  ]);
  const [selectedHygiene, setSelectedHygiene] = useState<typeof HYGIENE_OPTIONS>([
    HYGIENE_OPTIONS[0],
    HYGIENE_OPTIONS[1],
    HYGIENE_OPTIONS[2],
  ]);

  // Family Presets Handler
  const handleApplyPreset = (size: 'small' | 'medium' | 'large') => {
    if (size === 'small') {
      setSelectedAtta(ATTA_OPTIONS[0]); // 10kg
      setSelectedRice(RICE_OPTIONS[0]); // 5kg
      setSelectedSugar(SUGAR_OPTIONS[0]); // 2kg
      setSelectedOil(OIL_OPTIONS[0]); // 2L
      setSelectedTea(TEA_OPTIONS[0]); // 475g
      setSelectedDaals([DAAL_OPTIONS[0], DAAL_OPTIONS[1]]);
      setSelectedDairy([]);
      setSelectedHygiene([HYGIENE_OPTIONS[1], HYGIENE_OPTIONS[2]]);
      setPackageName('Small Family Monthly Rashan');
    } else if (size === 'medium') {
      setSelectedAtta(ATTA_OPTIONS[1]); // 20kg
      setSelectedRice(RICE_OPTIONS[1]); // 10kg
      setSelectedSugar(SUGAR_OPTIONS[1]); // 5kg
      setSelectedOil(OIL_OPTIONS[1]); // 5L
      setSelectedTea(TEA_OPTIONS[1]); // 900g
      setSelectedDaals([DAAL_OPTIONS[0], DAAL_OPTIONS[1], DAAL_OPTIONS[2]]);
      setSelectedDairy([DAIRY_OPTIONS[0]]);
      setSelectedHygiene([HYGIENE_OPTIONS[0], HYGIENE_OPTIONS[1], HYGIENE_OPTIONS[2]]);
      setPackageName('Medium Family Monthly Rashan');
    } else if (size === 'large') {
      setSelectedAtta(ATTA_OPTIONS[2]); // 30kg
      setSelectedRice(RICE_OPTIONS[2]); // 15kg
      setSelectedSugar(SUGAR_OPTIONS[2]); // 10kg
      setSelectedOil(OIL_OPTIONS[2]); // 10L
      setSelectedTea(TEA_OPTIONS[2]); // 1.8kg
      setSelectedDaals(DAAL_OPTIONS);
      setSelectedDairy(DAIRY_OPTIONS);
      setSelectedHygiene(HYGIENE_OPTIONS);
      setPackageName('Large Family Mega Rashan');
    }
  };

  const toggleOption = <T extends { id: string }>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    item: T
  ) => {
    if (list.some((i) => i.id === item.id)) {
      setList(list.filter((i) => i.id !== item.id));
    } else {
      setList([...list, item]);
    }
  };

  // Compile all selected items
  const allSelectedItems: RashanPackageItem[] = useMemo(() => {
    const list: RashanPackageItem[] = [
      { id: selectedAtta.id, productName: selectedAtta.name, quantity: selectedAtta.quantity, estimatedPrice: selectedAtta.price },
      { id: selectedRice.id, productName: selectedRice.name, quantity: selectedRice.quantity, estimatedPrice: selectedRice.price },
      { id: selectedSugar.id, productName: selectedSugar.name, quantity: selectedSugar.quantity, estimatedPrice: selectedSugar.price },
      { id: selectedOil.id, productName: selectedOil.name, quantity: selectedOil.quantity, estimatedPrice: selectedOil.price },
      { id: selectedTea.id, productName: selectedTea.name, quantity: selectedTea.quantity, estimatedPrice: selectedTea.price },
    ];

    selectedDaals.forEach((d) => list.push({ id: d.id, productName: d.name, quantity: d.quantity, estimatedPrice: d.price }));
    selectedSpices.forEach((s) => list.push({ id: s.id, productName: s.name, quantity: s.quantity, estimatedPrice: s.price }));
    selectedDairy.forEach((dy) => list.push({ id: dy.id, productName: dy.name, quantity: dy.quantity, estimatedPrice: dy.price }));
    selectedHygiene.forEach((h) => list.push({ id: h.id, productName: h.name, quantity: h.quantity, estimatedPrice: h.price }));

    return list;
  }, [selectedAtta, selectedRice, selectedSugar, selectedOil, selectedTea, selectedDaals, selectedSpices, selectedDairy, selectedHygiene]);

  const totalCalculatedPrice = useMemo(() => {
    return allSelectedItems.reduce((acc, curr) => acc + curr.estimatedPrice, 0);
  }, [allSelectedItems]);

  const handleAddCompleteRashan = () => {
    addCustomRashanToCart(packageName, allSelectedItems, totalCalculatedPrice);
    setIsCartOpen(true);
  };

  const handleWhatsAppOrder = () => {
    const customCartItem = {
      cartItemId: `custom-pkg-${Date.now()}`,
      type: 'custom_rashan' as const,
      name: packageName,
      price: totalCalculatedPrice,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      packageItems: allSelectedItems,
    };
    const url = generateWhatsAppOrderUrl({
      items: [customCartItem],
      total: totalCalculatedPrice,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="py-10 bg-stone-100/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>Interactive Custom Grocery Planner</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-heading">
            Build Your Monthly Rashan
          </h1>

          <p className="text-sm sm:text-base text-stone-600">
            Pick your exact grain weights, preferred cooking oil, tea brands, and pulses. We calculate your family grocery bill instantly.
          </p>

          {/* Preset Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Quick Presets:</span>
            </span>
            <button
              type="button"
              onClick={() => handleApplyPreset('small')}
              className="px-3.5 py-1.5 bg-white/80 backdrop-blur-xs hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200/80 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
            >
              Small Family (2-4)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('medium')}
              className="px-3.5 py-1.5 bg-emerald-700 text-white border border-emerald-800 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Medium Family (5-7)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('large')}
              className="px-3.5 py-1.5 bg-white/80 backdrop-blur-xs hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200/80 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
            >
              Large Family (8+)
            </button>
          </div>
        </div>

        {/* Two Columns: Builder Controls (Left) vs Summary Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Builder Controls */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Package Title input */}
            <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                Name Your Package
              </label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="e.g. Khan Family Monthly Grocery"
                className="w-full px-3.5 py-2 border border-stone-300/80 rounded-xl text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white/70 backdrop-blur-xs"
              />
            </div>

            {/* 2. Atta Selection */}
            <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Atta &amp; Flour (آٹا)</h3>
                    <p className="text-xs text-stone-400">Select required monthly weight</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-emerald-200/70">
                  {selectedAtta.quantity} • Rs. {selectedAtta.price.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {ATTA_OPTIONS.map((opt) => {
                  const isSelected = selectedAtta.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedAtta(opt)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600/20 text-emerald-950 font-bold shadow-xs'
                          : 'border-stone-200/80 bg-stone-50/70 hover:bg-white text-stone-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{opt.quantity}</span>
                      <span className="text-[11px] text-stone-500 truncate">{opt.name}</span>
                      <span className="text-xs font-black text-emerald-800 mt-2">
                        Rs. {opt.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Rice Selection */}
            <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Basmati Rice (چاول)</h3>
                    <p className="text-xs text-stone-400">Super Kernel Aromatic Grain</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-emerald-200/70">
                  {selectedRice.quantity} • Rs. {selectedRice.price.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {RICE_OPTIONS.map((opt) => {
                  const isSelected = selectedRice.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedRice(opt)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600/20 text-emerald-950 font-bold shadow-xs'
                          : 'border-stone-200/80 bg-stone-50/70 hover:bg-white text-stone-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{opt.quantity}</span>
                      <span className="text-[11px] text-stone-500 truncate">{opt.name}</span>
                      <span className="text-xs font-black text-emerald-800 mt-2">
                        Rs. {opt.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Sugar Selection */}
            <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Sugar (چینی)</h3>
                    <p className="text-xs text-stone-400">100% Pure Refined White Crystals</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-emerald-200/70">
                  {selectedSugar.quantity} • Rs. {selectedSugar.price.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {SUGAR_OPTIONS.map((opt) => {
                  const isSelected = selectedSugar.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedSugar(opt)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600/20 text-emerald-950 font-bold shadow-xs'
                          : 'border-stone-200/80 bg-stone-50/70 hover:bg-white text-stone-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{opt.quantity}</span>
                      <span className="text-xs font-black text-emerald-800 mt-2">
                        Rs. {opt.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Cooking Oil & Ghee */}
            <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Cooking Oil &amp; Ghee (کوکنگ آئل / گھی)</h3>
                    <p className="text-xs text-stone-400">Dalda / Habib / Sufi</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-emerald-200/70">
                  {selectedOil.quantity} • Rs. {selectedOil.price.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {OIL_OPTIONS.map((opt) => {
                  const isSelected = selectedOil.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOil(opt)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600/20 text-emerald-950 font-bold shadow-xs'
                          : 'border-stone-200/80 bg-stone-50/70 hover:bg-white text-stone-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{opt.quantity}</span>
                      <span className="text-[11px] text-stone-500 truncate">{opt.name}</span>
                      <span className="text-xs font-black text-emerald-800 mt-2">
                        Rs. {opt.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Tea Selection */}
            <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Chai / Black Tea (چائے)</h3>
                    <p className="text-xs text-stone-400">Tapal Danedar / Lipton</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-emerald-200/70">
                  {selectedTea.quantity} • Rs. {selectedTea.price.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {TEA_OPTIONS.map((opt) => {
                  const isSelected = selectedTea.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedTea(opt)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600/20 text-emerald-950 font-bold shadow-xs'
                          : 'border-stone-200/80 bg-stone-50/70 hover:bg-white text-stone-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{opt.quantity}</span>
                      <span className="text-[11px] text-stone-500 truncate">{opt.name}</span>
                      <span className="text-xs font-black text-emerald-800 mt-2">
                        Rs. {opt.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 7. Multi-select Daal / Pulses */}
            <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-900 flex items-center justify-center font-bold">
                    <Soup className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Select Daals &amp; Pulses (دالیں)</h3>
                    <p className="text-xs text-stone-400">Click to select multiple varieties</p>
                  </div>
                </div>
                <span className="text-xs text-stone-500 font-semibold bg-stone-100/80 px-2.5 py-0.5 rounded-full">
                  {selectedDaals.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {DAAL_OPTIONS.map((d) => {
                  const isSelected = selectedDaals.some((item) => item.id === d.id);
                  return (
                    <div
                      key={d.id}
                      onClick={() => toggleOption(selectedDaals, setSelectedDaals, d)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 font-semibold shadow-xs'
                          : 'border-stone-200/80 bg-stone-50/70 text-stone-700 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                            isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs">{d.name} ({d.quantity})</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-800">
                        Rs. {d.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 8. Additional Essentials (Spices, Dairy, Hygiene) */}
            <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200/60 pb-3">
                <Sparkle className="w-4 h-4 text-emerald-700" />
                <span>Add Spices, Dairy &amp; Cleaning Supplies</span>
              </h3>

              {/* Spices */}
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Spices &amp; Masala (مصالحہ جات)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SPICE_OPTIONS.map((sp) => {
                    const isSelected = selectedSpices.some((item) => item.id === sp.id);
                    return (
                      <div
                        key={sp.id}
                        onClick={() => toggleOption(selectedSpices, setSelectedSpices, sp)}
                        className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          isSelected ? 'border-emerald-600 bg-emerald-50/90 font-semibold' : 'border-stone-200/80 bg-stone-50/70 text-stone-700 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'}`}>
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className="truncate">{sp.name}</span>
                        </div>
                        <span className="font-bold text-emerald-800 shrink-0">Rs. {sp.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dairy */}
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Milk &amp; Beverages (دودھ اور مشروبات)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DAIRY_OPTIONS.map((dy) => {
                    const isSelected = selectedDairy.some((item) => item.id === dy.id);
                    return (
                      <div
                        key={dy.id}
                        onClick={() => toggleOption(selectedDairy, setSelectedDairy, dy)}
                        className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          isSelected ? 'border-emerald-600 bg-emerald-50/90 font-semibold' : 'border-stone-200/80 bg-stone-50/70 text-stone-700 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'}`}>
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className="truncate">{dy.name}</span>
                        </div>
                        <span className="font-bold text-emerald-800 shrink-0">Rs. {dy.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hygiene */}
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Cleaning &amp; Personal Hygiene (صفائی کا سامان)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {HYGIENE_OPTIONS.map((hy) => {
                    const isSelected = selectedHygiene.some((item) => item.id === hy.id);
                    return (
                      <div
                        key={hy.id}
                        onClick={() => toggleOption(selectedHygiene, setSelectedHygiene, hy)}
                        className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          isSelected ? 'border-emerald-600 bg-emerald-50/90 font-semibold' : 'border-stone-200/80 bg-stone-50/70 text-stone-700 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'}`}>
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className="truncate">{hy.name}</span>
                        </div>
                        <span className="font-bold text-emerald-800 shrink-0">Rs. {hy.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Summary Sticky Box (Right) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-emerald-600/60 p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-stone-200/70 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
                    Live Grocery Calculator
                  </span>
                  <h3 className="text-lg font-black text-stone-900 font-heading truncate">
                    {packageName}
                  </h3>
                </div>
                <span className="bg-emerald-100/90 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-200/60">
                  {allSelectedItems.length} Items
                </span>
              </div>

              {/* Items Breakdown list */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs divide-y divide-stone-100">
                {allSelectedItems.map((item, idx) => (
                  <div key={item.id || idx} className="pt-2 first:pt-0 flex items-center justify-between text-stone-700">
                    <div className="truncate pr-2">
                      <p className="font-semibold truncate">{item.productName}</p>
                      <span className="text-[11px] text-stone-400 font-medium">{item.quantity}</span>
                    </div>
                    <span className="font-black text-stone-900 shrink-0">
                      Rs. {item.estimatedPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Calculation Display */}
              <div className="bg-emerald-950/95 backdrop-blur-md text-white rounded-2xl p-4 space-y-2 border border-emerald-800/40 shadow-inner">
                <span className="text-[11px] text-emerald-300 font-semibold block uppercase tracking-wider">
                  Your Monthly Rashan Total
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-amber-300">
                    Rs. {totalCalculatedPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-200 font-medium bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/50">
                    PKR Total
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 pt-1">
                  {totalCalculatedPrice >= storeSettings.freeDeliveryThreshold ? (
                    <span className="text-emerald-300 font-bold">🎉 Free Home Delivery Unlocked for Hyderabad!</span>
                  ) : (
                    <span>🚚 Delivery available in Hyderabad only (Free on Rs. {storeSettings.freeDeliveryThreshold.toLocaleString()}+)</span>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  id="btn-add-custom-rashan-to-cart"
                  type="button"
                  onClick={handleAddCompleteRashan}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all active:scale-95 border border-emerald-500/30"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Complete Rashan to Cart</span>
                </button>

                <button
                  id="btn-whatsapp-custom-rashan"
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 px-4 bg-emerald-50/80 backdrop-blur-xs hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>

              <div className="pt-2 text-center text-[11px] text-stone-400 space-y-1">
                <p>🔒 Pay on Delivery via Cash, EasyPaisa, or JazzCash</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
