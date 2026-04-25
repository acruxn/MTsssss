interface Product {
  name: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  badgeColor: string;
  bg: string;
}

const ESHOP_PRODUCTS: Product[] = [
  { name: "Pokemon TNG LED Card Pikachu", price: "RM35.00", badge: "Limited", badgeColor: "bg-red-500", bg: "from-yellow-400 to-amber-500" },
  { name: "TNG Card Riang Ria Raya", price: "RM25.00", badge: "Limited", badgeColor: "bg-red-500", bg: "from-green-400 to-emerald-600" },
];

const FOOD_PRODUCTS: Product[] = [
  { name: "AJ Grape Crystal Jasmine Tea", price: "RM11.99", oldPrice: "RM16.90", badge: "New", badgeColor: "bg-green-500", bg: "from-purple-300 to-purple-500" },
  { name: "AJ White Peach Oolong Fresh Milk Tea", price: "RM7.99", oldPrice: "RM13.90", badge: "New", badgeColor: "bg-green-500", bg: "from-orange-300 to-orange-500" },
];

const VOUCHER_PRODUCTS: Product[] = [
  { name: "CL RM5 VOUCHER HAIR WASH", price: "RM0.01", oldPrice: "RM5.00", badge: "New", badgeColor: "bg-green-500", bg: "from-gray-600 to-gray-800" },
  { name: "CMGO 3 month Package", price: "RM29.99", oldPrice: "RM44.97", badge: "New", badgeColor: "bg-green-500", bg: "from-slate-700 to-slate-900" },
];

function ProductCard({ p }: { p: Product }) {
  return (
    <div className="min-w-[160px] max-w-[180px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
      <div className={`relative h-[140px] bg-gradient-to-br ${p.bg} flex items-center justify-center`}>
        <span className="text-white/80 text-xs font-medium text-center px-3 leading-tight">{p.name}</span>
        {p.badge && (
          <span className={`absolute top-2 right-2 ${p.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
            {p.badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-[#1E293B] font-medium leading-tight line-clamp-2 h-8">{p.name}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-[#0066FF]">{p.price}</span>
          {p.oldPrice && <span className="text-[10px] text-gray-400 line-through">{p.oldPrice}</span>}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, onViewMore }: { icon: React.ReactNode; title: string; onViewMore?: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-bold text-[#1E293B]">{title}</span>
      </div>
      {onViewMore && (
        <button onClick={onViewMore} className="text-[#0066FF] text-sm font-medium">View more</button>
      )}
    </div>
  );
}

function HScrollRow({ products }: { products: Product[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide">
      {products.map((p) => <ProductCard key={p.name} p={p} />)}
    </div>
  );
}

export default function EShop({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="bg-[#F5F5F5] min-h-full">
      {/* Header */}
      <div className="bg-[#0066FF] flex items-center px-4 py-3 gap-3">
        <button onClick={() => onNavigate("/")} className="text-white" aria-label="Back">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white font-bold text-lg flex-1">eShop</h1>
        <button className="text-white" aria-label="Menu">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* Banner */}
      <img src="/tng/eshop-banner.jpg" alt="eShop banner" className="w-full h-auto" />

      {/* Tab row */}
      <div className="flex bg-white mx-4 mt-4 rounded-xl overflow-hidden shadow-sm">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#1E293B]">
          <img src="/tng/nm_icon_shop_bag.svg" alt="" className="w-5 h-5" />
          My Orders
        </button>
        <div className="w-px bg-gray-200" />
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-300" disabled>
          <img src="/tng/nm_voucher_shopping_cart.svg" alt="" className="w-5 h-5 opacity-30" />
          Coming Soon
        </button>
      </div>

      {/* eShop section */}
      <div className="mt-6">
        <SectionHeader
          icon={<img src="/tng/app-icon-square.png" alt="TNG" className="w-8 h-8 rounded" />}
          title="eShop"
          onViewMore={() => {}}
        />
        <HScrollRow products={ESHOP_PRODUCTS} />
      </div>

      {/* Food & Beverage */}
      <div className="mt-2">
        <SectionHeader
          icon={
            <div className="w-8 h-8 bg-[#0066FF] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
              </svg>
            </div>
          }
          title="Food & Beverage"
          onViewMore={() => {}}
        />
        <HScrollRow products={FOOD_PRODUCTS} />
      </div>

      {/* Other Vouchers */}
      <div className="mt-2 pb-6">
        <SectionHeader
          icon={<img src="/tng/app-icon-square.png" alt="TNG" className="w-8 h-8 rounded" />}
          title="Other Vouchers"
          onViewMore={() => {}}
        />
        <HScrollRow products={VOUCHER_PRODUCTS} />
      </div>
    </div>
  );
}
