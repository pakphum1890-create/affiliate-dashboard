import React, { useState, useMemo } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  LayoutDashboard, Video, Package, Radio, Wallet,
  FileBarChart, Settings, Search, Bell, Moon, Sun, ChevronDown,
  Calendar as CalendarIcon, Handshake, TrendingUp,
  Eye, MousePointerClick, ShoppingBag, Percent, DollarSign,
  CheckCircle2, Circle, AlertCircle, Sparkles, Send,
  Plus, ArrowUpRight, ArrowDownRight, Users, Flame, Trash2, X
} from "lucide-react";

/* ---------- design tokens ---------- */
const T = {
  ink: "#0D0D12",
  paper: "#F5F5F8",
  paperDark: "#0A0A0E",
  surface: "#FFFFFF",
  surfaceDark: "#141419",
  red: "#FE2C55",
  cyan: "#22E6D9",
  orange: "#EE4D2D",
  violet: "#8B7CF6",
  line: "#E6E6EC",
  lineDark: "#26262F",
  muted: "#8A8A99",
};

const grad = `linear-gradient(90deg, ${T.red} 0%, ${T.violet} 50%, ${T.cyan} 100%)`;

const fontStyle = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
    .f-display { font-family: 'Space Grotesk', sans-serif; }
    .f-body { font-family: 'Inter', sans-serif; }
    .f-mono { font-family: 'IBM Plex Mono', monospace; }
    .glow-edge { position: relative; }
    .glow-edge::before {
      content: "";
      position: absolute; inset: -1px;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(120deg, ${T.red}, ${T.violet}, ${T.cyan});
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity .35s ease;
      pointer-events: none;
    }
    .glow-edge:hover::before, .glow-edge.is-active::before { opacity: 1; }
    .scrollbar-none::-webkit-scrollbar { display: none; }
    .row-hover:hover .row-del { opacity: 1; }
    .row-del { opacity: 0; transition: opacity .2s ease; }
    .cell-hover:hover .cell-del { opacity: 1; }
    .cell-del { opacity: 0; transition: opacity .2s ease; }
  `}</style>
);

/* ---------- mock data (initial state, all editable at runtime) ---------- */
const initialSalesTrend = [
  { d: "Jul 12", sales: 3200, commission: 480 },
  { d: "Jul 13", sales: 4100, commission: 615 },
  { d: "Jul 14", sales: 2800, commission: 420 },
  { d: "Jul 15", sales: 5200, commission: 780 },
  { d: "Jul 16", sales: 4700, commission: 705 },
  { d: "Jul 17", sales: 6100, commission: 915 },
  { d: "Jul 18", sales: 7300, commission: 1095 },
];

const monthlyRevenue = [
  { m: "Feb", rev: 12400 }, { m: "Mar", rev: 15800 }, { m: "Apr", rev: 14200 },
  { m: "May", rev: 19600 }, { m: "Jun", rev: 24100 }, { m: "Jul", rev: 27300 },
];

const funnel = [
  { stage: "Views", value: 128400, icon: Eye },
  { stage: "Clicks", value: 9600, icon: MousePointerClick },
  { stage: "Add to Cart", value: 2140, icon: ShoppingBag },
  { stage: "Orders", value: 812, icon: ShoppingBag },
];

let uid = 1000;
const nextId = () => (uid += 1);

const initialVideos = [
  { id: nextId(), title: "โอเวอร์ไซส์เซตนี้ใส่ทำงานได้จริง?", views: "42.1K", clicks: 1840, orders: 96, sales: 14400, comm: 2160, cvr: "5.2%" },
  { id: nextId(), title: "ลองไซส์ L บนคนสูง 175/65 โป๊ะแตก", views: "38.7K", clicks: 1620, orders: 88, sales: 13200, comm: 1980, cvr: "5.4%" },
  { id: nextId(), title: "รีวิวเสื้อเชิ้ตโอเวอร์ไซส์ 3 สี", views: "29.3K", clicks: 1120, orders: 51, sales: 7650, comm: 1147, cvr: "4.6%" },
  { id: nextId(), title: "แกะกล่องพรีออเดอร์ TikTok Shop", views: "21.0K", clicks: 890, orders: 34, sales: 5100, comm: 765, cvr: "3.8%" },
];

const initialProducts = [
  { id: nextId(), name: "เสื้อโอเวอร์ไซส์ คอกลม สีเบจ", cat: "เสื้อผ้าผู้ชาย", orders: 142, sales: 21300, comm: 3195, ctr: "8.1%", cvr: "6.0%", platform: "tiktok" },
  { id: nextId(), name: "กางเกงคาร์โก้ทรงกระบอก", cat: "เสื้อผ้าผู้ชาย", orders: 98, sales: 17640, comm: 2646, ctr: "6.4%", cvr: "5.1%", platform: "shopee" },
  { id: nextId(), name: "แจ็คเก็ตเดนิมโอเวอร์ไซส์", cat: "เสื้อผ้าผู้ชาย", orders: 76, sales: 15200, comm: 2280, ctr: "7.0%", cvr: "4.4%", platform: "tiktok" },
  { id: nextId(), name: "เสื้อฮู้ดผ้าหนา", cat: "เสื้อผ้าผู้ชาย", orders: 61, sales: 9150, comm: 1372, ctr: "5.5%", cvr: "3.9%", platform: "shopee" },
];

const initialSponsors = [
  { id: nextId(), brand: "Eucerin", type: "รีวิว + ปักตะกร้า", value: 8000, status: "กำลังดำเนินการ", due: "8 ส.ค." },
  { id: nextId(), brand: "Haier", type: "คลิปรีวิวเดี่ยว", value: 12000, status: "รอยืนยันสคริปต์", due: "16 ส.ค." },
];

const initialCalendar = [
  { date: 18, tag: "today" }, { date: 19, tag: "post" }, { date: 20, tag: "shoot" },
  { date: 21, tag: "edit" }, { date: 22, tag: "edit" }, { date: 23, tag: "post" },
  { date: 24, tag: "shoot" }, { date: 25, tag: "post" }, { date: 26, tag: "shoot" },
  { date: 27, tag: "post" }, { date: 28, tag: "post" }, { date: 29, tag: "post" },
  { date: 30, tag: "post" }, { date: 31, tag: "post" },
];

const tagStyle = {
  shoot: { bg: T.red, label: "ถ่าย" },
  edit: { bg: T.violet, label: "ตัดต่อ" },
  post: { bg: T.cyan, label: "โพสต์" },
  today: { bg: T.ink, label: "วันนี้" },
};

const dateRangePresets = ["12 – 18 ก.ค.", "5 – 11 ก.ค.", "1 – 31 ก.ค.", "1 – 30 มิ.ย."];

/* ---------- small building blocks ---------- */
function KpiCard({ icon: Icon, label, value, delta, positive = true, accent }) {
  return (
    <div className="glow-edge bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: T.line }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent + "1A" }}>
          <Icon size={17} color={accent} />
        </div>
        <span
          className="text-xs font-medium f-mono flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
          style={{ color: positive ? "#16A34A" : T.red, background: positive ? "#16A34A14" : T.red + "14" }}
        >
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{delta}
        </span>
      </div>
      <p className="text-xs f-body mb-1" style={{ color: T.muted }}>{label}</p>
      <p className="text-xl f-display font-semibold" style={{ color: T.ink }}>{value}</p>
    </div>
  );
}

function SectionCard({ title, subtitle, action, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border ${className}`} style={{ borderColor: T.line }}>
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <h3 className="f-display font-semibold text-sm" style={{ color: T.ink }}>{title}</h3>
          {subtitle && <p className="text-xs f-body mt-0.5" style={{ color: T.muted }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function TinyInput(props) {
  return (
    <input
      {...props}
      className={"text-xs f-body px-2.5 py-2 rounded-lg border outline-none " + (props.className || "")}
      style={{ borderColor: T.line, ...(props.style || {}) }}
    />
  );
}

function TinySelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="text-xs f-body px-2.5 py-2 rounded-lg border outline-none bg-white"
      style={{ borderColor: T.line, color: T.ink }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

const navItems = [
  { key: "overview", label: "แดชบอร์ด", icon: LayoutDashboard },
  { key: "calendar", label: "ปฏิทินงาน", icon: CalendarIcon },
  { key: "videos", label: "คลิปวิดีโอ", icon: Video },
  { key: "products", label: "สินค้า", icon: Package },
  { key: "sponsors", label: "สปอนเซอร์", icon: Handshake },
  { key: "live", label: "ไลฟ์", icon: Radio },
  { key: "reports", label: "รายงาน", icon: FileBarChart },
  { key: "settings", label: "ตั้งค่า", icon: Settings },
];

/* ---------- main ---------- */
export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [dark, setDark] = useState(false);
  const [platform, setPlatform] = useState("all");

  // lifted, editable state
  const [videoList, setVideoList] = useState(initialVideos);
  const [productList, setProductList] = useState(initialProducts);
  const [sponsorList, setSponsorList] = useState(initialSponsors);
  const [calendarList, setCalendarList] = useState(initialCalendar);

  // top bar interactivity
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [dateRangeLabel, setDateRangeLabel] = useState("12 – 18 ก.ค.");
  const [notifOpen, setNotifOpen] = useState(false);

  const filteredProducts = useMemo(
    () => (platform === "all" ? productList : productList.filter(p => p.platform === platform)),
    [platform, productList]
  );

  const bg = dark ? T.paperDark : T.paper;
  const surface = dark ? T.surfaceDark : T.surface;
  const textMain = dark ? "#F2F2F5" : T.ink;
  const border = dark ? T.lineDark : T.line;

  return (
    <div className="f-body min-h-screen flex" style={{ background: bg }}>
      {fontStyle}

      {/* Sidebar */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between sticky top-0 h-screen" style={{ background: T.ink }}>
        <div>
          <div className="flex items-center gap-2 px-5 py-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: grad }}>
              <Sparkles size={16} color="white" />
            </div>
            <span className="f-display font-semibold text-white text-sm tracking-tight">Creator<span style={{ color: T.cyan }}>OS</span></span>
          </div>
          <nav className="px-3 flex flex-col gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm f-body transition-colors"
                  style={{
                    color: active ? T.ink : "#B4B4C0",
                    background: active ? "white" : "transparent",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 m-3 rounded-xl" style={{ background: "#1C1C24" }}>
          <p className="text-xs text-white f-body mb-1">เดือนนี้ทำได้แล้ว</p>
          <p className="text-lg f-display font-semibold text-white">฿27,300</p>
          <div className="w-full h-1.5 rounded-full mt-2" style={{ background: "#2C2C36" }}>
            <div className="h-1.5 rounded-full" style={{ width: "68%", background: grad }} />
          </div>
          <p className="text-[11px] mt-1.5" style={{ color: T.muted }}>68% ของเป้า ฿40,000</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top navbar */}
        <div
          className="sticky top-0 z-20 flex items-center gap-3 px-5 py-3 border-b backdrop-blur"
          style={{ background: surface + "F2", borderColor: border }}
        >
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: bg }}>
            <Search size={15} color={T.muted} />
            <input
              placeholder="ค้นหาคลิป, สินค้า, ออเดอร์..."
              className="bg-transparent text-sm outline-none flex-1 f-body"
              style={{ color: textMain }}
            />
          </div>

          <div className="relative hidden sm:block">
            <button
              onClick={() => { setDateRangeOpen(o => !o); setNotifOpen(false); }}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border f-body"
              style={{ borderColor: border, color: textMain }}
            >
              <CalendarIcon size={13} /> {dateRangeLabel} <ChevronDown size={13} />
            </button>
            {dateRangeOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border shadow-lg overflow-hidden z-30" style={{ borderColor: T.line }}>
                {dateRangePresets.map(p => (
                  <button
                    key={p}
                    onClick={() => { setDateRangeLabel(p); setDateRangeOpen(false); }}
                    className="w-full text-left text-xs f-body px-3 py-2.5 hover:bg-gray-50"
                    style={{ color: p === dateRangeLabel ? T.red : T.ink, fontWeight: p === dateRangeLabel ? 600 : 400 }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setNotifOpen(o => !o); setDateRangeOpen(false); }}
              className="w-9 h-9 rounded-xl border flex items-center justify-center relative"
              style={{ borderColor: border }}
            >
              <Bell size={15} color={textMain} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: T.red }} />
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border shadow-lg p-3 z-30 flex flex-col gap-3" style={{ borderColor: T.line }}>
                <NotifRow icon={CheckCircle2} color="#16A34A" text="ออเดอร์ #4821 สำเร็จแล้ว" time="10 นาทีที่แล้ว" />
                <NotifRow icon={AlertCircle} color={T.orange} text="สต๊อกเสื้อเบจเหลือน้อย" time="1 ชม.ที่แล้ว" />
                <NotifRow icon={Handshake} color={T.violet} text="Haier ส่งบรีฟสปอนเซอร์มาใหม่" time="3 ชม.ที่แล้ว" />
              </div>
            )}
          </div>

          <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-xl border flex items-center justify-center" style={{ borderColor: border }}>
            {dark ? <Sun size={15} color={textMain} /> : <Moon size={15} color={textMain} />}
          </button>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs f-display font-semibold" style={{ background: grad }}>
            คบ
          </div>
        </div>

        <div className="p-5 max-w-7xl mx-auto">
          {tab === "overview" && (
            <OverviewTab textMain={textMain} border={border} videoList={videoList} productList={productList} />
          )}
          {tab === "calendar" && (
            <CalendarTab calendarList={calendarList} setCalendarList={setCalendarList} />
          )}
          {tab === "videos" && (
            <VideosTab videoList={videoList} setVideoList={setVideoList} border={border} />
          )}
          {tab === "products" && (
            <ProductsTab
              border={border}
              platform={platform} setPlatform={setPlatform}
              filteredProducts={filteredProducts}
              setProductList={setProductList}
            />
          )}
          {tab === "sponsors" && (
            <SponsorsTab border={border} sponsorList={sponsorList} setSponsorList={setSponsorList} />
          )}
          {tab === "live" && <LiveTab />}
          {(tab === "reports" || tab === "settings") && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="f-display font-semibold text-lg" style={{ color: textMain }}>เร็ว ๆ นี้</p>
              <p className="text-sm mt-1" style={{ color: T.muted }}>ส่วนนี้กำลังพัฒนาอยู่</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Overview ---------- */
function OverviewTab({ textMain, border, videoList, productList }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div>
          <h1 className="f-display font-semibold text-xl" style={{ color: textMain }}>สวัสดีตอนบ่าย 👋</h1>
          <p className="text-sm" style={{ color: T.muted }}>ภาพรวมช่องแอฟฟิลิเอทของนายวันนี้</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard icon={DollarSign} label="ยอดขายวันนี้" value="฿7,300" delta="+18.9%" accent={T.red} />
          <KpiCard icon={Wallet} label="คอมมิชชั่นเดือนนี้" value="฿5,712" delta="+12.4%" accent={T.violet} />
          <KpiCard icon={ShoppingBag} label="ออเดอร์รวม" value="269" delta="+7.1%" accent={T.cyan} />
          <KpiCard icon={MousePointerClick} label="คลิกทั้งหมด" value="9,600" delta="-2.3%" positive={false} accent={T.orange} />
          <KpiCard icon={Percent} label="Conversion Rate" value="8.5%" delta="+0.6%" accent={T.red} />
          <KpiCard icon={TrendingUp} label="มูลค่าออเดอร์เฉลี่ย" value="฿480" delta="+3.2%" accent={T.violet} />
          <KpiCard icon={Eye} label="ยอดวิวรวม" value="128.4K" delta="+21.0%" accent={T.cyan} />
          <KpiCard icon={FileBarChart} label="ยอดขายเดือนนี้" value="฿27,300" delta="+15.7%" accent={T.orange} />
        </div>

        <SectionCard title="แนวโน้มยอดขาย" subtitle="7 วันล่าสุด · TikTok + Shopee">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={initialSalesTrend}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.red} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={T.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={border} vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${border}`, fontSize: 12 }} />
              <Area type="monotone" dataKey="sales" stroke={T.red} strokeWidth={2} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SectionCard title="คอมมิชชั่นรายวัน">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={initialSalesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={border} vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${border}`, fontSize: 12 }} />
                <Line type="monotone" dataKey="commission" stroke={T.violet} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>
          <SectionCard title="รายได้รายเดือน">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke={border} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${border}`, fontSize: 12 }} />
                <Bar dataKey="rev" fill={T.cyan} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        <SectionCard title="Sales Funnel" subtitle="จากยอดวิวสู่ออเดอร์">
          <div className="flex flex-col gap-2">
            {funnel.map((f, i) => {
              const pct = (f.value / funnel[0].value) * 100;
              const Icon = f.icon;
              return (
                <div key={f.stage} className="flex items-center gap-3">
                  <div className="w-24 flex items-center gap-1.5 text-xs f-body" style={{ color: T.muted }}>
                    <Icon size={13} /> {f.stage}
                  </div>
                  <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: T.paper }}>
                    <div
                      className="h-full rounded-lg flex items-center px-3 text-xs f-mono text-white font-medium"
                      style={{ width: pct + "%", background: [T.red, T.violet, T.orange, T.cyan][i], minWidth: 70 }}
                    >
                      {f.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* right rail */}
      <div className="flex flex-col gap-4">
        <BotGuideCard />
        <SectionCard title="สินค้าขายดี">
          <div className="flex flex-col gap-3">
            {productList.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg shrink-0" style={{ background: `linear-gradient(135deg, ${T.red}22, ${T.cyan}22)` }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs f-body font-medium truncate" style={{ color: T.ink }}>{p.name}</p>
                  <p className="text-[11px]" style={{ color: T.muted }}>{p.orders} ออเดอร์</p>
                </div>
                <span className="text-xs f-mono font-medium" style={{ color: T.ink }}>฿{p.comm.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="คลิปที่มาแรง">
          <div className="flex flex-col gap-3">
            {videoList.slice(0, 3).map(v => (
              <div key={v.id} className="flex items-center gap-2">
                <Flame size={14} color={T.red} className="shrink-0" />
                <p className="text-xs f-body truncate flex-1" style={{ color: T.ink }}>{v.title}</p>
                <span className="text-[11px] f-mono" style={{ color: T.muted }}>{v.views}</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="แจ้งเตือนล่าสุด">
          <div className="flex flex-col gap-3 text-xs f-body">
            <NotifRow icon={CheckCircle2} color="#16A34A" text="ออเดอร์ #4821 สำเร็จแล้ว" time="10 นาทีที่แล้ว" />
            <NotifRow icon={AlertCircle} color={T.orange} text="สต๊อกเสื้อเบจเหลือน้อย" time="1 ชม.ที่แล้ว" />
            <NotifRow icon={Handshake} color={T.violet} text="Haier ส่งบรีฟสปอนเซอร์มาใหม่" time="3 ชม.ที่แล้ว" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function NotifRow({ icon: Icon, color, text, time }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} color={color} className="mt-0.5 shrink-0" />
      <div>
        <p style={{ color: T.ink }}>{text}</p>
        <p style={{ color: T.muted }} className="text-[11px]">{time}</p>
      </div>
    </div>
  );
}

function BotGuideCard() {
  const tasks = [
    { label: "ถ่ายคลิปวันนี้", value: "3 คลิป", done: false },
    { label: "สั่งของรอบใหม่", value: "5 ชิ้น", done: false },
    { label: "ตอบคอมเมนต์ค้าง", value: "12 รายการ", done: true },
  ];
  return (
    <div className="glow-edge is-active rounded-2xl p-5 text-white shadow-sm" style={{ background: T.ink }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: grad }}>
          <Sparkles size={13} />
        </div>
        <p className="f-display font-semibold text-sm">บอทไกด์ประจำวัน</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {tasks.map(t => (
          <div key={t.label} className="flex items-center justify-between text-xs f-body">
            <div className="flex items-center gap-2">
              {t.done ? <CheckCircle2 size={14} color={T.cyan} /> : <Circle size={14} color="#5A5A66" />}
              <span style={{ color: t.done ? "#8A8A99" : "white", textDecoration: t.done ? "line-through" : "none" }}>{t.label}</span>
            </div>
            <span className="f-mono" style={{ color: T.cyan }}>{t.value}</span>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 rounded-xl text-xs f-body font-medium flex items-center justify-center gap-1.5" style={{ background: "#1C1C24" }}>
        ดูงานทั้งหมด <ArrowUpRight size={13} />
      </button>
    </div>
  );
}

/* ---------- Calendar (editable) ---------- */
function CalendarTab({ calendarList, setCalendarList }) {
  const [newDate, setNewDate] = useState("");
  const [newTag, setNewTag] = useState("shoot");

  const byDate = useMemo(() => {
    const m = {};
    calendarList.forEach(c => { m[c.date] = c.tag; });
    return m;
  }, [calendarList]);

  const addEntry = () => {
    const d = parseInt(newDate, 10);
    if (!d || d < 1 || d > 31) return;
    setCalendarList(prev => [...prev.filter(c => c.date !== d), { date: d, tag: newTag }]);
    setNewDate("");
  };

  const removeEntry = (date) => {
    setCalendarList(prev => prev.filter(c => c.date !== date));
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3">
        <SectionCard
          title="ปฏิทินคอนเทนต์ · กรกฎาคม"
          subtitle="แตะ + เพื่อเพิ่ม แตะไอคอนถังขยะเพื่อลบ"
          action={
            <div className="flex items-center gap-1.5">
              <TinyInput type="number" min="1" max="31" placeholder="วันที่" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ width: 64 }} />
              <TinySelect
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                options={[
                  { value: "shoot", label: "ถ่าย" },
                  { value: "edit", label: "ตัดต่อ" },
                  { value: "post", label: "โพสต์" },
                  { value: "today", label: "วันนี้" },
                ]}
              />
              <button onClick={addEntry} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: T.ink }}>
                <Plus size={14} />
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-7 gap-2">
            {days.map(date => {
              const tag = byDate[date];
              const s = tag ? tagStyle[tag] : null;
              return (
                <div
                  key={date}
                  className="cell-hover relative rounded-xl p-2.5 flex flex-col justify-between h-20 border"
                  style={{ borderColor: tag === "today" ? T.ink : T.line, borderWidth: tag === "today" ? 1.5 : 1 }}
                >
                  {tag && (
                    <button
                      onClick={() => removeEntry(date)}
                      className="cell-del absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: T.line }}
                    >
                      <X size={9} color={T.ink} />
                    </button>
                  )}
                  <span className="text-xs f-mono" style={{ color: T.ink }}>{date}</span>
                  {s && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md self-start text-white f-body" style={{ background: s.bg }}>
                      {s.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
      <div className="flex flex-col gap-4">
        <BotGuideCard />
        <SectionCard title="สรุปสัปดาห์นี้">
          <div className="flex flex-col gap-3 text-xs f-body">
            <div className="flex justify-between"><span style={{ color: T.muted }}>วันถ่ายคลิป</span><span className="f-mono" style={{ color: T.ink }}>{calendarList.filter(c => c.tag === "shoot").length} วัน</span></div>
            <div className="flex justify-between"><span style={{ color: T.muted }}>วันตัดต่อ</span><span className="f-mono" style={{ color: T.ink }}>{calendarList.filter(c => c.tag === "edit").length} วัน</span></div>
            <div className="flex justify-between"><span style={{ color: T.muted }}>วันโพสต์คิว</span><span className="f-mono" style={{ color: T.ink }}>{calendarList.filter(c => c.tag === "post").length} วัน</span></div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- Videos (editable) ---------- */
function VideosTab({ videoList, setVideoList, border }) {
  const empty = { title: "", views: "", clicks: "", orders: "", sales: "", comm: "", cvr: "" };
  const [form, setForm] = useState(empty);

  const addVideo = () => {
    if (!form.title.trim()) return;
    setVideoList(prev => [
      {
        id: nextId(),
        title: form.title,
        views: form.views || "0",
        clicks: Number(form.clicks) || 0,
        orders: Number(form.orders) || 0,
        sales: Number(form.sales) || 0,
        comm: Number(form.comm) || 0,
        cvr: form.cvr || "0%",
      },
      ...prev,
    ]);
    setForm(empty);
  };

  const removeVideo = (id) => setVideoList(prev => prev.filter(v => v.id !== id));

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="เพิ่มคลิปใหม่" subtitle="กรอกผลงานแล้วกดเพิ่มลงตาราง">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <TinyInput placeholder="ชื่อคลิป" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="col-span-2 lg:col-span-2" />
          <TinyInput placeholder="วิว เช่น 12.3K" value={form.views} onChange={e => setForm({ ...form, views: e.target.value })} />
          <TinyInput placeholder="คลิก" type="number" value={form.clicks} onChange={e => setForm({ ...form, clicks: e.target.value })} />
          <TinyInput placeholder="ออเดอร์" type="number" value={form.orders} onChange={e => setForm({ ...form, orders: e.target.value })} />
          <TinyInput placeholder="ยอดขาย ฿" type="number" value={form.sales} onChange={e => setForm({ ...form, sales: e.target.value })} />
          <TinyInput placeholder="คอมมิชชั่น ฿" type="number" value={form.comm} onChange={e => setForm({ ...form, comm: e.target.value })} />
        </div>
        <button onClick={addVideo} className="mt-3 text-xs f-body font-medium text-white px-4 py-2 rounded-xl flex items-center gap-1.5" style={{ background: T.ink }}>
          <Plus size={13} /> เพิ่มคลิป
        </button>
      </SectionCard>

      <SectionCard title="ผลงานคลิปวิดีโอ" subtitle="เรียงตามที่เพิ่มล่าสุดก่อน">
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-xs f-body">
            <thead>
              <tr style={{ color: T.muted }} className="text-left border-b">
                <th className="py-2 pr-3 font-medium">คลิป</th>
                <th className="py-2 pr-3 font-medium">วิว</th>
                <th className="py-2 pr-3 font-medium">คลิก</th>
                <th className="py-2 pr-3 font-medium">ออเดอร์</th>
                <th className="py-2 pr-3 font-medium">ยอดขาย</th>
                <th className="py-2 pr-3 font-medium">คอมมิชชั่น</th>
                <th className="py-2 pr-3 font-medium">CVR</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {videoList.map(v => (
                <tr key={v.id} className="row-hover border-b last:border-0" style={{ borderColor: border }}>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg shrink-0" style={{ background: `linear-gradient(135deg, ${T.red}33, ${T.violet}33)` }} />
                      <span className="font-medium max-w-[220px] truncate" style={{ color: T.ink }}>{v.title}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3 f-mono" style={{ color: T.ink }}>{v.views}</td>
                  <td className="py-3 pr-3 f-mono" style={{ color: T.ink }}>{v.clicks.toLocaleString()}</td>
                  <td className="py-3 pr-3 f-mono" style={{ color: T.ink }}>{v.orders}</td>
                  <td className="py-3 pr-3 f-mono" style={{ color: T.ink }}>฿{v.sales.toLocaleString()}</td>
                  <td className="py-3 pr-3 f-mono font-medium" style={{ color: T.red }}>฿{v.comm.toLocaleString()}</td>
                  <td className="py-3 pr-3 f-mono" style={{ color: T.ink }}>{v.cvr}</td>
                  <td className="py-3">
                    <button onClick={() => removeVideo(v.id)} className="row-del w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: T.red + "14" }}>
                      <Trash2 size={13} color={T.red} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------- Products (editable) ---------- */
function ProductsTab({ border, platform, setPlatform, filteredProducts, setProductList }) {
  const [budget, setBudget] = useState("");
  const empty = { name: "", orders: "", sales: "", comm: "", ctr: "", cvr: "", platform: "tiktok" };
  const [form, setForm] = useState(empty);

  const addProduct = () => {
    if (!form.name.trim()) return;
    setProductList(prev => [
      {
        id: nextId(),
        name: form.name,
        cat: "เสื้อผ้าผู้ชาย",
        orders: Number(form.orders) || 0,
        sales: Number(form.sales) || 0,
        comm: Number(form.comm) || 0,
        ctr: form.ctr || "0%",
        cvr: form.cvr || "0%",
        platform: form.platform,
      },
      ...prev,
    ]);
    setForm(empty);
  };

  const removeProduct = (id) => setProductList(prev => prev.filter(p => p.id !== id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {[["all", "ทั้งหมด"], ["tiktok", "TikTok Shop"], ["shopee", "Shopee"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPlatform(key)}
              className="text-xs f-body px-3 py-1.5 rounded-full border"
              style={{
                borderColor: platform === key ? T.ink : border,
                background: platform === key ? T.ink : "white",
                color: platform === key ? "white" : T.ink,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <SectionCard title="เพิ่มสินค้าใหม่">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <TinyInput placeholder="ชื่อสินค้า" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="col-span-2" />
            <TinyInput placeholder="ออเดอร์" type="number" value={form.orders} onChange={e => setForm({ ...form, orders: e.target.value })} />
            <TinyInput placeholder="ยอดขาย ฿" type="number" value={form.sales} onChange={e => setForm({ ...form, sales: e.target.value })} />
            <TinyInput placeholder="คอมมิชชั่น ฿" type="number" value={form.comm} onChange={e => setForm({ ...form, comm: e.target.value })} />
            <TinySelect
              value={form.platform}
              onChange={e => setForm({ ...form, platform: e.target.value })}
              options={[{ value: "tiktok", label: "TikTok" }, { value: "shopee", label: "Shopee" }]}
            />
          </div>
          <button onClick={addProduct} className="mt-3 text-xs f-body font-medium text-white px-4 py-2 rounded-xl flex items-center gap-1.5" style={{ background: T.ink }}>
            <Plus size={13} /> เพิ่มสินค้า
          </button>
        </SectionCard>

        <SectionCard title="ผลงานสินค้า">
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-xs f-body">
              <thead>
                <tr style={{ color: T.muted }} className="text-left border-b">
                  <th className="py-2 pr-3 font-medium">สินค้า</th>
                  <th className="py-2 pr-3 font-medium">แพลตฟอร์ม</th>
                  <th className="py-2 pr-3 font-medium">ออเดอร์</th>
                  <th className="py-2 pr-3 font-medium">ยอดขาย</th>
                  <th className="py-2 pr-3 font-medium">คอมมิชชั่น</th>
                  <th className="py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id} className="row-hover border-b last:border-0" style={{ borderColor: border }}>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg shrink-0" style={{ background: `linear-gradient(135deg, ${T.orange}33, ${T.cyan}33)` }} />
                        <span className="font-medium max-w-[200px] truncate" style={{ color: T.ink }}>{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-md text-white" style={{ background: p.platform === "tiktok" ? T.ink : T.orange }}>
                        {p.platform === "tiktok" ? "TikTok" : "Shopee"}
                      </span>
                    </td>
                    <td className="py-3 pr-3 f-mono" style={{ color: T.ink }}>{p.orders}</td>
                    <td className="py-3 pr-3 f-mono" style={{ color: T.ink }}>฿{p.sales.toLocaleString()}</td>
                    <td className="py-3 pr-3 f-mono font-medium" style={{ color: T.red }}>฿{p.comm.toLocaleString()}</td>
                    <td className="py-3">
                      <button onClick={() => removeProduct(p.id)} className="row-del w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: T.red + "14" }}>
                        <Trash2 size={13} color={T.red} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-4">
        <SectionCard title="ขอตัวอย่างสินค้า" subtitle="ส่งคำขอตัวอย่างจากแบรนด์">
          <div className="flex flex-col gap-2.5">
            <TinyInput placeholder="ชื่อสินค้าที่อยากขอ" />
            <textarea placeholder="เหตุผล / ไซส์ / สี ที่ต้องการ" rows={3} className="text-xs f-body px-3 py-2.5 rounded-xl border outline-none resize-none" style={{ borderColor: border }} />
            <button className="text-xs f-body font-medium text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5" style={{ background: T.ink }}>
              <Send size={13} /> ส่งคำขอตัวอย่าง
            </button>
          </div>
        </SectionCard>

        <SectionCard title="ซื้อสินค้าปักตะกร้า" subtitle="จ่ายเพื่อสั่งสินค้ามาถ่ายคลิปเอง">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ borderColor: border }}>
              <span className="text-xs f-mono" style={{ color: T.muted }}>฿</span>
              <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="0" className="text-xs f-mono outline-none flex-1" />
            </div>
            <div className="flex gap-2">
              {[500, 1000, 2000].map(v => (
                <button key={v} onClick={() => setBudget(String(v))} className="flex-1 text-xs f-mono py-1.5 rounded-lg border" style={{ borderColor: border, color: T.ink }}>
                  ฿{v}
                </button>
              ))}
            </div>
            <button className="text-xs f-body font-medium text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5" style={{ background: grad }}>
              <Plus size={13} /> ยืนยันการสั่งซื้อ
            </button>
          </div>
        </SectionCard>

        <SectionCard title="สถิติการคลิกตะกร้า" subtitle="เชื่อมกับ TikTok Shop + Shopee">
          <div className="flex flex-col gap-3 text-xs f-body">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5" style={{ color: T.muted }}><span className="w-2 h-2 rounded-full" style={{ background: T.ink }} />TikTok Shop</span>
              <span className="f-mono font-medium" style={{ color: T.ink }}>6,120 คลิก</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5" style={{ color: T.muted }}><span className="w-2 h-2 rounded-full" style={{ background: T.orange }} />Shopee</span>
              <span className="f-mono font-medium" style={{ color: T.ink }}>3,480 คลิก</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- Sponsors (editable, kept separate from affiliate) ---------- */
function SponsorsTab({ border, sponsorList, setSponsorList }) {
  const empty = { brand: "", type: "", value: "", status: "กำลังดำเนินการ", due: "" };
  const [form, setForm] = useState(empty);

  const addSponsor = () => {
    if (!form.brand.trim()) return;
    setSponsorList(prev => [
      { id: nextId(), brand: form.brand, type: form.type || "-", value: Number(form.value) || 0, status: form.status, due: form.due || "-" },
      ...prev,
    ]);
    setForm(empty);
  };

  const removeSponsor = (id) => setSponsorList(prev => prev.filter(s => s.id !== id));

  const totalSponsor = sponsorList.reduce((a, s) => a + s.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <SectionCard title="เพิ่มดีลสปอนเซอร์">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <TinyInput placeholder="แบรนด์" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
            <TinyInput placeholder="ประเภทงาน" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
            <TinyInput placeholder="มูลค่า ฿" type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
            <TinyInput placeholder="กำหนดส่งงาน" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} />
          </div>
          <button onClick={addSponsor} className="mt-3 text-xs f-body font-medium text-white px-4 py-2 rounded-xl flex items-center gap-1.5" style={{ background: T.violet }}>
            <Plus size={13} /> เพิ่มดีล
          </button>
        </SectionCard>

        <SectionCard
          title="งานสปอนเซอร์"
          subtitle="แยกจากรายได้แอฟฟิลิเอทโดยเฉพาะ"
          action={<span className="text-[11px] px-2.5 py-1 rounded-full f-body" style={{ background: T.violet + "1A", color: T.violet }}>{sponsorList.length} ดีล</span>}
        >
          <div className="flex flex-col gap-3">
            {sponsorList.map(s => (
              <div key={s.id} className="row-hover flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: border }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center f-display font-semibold text-white" style={{ background: T.violet }}>
                    {s.brand[0]}
                  </div>
                  <div>
                    <p className="text-sm f-body font-medium" style={{ color: T.ink }}>{s.brand}</p>
                    <p className="text-[11px]" style={{ color: T.muted }}>{s.type} · ส่งงาน {s.due}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm f-mono font-semibold" style={{ color: T.ink }}>฿{s.value.toLocaleString()}</p>
                    <p className="text-[11px]" style={{ color: T.violet }}>{s.status}</p>
                  </div>
                  <button onClick={() => removeSponsor(s.id)} className="row-del w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: T.red + "14" }}>
                    <Trash2 size={13} color={T.red} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <SectionCard title="รายได้แยกประเภท">
        <div className="flex flex-col gap-3 text-xs f-body">
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: T.red + "0F" }}>
            <span style={{ color: T.ink }}>คอมมิชชั่นแอฟฟิลิเอท</span>
            <span className="f-mono font-semibold" style={{ color: T.red }}>฿5,712</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: T.violet + "0F" }}>
            <span style={{ color: T.ink }}>ค่าจ้างสปอนเซอร์</span>
            <span className="f-mono font-semibold" style={{ color: T.violet }}>฿{totalSponsor.toLocaleString()}</span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------- Live ---------- */
function LiveTab() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="glow-edge is-active">
        <KpiCard icon={Radio} label="ไลฟ์ทั้งหมด" value="14 ครั้ง" delta="+3" accent={T.red} />
      </div>
      <KpiCard icon={DollarSign} label="ยอดขายจากไลฟ์" value="฿9,840" delta="+22%" accent={T.violet} />
      <KpiCard icon={Users} label="ผู้ชมเฉลี่ย" value="312" delta="+9%" accent={T.cyan} />
      <KpiCard icon={TrendingUp} label="ผู้ชมสูงสุด" value="1,204" delta="+15%" accent={T.orange} />
    </div>
  );
}
