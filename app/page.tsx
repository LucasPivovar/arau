"use client";

import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Battery,
  Bell,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Home,
  Layers,
  MapPin,
  Menu,
  MoreVertical,
  Paperclip,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Route,
  Search,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  Truck,
  User,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

// ==========================================
// TYPES
// ==========================================
type Role = "prefeitura" | "cidadao" | "equipe" | "frota";
type Section = "overview" | "map" | "occurrences" | "fleet" | "teams" | "reports" | "settings";

interface NavItem {
  id: Section;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Visão Geral", icon: Home },
  { id: "map", label: "Mapa", icon: MapPin },
  { id: "occurrences", label: "Ocorrências", icon: ClipboardList },
  { id: "fleet", label: "Frota & IA", icon: Truck },
  { id: "teams", label: "Equipes", icon: Users },
  { id: "reports", label: "Relatórios", icon: BarChart3 },
  { id: "settings", label: "Configurações", icon: Settings },
];

interface Occurrence {
  id: string;
  protocol?: string;
  title: string;
  category: string;
  neighborhood: string;
  address?: string;
  priority: "Urgente" | "Alta" | "Média" | "Baixa" | "Normal";
  status: "Nova" | "Em triagem" | "Encaminhada" | "Em andamento" | "Em execução" | "Resolvida" | "Aberta";
  image: string;
  sla: string;
  source: string;
  date: string;
  time?: string;
  description?: string;
  assignedTeam?: string;
  expectedDate?: string;
  confirmationsCount?: number;
  aiConfidence?: string;
  photosCount?: number;
}

interface KanbanColumn {
  title: "Nova" | "Em triagem" | "Encaminhada" | "Em execução" | "Resolvida";
  count: number;
  color: string;
  items: Occurrence[];
}

// Initial Mock Occurrences Matching Reference Designs
const initialOccurrences: Occurrence[] = [
  {
    id: "#98542",
    protocol: "PROTO-2025-0098542",
    title: "Buraco na via",
    category: "Buracos",
    neighborhood: "Iguaçu",
    address: "Rua Pedro Druszcz, 45 - Iguaçu, Araucária - PR",
    priority: "Alta",
    status: "Nova",
    image: "IMG_5573.PNG",
    sla: "3 dias",
    source: "Cidadão (App)",
    date: "18/05/2025",
    time: "09:18",
    description: "Buraco grande na via, oferecendo risco de acidentes para veículos e motos.",
    assignedTeam: "Equipe: Obras",
    expectedDate: "21/05/2025",
    confirmationsCount: 12,
    aiConfidence: "96%",
    photosCount: 2,
  },
  {
    id: "#98540",
    protocol: "PROTO-2025-0098540",
    title: "Iluminação pública",
    category: "Iluminação",
    neighborhood: "Costeira",
    address: "Rua das Araucárias, 1.245 - Costeira, Araucária - PR",
    priority: "Média",
    status: "Em triagem",
    image: "IMG_5576.PNG",
    sla: "5 dias",
    source: "IA - Veículo 03",
    date: "18/05/2025",
    time: "06:15",
    description: "Lâmpada queimada no poste em frente à padaria, rua escura.",
    assignedTeam: "Equipe: Iluminação 01",
    expectedDate: "23/05/2025",
    confirmationsCount: 8,
    aiConfidence: "94%",
    photosCount: 1,
  },
  {
    id: "#98533",
    protocol: "PROTO-2025-0098533",
    title: "Entulho em via pública",
    category: "Limpeza",
    neighborhood: "Thomaz Coelho",
    address: "Rua das Flores, 890 - Thomaz Coelho, Araucária - PR",
    priority: "Média",
    status: "Encaminhada",
    image: "IMG_5572.PNG",
    sla: "4 dias",
    source: "Cidadão (App)",
    date: "18/05/2025",
    time: "07:21",
    description: "Restos de materiais de construção e podas descartados irregularmente.",
    assignedTeam: "Equipe: Limpeza 03",
    expectedDate: "22/05/2025",
    confirmationsCount: 4,
    aiConfidence: "89%",
    photosCount: 1,
  },
  {
    id: "#98528",
    protocol: "PROTO-2025-0098528",
    title: "Recapeamento",
    category: "Buracos",
    neighborhood: "Barra do Aricanduva",
    address: "Av. das Nações, 1.400 - Barra do Aricanduva, Araucária - PR",
    priority: "Média",
    status: "Em execução",
    image: "IMG_5570.PNG",
    sla: "8 dias",
    source: "IA - Veículo 01",
    date: "17/05/2025",
    time: "14:30",
    description: "Trecho crítico necessitando de fresagem e aplicação de asfalto novo.",
    assignedTeam: "Equipe: Obras 02",
    expectedDate: "25/05/2025",
    confirmationsCount: 19,
    aiConfidence: "95%",
    photosCount: 3,
  },
  {
    id: "#98518",
    protocol: "PROTO-2025-0098518",
    title: "Buracos",
    category: "Buracos",
    neighborhood: "Centro",
    address: "Rua João Pessoa, 112 - Centro, Araucária - PR",
    priority: "Baixa",
    status: "Resolvida",
    image: "IMG_5575.PNG",
    sla: "Resolvida em 2 dias",
    source: "IA - Veículo 07",
    date: "16/05/2025",
    time: "11:20",
    description: "Tapa-buraco executado e compactado com sucesso pela equipe municipal.",
    assignedTeam: "Equipe: Obras 01",
    expectedDate: "Concluído",
    confirmationsCount: 15,
    aiConfidence: "98%",
    photosCount: 2,
  },
  {
    id: "#98561",
    protocol: "PROTO-2025-0098561",
    title: "Placas",
    category: "Placas",
    neighborhood: "Centro",
    address: "Av. Victor do Amaral, 720 - Centro, Araucária - PR",
    priority: "Média",
    status: "Nova",
    image: "IMG_5570.PNG",
    sla: "5 dias",
    source: "Cidadão (App)",
    date: "18/05/2025",
    time: "08:47",
    description: "Placa de 'Pare' amassada e inclinada para a calçada.",
    assignedTeam: "Equipe: Trânsito 01",
    expectedDate: "23/05/2025",
    confirmationsCount: 5,
    aiConfidence: "91%",
    photosCount: 1,
  },
  {
    id: "#98539",
    protocol: "PROTO-2025-0098539",
    title: "Calçada irregular",
    category: "Calçadas",
    neighborhood: "Fazenda Velha",
    address: "Rua Santa Catarina, 450 - Fazenda Velha, Araucária - PR",
    priority: "Baixa",
    status: "Em triagem",
    image: "IMG_5575.PNG",
    sla: "7 dias",
    source: "Cidadão (Web)",
    date: "18/05/2025",
    time: "07:52",
    description: "Lajotas quebradas oferecendo risco de tropeço aos pedestres.",
    assignedTeam: "Equipe: Urbanismo",
    expectedDate: "25/05/2025",
    confirmationsCount: 7,
    aiConfidence: "87%",
    photosCount: 2,
  },
  {
    id: "#98566",
    protocol: "PROTO-2025-0098566",
    title: "Semáforo",
    category: "Placas",
    neighborhood: "Centro",
    address: "Cruzamento Av. Brasil x Rua São Paulo - Centro",
    priority: "Alta",
    status: "Encaminhada",
    image: "IMG_5570.PNG",
    sla: "6 dias",
    source: "Cidadão (App)",
    date: "17/05/2025",
    time: "16:10",
    description: "Foco amarelo do semáforo piscando ininterruptamente.",
    assignedTeam: "Equipe: Trânsito 01",
    expectedDate: "23/05/2025",
    confirmationsCount: 11,
    aiConfidence: "93%",
    photosCount: 1,
  },
  {
    id: "#98507",
    protocol: "PROTO-2025-0098507",
    title: "Placas",
    category: "Placas",
    neighborhood: "Iguaçu",
    address: "Rua das Américas, 88 - Iguaçu, Araucária - PR",
    priority: "Baixa",
    status: "Resolvida",
    image: "IMG_5572.PNG",
    sla: "Resolvida em 1 dia",
    source: "IA - Veículo 07",
    date: "15/05/2025",
    time: "10:00",
    description: "Substituição completa de placa de sinalização de rua.",
    assignedTeam: "Equipe: Trânsito 01",
    expectedDate: "Concluído",
    confirmationsCount: 6,
    aiConfidence: "97%",
    photosCount: 2,
  },
];

const fleetVehicles = [
  { id: "FLT-012", neighborhood: "Costeira", status: "Em operação", camera: "Online", lastSync: "18/05/2025 09:32", detectionsToday: 12 },
  { id: "FLT-007", neighborhood: "Thomaz Coelho", status: "Em operação", camera: "Online", lastSync: "18/05/2025 09:31", detectionsToday: 9 },
  { id: "FLT-021", neighborhood: "Iguaçu", status: "Em operação", camera: "Online", lastSync: "18/05/2025 09:30", detectionsToday: 7 },
  { id: "FLT-015", neighborhood: "Fazenda Velha", status: "Em operação", camera: "Online", lastSync: "18/05/2025 09:29", detectionsToday: 11 },
  { id: "FLT-003", neighborhood: "Barra do Aricanduva", status: "Em operação", camera: "Online", lastSync: "18/05/2025 09:28", detectionsToday: 6 },
  { id: "FLT-028", neighborhood: "Portelas", status: "Manutenção", camera: "Offline", lastSync: "18/05/2025 08:45", detectionsToday: 0 },
  { id: "FLT-034", neighborhood: "Estação Velha", status: "Inativo", camera: "Offline", lastSync: "18/05/2025 07:12", detectionsToday: 0 },
];

const aiDetectionsList = [
  { title: "Buraco", location: "Rua das Flores, 1280", neighborhood: "Costeira", time: "Hoje, 09:32", confidence: "96%", image: "IMG_5573.PNG" },
  { title: "Placa danificada", location: "Av. Archelau de Almeida Torres, 2100", neighborhood: "Thomaz Coelho", time: "Hoje, 09:24", confidence: "91%", image: "IMG_5572.PNG" },
  { title: "Faixa apagada", location: "Rua Pedro Druszcz, 320", neighborhood: "Iguaçu", time: "Hoje, 09:18", confidence: "88%", image: "IMG_5570.PNG" },
  { title: "Buraco", location: "Rua José de Anchieta, 560", neighborhood: "Fazenda Velha", time: "Hoje, 09:10", confidence: "95%", image: "IMG_5575.PNG" },
];

// ==========================================
// MAIN COMPONENT (ROLES & VIEWS)
// ==========================================
export default function Home() {
  const [currentRole, setCurrentRole] = useState<Role>("prefeitura");
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);
  const [occurrences, setOccurrences] = useState<Occurrence[]>(initialOccurrences);
  const [newOccurrenceModalOpen, setNewOccurrenceModalOpen] = useState(false);
  const [occurrencesViewMode, setOccurrencesViewMode] = useState<"kanban" | "table">("kanban");

  const handleOpenOccurrence = (item: Occurrence) => setSelectedOccurrence(item);
  const handleCloseOccurrence = () => setSelectedOccurrence(null);

  const handleCreateOccurrence = (newOcc: Occurrence) => {
    setOccurrences((prev) => [newOcc, ...prev]);
    setNewOccurrenceModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f4f7f5] text-slate-900 font-sans antialiased">
      {/* Role Switcher Bar */}
      <header className="sticky top-0 z-50 flex w-full flex-wrap items-center justify-between gap-3 border-b border-emerald-950/10 bg-slate-900 px-4 py-2.5 text-white shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-xs">
            <Radio className="h-4 w-4 animate-pulse text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-100 leading-tight">Perfil Ativo:</span>
            <span className="text-[11px] text-emerald-400 font-medium leading-tight">
              {currentRole === "prefeitura" && "🏛️ Backoffice Prefeitura"}
              {currentRole === "cidadao" && "📱 App do Cidadão (Mobile PWA)"}
              {currentRole === "equipe" && "👷 Equipe de Rua (Ordem de Serviço)"}
              {currentRole === "frota" && "🚗 Central de Frota & IA"}
            </span>
          </div>
        </div>

        {/* Role Switch Buttons */}
        <div className="flex items-center gap-1.5 rounded-lg bg-slate-800 p-1">
          <button
            onClick={() => setCurrentRole("prefeitura")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              currentRole === "prefeitura" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Prefeitura</span>
          </button>

          <button
            onClick={() => setCurrentRole("cidadao")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              currentRole === "cidadao" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cidadão</span>
          </button>

          <button
            onClick={() => setCurrentRole("equipe")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              currentRole === "equipe" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Equipe de Rua</span>
          </button>

          <button
            onClick={() => setCurrentRole("frota")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              currentRole === "frota" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Frota & IA</span>
          </button>
        </div>

        {/* Global Action: AI Simulator */}
        <button
          onClick={() => setNewOccurrenceModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-xs transition hover:bg-emerald-400"
        >
          <Sparkles className="h-3.5 w-3.5 text-slate-950" />
          <span className="hidden md:inline">Simular Nova Ocorrência com IA</span>
          <span className="md:hidden">+ Ocorrência IA</span>
        </button>
      </header>

      {/* Role 1: Prefeitura Backoffice */}
      {currentRole === "prefeitura" && (
        <div className="grid min-h-[calc(100vh-48px)] w-full max-w-full lg:grid-cols-[280px_1fr]">
          <aside className="hidden border-r border-slate-200/80 bg-white lg:flex lg:flex-col lg:justify-between">
            <div className="flex flex-col">
              <Brand />
              <div className="mx-4 my-2 flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-700 font-bold text-white shadow-xs">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 leading-tight">Prefeitura de Araucária</span>
                    <span className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5">Paraná, Brasil</span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>

              <nav className="space-y-1 px-3 py-4">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
                        isActive
                          ? "bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-200/70 shadow-xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-emerald-700" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 space-y-3">
              <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/90 to-teal-50/60 p-4 shadow-xs">
                <p className="text-xs font-bold text-emerald-900 leading-snug">Cidade inteligente se constrói juntos.</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">Participe, cuide, Araucária melhora.</p>
              </div>
              <div className="text-center">
                <span className="text-[11px] font-medium text-slate-400">© 2025 Prefeitura de Araucária.</span>
              </div>
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-12 z-30 flex h-18 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-sm text-slate-400 focus-within:border-emerald-500 focus-within:bg-white md:flex md:w-80 lg:w-96">
                  <Search className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar ocorrências, locais, bairros, equipes..."
                    className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setNewOccurrenceModalOpen(true)}
                  className="hidden items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 sm:flex"
                >
                  <Plus className="h-4 w-4" /> Nova ocorrência
                </button>
                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600" aria-label="Notificações">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">12</span>
                </button>
                <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3 sm:pl-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white shadow-xs">CA</div>
                  <div className="hidden flex-col text-left sm:flex">
                    <span className="text-xs font-bold text-slate-900 leading-tight">Carlos Andrade</span>
                    <span className="text-[11px] font-normal text-slate-500 leading-tight mt-0.5">Administrador</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile Nav Drawer */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-50 flex lg:hidden">
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
                <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white p-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <Brand compact />
                    <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 text-slate-500">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <nav className="flex-1 space-y-1 py-4">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium ${
                          activeSection === item.id ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-600"
                        }`}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}

            {/* Page Section Rendering */}
            <div className="w-full max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
              {activeSection === "overview" && (
                <OverviewSection onSelectOccurrence={handleOpenOccurrence} occurrences={occurrences} />
              )}
              {activeSection === "occurrences" && (
                <OccurrencesSection
                  occurrences={occurrences}
                  onSelectOccurrence={handleOpenOccurrence}
                  selectedOccurrence={selectedOccurrence}
                  onCloseOccurrence={handleCloseOccurrence}
                  viewMode={occurrencesViewMode}
                  setViewMode={setOccurrencesViewMode}
                />
              )}
              {activeSection === "map" && (
                <Panel title="Mapa Completo de Ocorrências e Monitoramento" action="Filtros avançados">
                  <CityMap expanded />
                </Panel>
              )}
              {activeSection === "fleet" && <FleetSection />}
              {activeSection === "teams" && <TeamsSection />}
              {activeSection === "reports" && <ReportsSection />}
              {activeSection === "settings" && <SettingsSection />}
            </div>
          </section>
        </div>
      )}

      {/* Role 2: Cidadão Portal */}
      {currentRole === "cidadao" && (
        <CitizenPortalView occurrences={occurrences} onOpenNewModal={() => setNewOccurrenceModalOpen(true)} />
      )}

      {/* Role 3: Equipe de Rua */}
      {currentRole === "equipe" && <FieldTeamOSView />}

      {/* Role 4: Frota & IA */}
      {currentRole === "frota" && (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <FleetSection />
        </div>
      )}

      {/* Occurrence Detail Drawer */}
      {selectedOccurrence && currentRole === "prefeitura" && (
        <OccurrenceDetailDrawer occurrence={selectedOccurrence} onClose={handleCloseOccurrence} />
      )}

      {/* AI Simulator Modal */}
      {newOccurrenceModalOpen && (
        <NewOccurrenceAIModal onClose={() => setNewOccurrenceModalOpen(false)} onCreate={handleCreateOccurrence} />
      )}
    </div>
  );
}

// ==========================================
// BRAND COMPONENT
// ==========================================
function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "px-5 py-5"}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-base font-black text-white shadow-xs">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-base font-bold tracking-tight text-emerald-900 leading-tight">Araucária em Ação</span>
        <span className="text-xs font-medium text-slate-500 leading-tight mt-0.5">Gestão Urbana Inteligente</span>
      </div>
    </div>
  );
}

// ==========================================
// OVERVIEW SECTION (IMAGE 5)
// ==========================================
function OverviewSection({
  onSelectOccurrence,
  occurrences,
}: {
  onSelectOccurrence: (item: Occurrence) => void;
  occurrences: Occurrence[];
}) {
  return (
    <div className="w-full max-w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Visão Geral</h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Panorama geral da manutenção urbana em Araucária</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50">
          <CalendarDays className="h-4 w-4 text-slate-500" />
          18/05/2025 - 24/05/2025
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Ocorrências Abertas</p>
              <p className="text-2xl font-bold text-slate-900">512</p>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-emerald-700">▲ 8,7% <span className="font-normal text-slate-500">em relação à semana anterior</span></p>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Resolvidas</p>
              <p className="text-2xl font-bold text-slate-900">1.248</p>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-emerald-700">▲ 12,3% <span className="font-normal text-slate-500">em relação à semana anterior</span></p>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Detectadas por IA</p>
              <p className="text-2xl font-bold text-slate-900">689</p>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-blue-700">▲ 15,1% <span className="font-normal text-slate-500">em relação à semana anterior</span></p>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Clock3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Tempo Médio de Resolução</p>
              <p className="text-2xl font-bold text-slate-900">3,6 dias</p>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-emerald-700">▼ -0,6 dia <span className="font-normal text-slate-500">em relação à semana anterior</span></p>
        </div>
      </div>

      {/* Row 1: Map & Bairro Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <Panel title="Mapa de Ocorrências" action="Filtros" action2="Camadas">
            <CityMap />
            <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-2.5 text-xs text-slate-600">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Abertas (512)</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Em andamento (213)</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Resolvidas (1.248)</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Detectadas por IA (689)</span>
            </div>
          </Panel>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <Panel title="Ocorrências por Bairro" action="Top 10">
            <BarChartTop10 />
            <div className="mt-3 border-t border-slate-100 pt-2 text-right">
              <button className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1">
                Ver relatório completo <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </Panel>
        </div>
      </div>

      {/* Row 2: Recent Table & Donut */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <Panel title="Ocorrências Recentes" action="Ver todas">
            <RecentTable occurrences={occurrences.slice(0, 5)} onSelectOccurrence={onSelectOccurrence} />
          </Panel>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <Panel title="Ocorrências por Categoria">
            <CategoryDonut />
            <div className="mt-3 border-t border-slate-100 pt-2 text-right">
              <button className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1">
                Ver relatório completo <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// OCCURRENCES SECTION (IMAGE 4)
// ==========================================
function OccurrencesSection({
  occurrences,
  onSelectOccurrence,
  selectedOccurrence,
  onCloseOccurrence,
  viewMode,
  setViewMode,
}: {
  occurrences: Occurrence[];
  onSelectOccurrence: (item: Occurrence) => void;
  selectedOccurrence: Occurrence | null;
  onCloseOccurrence: () => void;
  viewMode: "kanban" | "table";
  setViewMode: (m: "kanban" | "table") => void;
}) {
  const columns: KanbanColumn[] = [
    { title: "Nova", count: 146, color: "blue", items: occurrences.filter((o) => o.status === "Nova") },
    { title: "Em triagem", count: 213, color: "amber", items: occurrences.filter((o) => o.status === "Em triagem") },
    { title: "Encaminhada", count: 198, color: "indigo", items: occurrences.filter((o) => o.status === "Encaminhada") },
    { title: "Em execução", count: 438, color: "orange", items: occurrences.filter((o) => o.status === "Em execução") },
    { title: "Resolvida", count: 1248, color: "emerald", items: occurrences.filter((o) => o.status === "Resolvida") },
  ];

  return (
    <div className="w-full max-w-full space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Ocorrências</h1>
        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Triagem, acompanhamento e execução das ocorrências da cidade.</p>
      </div>

      {/* 5 Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><ClipboardList className="h-4 w-4" /></span>
            <div><p className="text-[11px] text-slate-500">Novas</p><p className="text-lg font-bold text-slate-900">146</p></div>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-emerald-700">▲ 18,6% vs semana ant.</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Clock3 className="h-4 w-4" /></span>
            <div><p className="text-[11px] text-slate-500">Em Triagem</p><p className="text-lg font-bold text-slate-900">213</p></div>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-emerald-700">▲ 8,4% vs semana ant.</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600"><FileCheck className="h-4 w-4" /></span>
            <div><p className="text-[11px] text-slate-500">Em Execução</p><p className="text-lg font-bold text-slate-900">438</p></div>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-emerald-700">▲ 13,7% vs semana ant.</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></span>
            <div><p className="text-[11px] text-slate-500">Resolvidas</p><p className="text-lg font-bold text-slate-900">1.248</p></div>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-emerald-700">▲ 12,7% vs semana ant.</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600"><ShieldAlert className="h-4 w-4" /></span>
            <div><p className="text-[11px] text-slate-500">Duplicadas</p><p className="text-lg font-bold text-slate-900">89</p></div>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-emerald-700">▼ -6,7% vs semana ant.</p>
        </div>
      </div>

      {/* View Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center rounded-lg bg-slate-200/70 p-1">
          <button
            onClick={() => setViewMode("kanban")}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
              viewMode === "kanban" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Quadro Kanban
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
              viewMode === "table" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tabela
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50">
            <Filter className="h-3.5 w-3.5 text-slate-500" /> Filtros
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" /> Ordenar
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === "kanban" ? (
        <div className="w-full max-w-full overflow-x-auto pb-6 pt-1 scroll-smooth">
          <div className="flex gap-4 items-start min-w-max">
            {columns.map((column) => (
              <div key={column.title} className="w-[310px] sm:w-[330px] shrink-0 rounded-xl border border-slate-200/90 bg-slate-100/70 p-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      column.title === "Nova" ? "bg-blue-500" :
                      column.title === "Em triagem" ? "bg-amber-500" :
                      column.title === "Encaminhada" ? "bg-indigo-500" :
                      column.title === "Em execução" ? "bg-orange-500" : "bg-emerald-500"
                    }`} />
                    <span className="text-xs font-bold text-slate-900">{column.title}</span>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{column.count}</span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-700 p-1"><Plus className="h-4 w-4" /></button>
                </div>

                <div className="space-y-3">
                  {column.items.map((item) => (
                    <article
                      key={item.id}
                      onClick={() => onSelectOccurrence(item)}
                      className={`group cursor-pointer rounded-xl border bg-white p-3 shadow-xs transition-all duration-150 hover:shadow-md ${
                        selectedOccurrence?.id === item.id ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-slate-200/90 hover:border-emerald-500"
                      }`}
                    >
                      <div className="relative mb-2.5 h-36 w-full overflow-hidden rounded-lg bg-slate-100">
                        <img alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" src={`/${item.image}`} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{item.id}</span>
                        <span className="text-[11px] text-slate-500">{item.time}</span>
                      </div>
                      <h4 className="mt-0.5 text-sm font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.neighborhood}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 border-t border-slate-100 pt-2 text-[11px]">
                        <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">🕒 SLA: {item.sla}</span>
                        <span className={`rounded px-2 py-0.5 font-bold ${
                          item.priority === "Alta" ? "bg-red-50 text-red-700" :
                          item.priority === "Média" ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-700"
                        }`}>{item.priority}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs p-4">
          <RecentTable occurrences={occurrences} onSelectOccurrence={onSelectOccurrence} />
        </div>
      )}
    </div>
  );
}

// ==========================================
// OCCURRENCE DETAIL DRAWER (IMAGE 4)
// ==========================================
function OccurrenceDetailDrawer({ occurrence, onClose }: { occurrence: Occurrence; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"atividades" | "notas" | "historico">("atividades");
  const [internalNote, setInternalNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold text-slate-900">Ocorrência {occurrence.id}</span>
            <StatusPill label={occurrence.status} />
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs">
            <img alt={occurrence.title} className="h-56 w-full object-cover" src={`/${occurrence.image}`} />
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-md bg-red-50 px-3 py-1 text-xs font-bold text-red-700">● {occurrence.priority}</span>
            <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">🕒 SLA: {occurrence.sla}</span>
            <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">👤 {occurrence.source}</span>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 font-medium">Categoria</span><span className="font-bold text-slate-900">{occurrence.category}</span></div>
            <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 font-medium">Bairro</span><span className="font-bold text-slate-900">{occurrence.neighborhood}</span></div>
            <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 font-medium">Endereço</span><span className="font-medium text-slate-800 text-right max-w-[240px] truncate">{occurrence.address}</span></div>
            <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 font-medium">Protocolo</span><span className="font-bold text-slate-700">{occurrence.protocol}</span></div>
            <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500 font-medium">Responsável</span><span className="font-bold text-emerald-800">{occurrence.assignedTeam || "Equipe: Obras"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Previsão</span><span className="font-bold text-slate-900">{occurrence.expectedDate || "21/05/2025"}</span></div>
          </div>

          <div>
            <div className="flex border-b border-slate-200">
              {(["atividades", "notas", "historico"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-3 text-xs font-bold transition border-b-2 capitalize ${
                    activeTab === tab ? "border-emerald-600 text-emerald-800" : "border-transparent text-slate-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "atividades" && (
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-start gap-3"><span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" /><div><p className="font-semibold text-slate-800">Ocorrência criada via {occurrence.source}</p><p className="text-[11px] text-slate-400">{occurrence.date} • {occurrence.time}</p></div></div>
                <div className="flex items-start gap-3"><span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-purple-500 shrink-0" /><div><p className="font-semibold text-slate-800">Classificada por IA como {occurrence.category} ({occurrence.aiConfidence || "96%"})</p><p className="text-[11px] text-slate-400">SLA automático: {occurrence.sla}</p></div></div>
              </div>
            )}
            {activeTab === "notas" && (
              <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
                <p className="font-semibold text-slate-800">Fiscal Roberto:</p>
                <p>Priorizar no primeiro turno de recapeamento.</p>
              </div>
            )}
            {activeTab === "historico" && (
              <div className="mt-4 space-y-2 text-xs text-slate-500">
                <p>• {occurrence.confirmationsCount || 12} moradores apoiaram esta solicitação</p>
                <p>• Coordenadas registradas com precisão de 3 metros</p>
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Adicionar nota interna..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 pr-10 text-xs text-slate-800 outline-hidden focus:border-emerald-500 focus:bg-white"
            />
            <Paperclip className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
              <RefreshCw className="h-3.5 w-3.5" /> Reclassificar
            </button>
            <button className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
              <ShieldAlert className="h-3.5 w-3.5" /> Duplicar
            </button>
            <button className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700">
              <Send className="h-4 w-4" /> Encaminhar para Equipe
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ==========================================
// FLEET & AI MODULE (IMAGE 1)
// ==========================================
function FleetSection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Frota & IA</h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Monitoramento da frota municipal e detecções inteligentes em tempo real.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" /> Ao vivo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Truck className="h-6 w-6" /></div><div><p className="text-xs text-slate-500">Veículos ativos</p><p className="text-2xl font-bold text-slate-900">28 <span className="text-sm font-normal text-slate-500">de 42</span></p></div></div>
          <p className="mt-3 text-xs font-semibold text-emerald-700">● 66,7% da frota em operação</p>
        </div>
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Route className="h-6 w-6" /></div><div><p className="text-xs text-slate-500">Km analisados hoje</p><p className="text-2xl font-bold text-slate-900">1.248 km</p></div></div>
          <p className="mt-3 text-xs font-semibold text-emerald-700">▲ +12,4% em relação a ontem</p>
        </div>
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-700"><Zap className="h-6 w-6" /></div><div><p className="text-xs text-slate-500">Detecções por IA</p><p className="text-2xl font-bold text-slate-900">89</p></div></div>
          <p className="mt-3 text-xs font-semibold text-emerald-700">▲ +18,7% em relação a ontem</p>
        </div>
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><ShieldCheck className="h-6 w-6" /></div><div><p className="text-xs text-slate-500">Confiança média</p><p className="text-2xl font-bold text-slate-900">92%</p></div></div>
          <p className="mt-3 text-xs font-semibold text-emerald-700">● Alta precisão das detecções</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <Panel title="Monitoramento em tempo real">
            <CityMap fleet />
          </Panel>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <Panel title="Detecções recentes da IA" action="Ver todas">
            <div className="space-y-3">
              {aiDetectionsList.map((item) => (
                <div key={item.title + item.location} className="flex items-center gap-3 rounded-xl border border-slate-200/80 p-2.5 hover:bg-slate-50">
                  <img alt={item.title} className="h-16 w-20 rounded-lg object-cover shrink-0" src={`/${item.image}`} />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 block truncate">{item.title}</span>
                    <span className="text-[11px] text-slate-500 block truncate mt-0.5">{item.location}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">{item.time}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Confiança</span>
                    <span className="text-sm font-bold text-emerald-700">{item.confidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <Panel title="Status da frota">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2.5">ID do Veículo</th>
                    <th className="px-3 py-2.5">Bairro Atual</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Câmera</th>
                    <th className="px-3 py-2.5 text-right">Detecções hoje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fleetVehicles.map((veh) => (
                    <tr key={veh.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 font-bold text-slate-900">{veh.id}</td>
                      <td className="px-3 py-3 text-slate-600">{veh.neighborhood}</td>
                      <td className="px-3 py-3"><StatusPill label={veh.status} small /></td>
                      <td className="px-3 py-3"><span className="text-[10px] text-emerald-700 font-semibold">{veh.camera}</span></td>
                      <td className="px-3 py-3 text-right font-bold text-slate-900">{veh.detectionsToday}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <Panel title="Detecções por categoria (hoje)">
            <CategoryDonut fleetMode />
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CITIZEN PORTAL (IMAGE 2)
// ==========================================
function CitizenPortalView({ occurrences, onOpenNewModal }: { occurrences: Occurrence[]; onOpenNewModal: () => void }) {
  const [citizenTab, setCitizenTab] = useState<"todas" | "andamento" | "resolvidas">("todas");
  const [activeCitizenView, setActiveCitizenView] = useState<"list" | "detail">("list");
  const [citizenSelectedOcc, setCitizenSelectedOcc] = useState<Occurrence>(occurrences[0]);

  return (
    <div className="mx-auto max-w-md p-4 sm:p-6">
      <div className="overflow-hidden rounded-[36px] border-4 border-slate-800 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-white px-6 pt-3 pb-1 text-xs font-bold text-slate-800">
          <span>9:41</span>
          <div className="h-4 w-24 rounded-full bg-slate-900" />
          <div className="flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5" /><Battery className="h-3.5 w-3.5" /></div>
        </div>

        {activeCitizenView === "list" ? (
          <div className="flex flex-col min-h-[640px]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <Brand compact />
              <div className="h-8 w-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">CA</div>
            </div>

            <div className="px-5 pt-4">
              <h2 className="text-xl font-bold text-slate-900">Minhas Ocorrências</h2>
              <p className="text-xs text-slate-500 mt-0.5">Acompanhe suas solicitações em Araucária, Paraná.</p>
              <div className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                {(["todas", "andamento", "resolvidas"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCitizenTab(t)}
                    className={`rounded-lg py-2 capitalize ${citizenTab === t ? "bg-white text-emerald-800 shadow-xs" : "text-slate-500"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-3 px-5 py-4 overflow-y-auto max-h-[440px]">
              {occurrences.slice(0, 5).map((occ) => (
                <div
                  key={occ.id}
                  onClick={() => { setCitizenSelectedOcc(occ); setActiveCitizenView("detail"); }}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/90 p-3 hover:border-emerald-500 transition cursor-pointer"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img alt="" className="h-full w-full object-cover" src={`/${occ.image}`} />
                    <span className="absolute bottom-1 left-1 rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-bold text-white">📷 {occ.photosCount || 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between"><strong className="text-xs font-bold text-slate-900">{occ.id}</strong><StatusPill label={occ.status} small /></div>
                    <p className="mt-1 text-xs font-bold text-slate-800 truncate">{occ.title}</p>
                    <p className="mt-2 text-[11px] text-slate-500">{occ.neighborhood} • {occ.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pb-3">
              <button onClick={onOpenNewModal} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg">
                <Plus className="h-4 w-4" /> Nova ocorrência
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-h-[640px] px-5 py-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <button onClick={() => setActiveCitizenView("list")} className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
              </button>
              <h3 className="text-sm font-bold text-slate-900">Ocorrência {citizenSelectedOcc.id}</h3>
              <MoreVertical className="h-4 w-4 text-slate-400" />
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
              <img alt="" className="h-18 w-20 rounded-xl object-cover" src={`/${citizenSelectedOcc.image}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-900">{citizenSelectedOcc.title}</span><StatusPill label={citizenSelectedOcc.status} small /></div>
                <p className="text-[11px] text-slate-500 mt-1">{citizenSelectedOcc.neighborhood}</p>
              </div>
            </div>

            {/* 4-Step Progress Timeline */}
            <div className="rounded-2xl border border-slate-200 p-4 space-y-3.5 text-xs bg-slate-50/50">
              <div className="flex gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0"><Check className="h-3.5 w-3.5" /></span><div><strong className="text-slate-900">Recebida</strong><p className="text-[11px] text-slate-500">Registrada com sucesso.</p></div></div>
              <div className="flex gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800 shrink-0"><Users className="h-3.5 w-3.5" /></span><div><strong className="text-blue-700">Em triagem</strong><p className="text-[11px] text-slate-500">Equipe técnica analisando criticidade.</p></div></div>
              <div className="flex gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 shrink-0"><Users className="h-3.5 w-3.5" /></span><div><strong className="text-slate-600">Equipe enviada</strong><p className="text-[11px] text-slate-400">A caminho do local.</p></div></div>
              <div className="flex gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 shrink-0"><Check className="h-3.5 w-3.5" /></span><div><strong className="text-slate-600">Resolvida</strong><p className="text-[11px] text-slate-400">Você será notificado com foto.</p></div></div>
            </div>

            {/* Photos */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Fotos</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <img alt="Antes" className="h-24 w-full object-cover" src={`/${citizenSelectedOcc.image}`} />
                  <span className="block text-center text-[10px] font-semibold text-slate-600 py-1 bg-slate-50">Antes</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-2 text-center">
                  <Camera className="h-5 w-5 text-slate-400 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-600">Depois</span>
                  <span className="text-[9px] text-slate-400">Foto em breve</span>
                </div>
              </div>
            </div>

            {/* Confirmations */}
            <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
              <div>
                <strong className="text-xs text-emerald-950 font-bold block">{citizenSelectedOcc.confirmationsCount || 12} confirmações</strong>
                <span className="text-[10px] text-emerald-800">Outros cidadãos apoiaram este chamado.</span>
              </div>
              <Users className="h-5 w-5 text-emerald-700" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// FIELD TEAM OS MODULE (IMAGE 3)
// ==========================================
function FieldTeamOSView() {
  const [serviceStatus, setServiceStatus] = useState<"atendimento" | "concluido">("atendimento");
  const [checklist, setChecklist] = useState({ epi: true, sinalizacao: true, material: true, obs: true });

  return (
    <div className="mx-auto max-w-md p-4 sm:p-6">
      <div className="overflow-hidden rounded-[36px] border-4 border-slate-800 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-white px-6 pt-3 pb-1 text-xs font-bold text-slate-800">
          <span>08:42</span>
          <div className="h-4 w-24 rounded-full bg-slate-900" />
          <div className="flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5" /><Battery className="h-3.5 w-3.5" /></div>
        </div>

        <div className="flex flex-col min-h-[640px] px-5 py-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <Brand compact />
            <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 border border-amber-200">Prioridade Alta</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Ordem de Serviço</span>
            <h2 className="text-xl font-bold text-slate-900">#98542</h2>
            <p className="text-[11px] text-slate-500">Protocolo OS-2025-00098542</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3.5 space-y-2 text-xs">
            <p><strong>Categoria:</strong> Iluminação pública apagada</p>
            <p><strong>Endereço:</strong> Rua das Araucárias, 1.245 - Costeira</p>
            <p><strong>Prazo (SLA):</strong> 02h 18m restantes</p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block">Ações do atendimento</span>
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white">▶ Iniciar atendimento</button>
              <button className="rounded-xl border border-emerald-600 bg-white py-2.5 text-xs font-bold text-emerald-800">📍 Cheguei ao local</button>
              <button className="rounded-xl border border-emerald-600 bg-white py-2.5 text-xs font-bold text-emerald-800">📷 Foto antes</button>
              <button className="rounded-xl border border-emerald-600 bg-white py-2.5 text-xs font-bold text-emerald-800">📷 Foto depois</button>
            </div>
            <button onClick={() => setServiceStatus("concluido")} className="w-full rounded-xl border border-emerald-600 bg-emerald-50 py-3 text-xs font-bold text-emerald-800">
              ✔ Concluir serviço
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2 text-xs">
            <div className="flex justify-between font-bold"><span>Checklist de execução</span><span className="text-emerald-700">4/4</span></div>
            <p>✔ EPI utilizado</p>
            <p>✔ Sinalização do local</p>
            <p>✔ Material utilizado (Lâmpada 250W)</p>
            <p>✔ Observações concluídas</p>
          </div>

          {serviceStatus === "concluido" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-center justify-between">
              <div><strong className="text-xs font-bold text-emerald-950 block">Serviço concluído</strong><span className="text-[10px] text-emerald-800">24/05/2025 • 10:18 por Carlos Andrade</span></div>
              <span className="font-serif italic text-sm text-slate-700">Carlos A.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// AI SIMULATOR / NEW OCCURRENCE MODAL
// ==========================================
function NewOccurrenceAIModal({ onClose, onCreate }: { onClose: () => void; onCreate: (occ: Occurrence) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSample, setSelectedSample] = useState(0);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const sampleImages = [
    { title: "Buraco na pista", img: "IMG_5573.PNG", category: "Buracos", location: "Rua Pedro Druszcz, 45 - Iguaçu", confidence: "96%", priority: "Alta" as const },
    { title: "Placa danificada", img: "IMG_5570.PNG", category: "Placas", location: "Av. Victor do Amaral, 720 - Centro", confidence: "91%", priority: "Média" as const },
    { title: "Poste apagado", img: "IMG_5576.PNG", category: "Iluminação", location: "Rua das Araucárias, 1.245 - Costeira", confidence: "94%", priority: "Média" as const },
    { title: "Calçada com buraco", img: "IMG_5575.PNG", category: "Calçadas", location: "Rua Santa Catarina, 450 - Fazenda Velha", confidence: "87%", priority: "Baixa" as const },
  ];

  const currentSample = sampleImages[selectedSample];

  const handleSimulate = () => {
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiAnalyzing(false);
      setStep(2);
    }, 1000);
  };

  const handleFinish = () => {
    onCreate({
      id: `#${Math.floor(100000 + Math.random() * 900000)}`,
      protocol: `PROTO-2025-${Math.floor(100000 + Math.random() * 900000)}`,
      title: currentSample.title,
      category: currentSample.category,
      neighborhood: currentSample.location.split("-")[1]?.trim() || "Araucária",
      address: currentSample.location,
      priority: currentSample.priority,
      status: "Nova",
      image: currentSample.img,
      sla: "3 dias",
      source: "Cidadão (App)",
      date: "Hoje",
      time: "Agora",
      confirmationsCount: 1,
      aiConfidence: currentSample.confidence,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800"><Sparkles className="h-4 w-4" /></span>
            <h3 className="text-base font-bold text-slate-900">Simulador de Nova Ocorrência com IA</h3>
          </div>
          <button onClick={onClose}><X className="h-5 w-5 text-slate-400" /></button>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              {sampleImages.map((s, idx) => (
                <div
                  key={s.title}
                  onClick={() => setSelectedSample(idx)}
                  className={`cursor-pointer rounded-xl border p-2 ${selectedSample === idx ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/30" : "border-slate-200"}`}
                >
                  <img alt="" className="h-20 w-full rounded-lg object-cover" src={`/${s.img}`} />
                  <span className="mt-1 block text-xs font-bold text-slate-800 truncate">{s.title}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleSimulate}
              disabled={aiAnalyzing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md"
            >
              {aiAnalyzing ? <><RefreshCw className="h-4 w-4 animate-spin" /> Analisando Imagem...</> : <><Sparkles className="h-4 w-4" /> Diagnosticar com IA</>}
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2">
              <span className="font-bold text-emerald-950 block">✔ Reconhecimento Concluído (Confiança {currentSample.confidence})</span>
              <p><strong>Categoria Sugerida:</strong> {currentSample.category}</p>
              <p><strong>Prioridade Calculada:</strong> P2 — {currentSample.priority}</p>
            </div>

            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 space-y-2">
              <strong className="text-amber-950 block">Atenção: Possível Chamado Semelhante Detectado</strong>
              <p className="text-amber-800">Existe um chamado aberto a 8 metros deste ponto (#98542 - Buraco na via).</p>
              <button onClick={() => { alert("Apoio registrado com sucesso!"); onClose(); }} className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white">
                👍 Confirmar que o problema ainda existe (+1 apoio)
              </button>
            </div>

            <button onClick={handleFinish} className="w-full text-center text-xs text-slate-600 underline">
              Criar novo chamado separado mesmo assim
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// MAP COMPONENT
// ==========================================
function CityMap({ fleet = false, expanded = false }: { fleet?: boolean; expanded?: boolean }) {
  const pins = [
    { pos: "left-[20%] top-[30%]", color: "bg-red-500" },
    { pos: "left-[38%] top-[45%]", color: "bg-amber-500" },
    { pos: "left-[55%] top-[35%]", color: "bg-blue-500" },
    { pos: "left-[72%] top-[52%]", color: "bg-emerald-600" },
    { pos: "left-[48%] top-[68%]", color: "bg-red-500" },
  ];

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-[#e8efe9] border border-slate-200/80 ${expanded ? "h-[420px]" : "h-[280px] sm:h-[340px]"}`}>
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-0 top-1/4 h-1.5 w-full rotate-[-6deg] bg-white" />
        <div className="absolute left-0 top-2/3 h-1.5 w-full rotate-[8deg] bg-white" />
        <div className="absolute left-1/4 top-0 h-full w-1.5 rotate-[16deg] bg-white" />
        <div className="absolute left-2/3 top-0 h-full w-1.5 rotate-[-10deg] bg-white" />
        <div className="absolute bottom-0 right-0 h-36 w-56 rounded-tl-full bg-blue-100/70" />
      </div>

      <svg aria-hidden className="absolute inset-0 h-full w-full pointer-events-none">
        <path d="M70 230 C170 90 260 120 330 170 S500 260 650 90" fill="none" stroke={fleet ? "#10b981" : "#94a3b8"} strokeDasharray={fleet ? "6 6" : "none"} strokeWidth={fleet ? "5" : "3"} />
      </svg>

      {pins.map((pin, i) => (
        <span key={i} className={`absolute ${pin.pos} -translate-x-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full ${pin.color} text-white shadow-md`}>
          <MapPin className="h-3.5 w-3.5" />
        </span>
      ))}

      <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-1.5 shadow-xs">
        <span className="text-xs font-bold text-slate-800">Araucária • Paraná</span>
      </div>
    </div>
  );
}

// ==========================================
// RECENT TABLE
// ==========================================
function RecentTable({ occurrences, onSelectOccurrence }: { occurrences: Occurrence[]; onSelectOccurrence: (item: Occurrence) => void }) {
  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-100">
          <tr>
            <th className="px-3 py-2.5">ID</th>
            <th className="px-3 py-2.5">Descrição</th>
            <th className="px-3 py-2.5">Categoria</th>
            <th className="px-3 py-2.5">Bairro</th>
            <th className="px-3 py-2.5">Origem</th>
            <th className="px-3 py-2.5">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {occurrences.map((row) => (
            <tr key={row.id} onClick={() => onSelectOccurrence(row)} className="cursor-pointer hover:bg-slate-50 transition">
              <td className="px-3 py-3 font-bold text-slate-800">{row.id}</td>
              <td className="px-3 py-3 font-medium text-slate-900 truncate max-w-[150px]">{row.title}</td>
              <td className="px-3 py-3"><span className="rounded px-2 py-0.5 text-[10px] font-semibold bg-slate-100">{row.category}</span></td>
              <td className="px-3 py-3 text-slate-600">{row.neighborhood}</td>
              <td className="px-3 py-3 text-slate-600">{row.source}</td>
              <td className="px-3 py-3"><StatusPill label={row.status} small /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// BAR CHART & DONUT
// ==========================================
function BarChartTop10() {
  const data = [
    { label: "Iguaçu", value: 218 },
    { label: "Centro", value: 176 },
    { label: "Costeira", value: 142 },
    { label: "Capela Velha", value: 118 },
    { label: "Fazenda Velha", value: 96 },
    { label: "Thomaz Coelho", value: 84 },
    { label: "Campina", value: 72 },
  ];

  return (
    <div className="flex h-[260px] items-end gap-2 border-b border-l border-slate-200 px-2 pt-6 pb-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-700">{item.value}</span>
          <div className="w-full max-w-7 rounded-t bg-blue-600" style={{ height: `${item.value * 0.8}px` }} />
          <span className="truncate text-[9px] text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function CategoryDonut({ fleetMode = false }: { fleetMode?: boolean }) {
  return (
    <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[140px_1fr]">
      <div className="relative mx-auto aspect-square w-32 rounded-full bg-[conic-gradient(#ef4444_0_31%,#3b82f6_31%_53%,#f59e0b_53%_71%,#10b981_71%_87%,#8b5cf6_87%_100%)]">
        <div className="absolute inset-6 grid place-items-center rounded-full bg-white text-center shadow-xs">
          <strong className="text-base font-bold text-slate-900">{fleetMode ? "89" : "2.349"}</strong>
          <span className="text-[9px] text-slate-400">Total</span>
        </div>
      </div>
      <div className="space-y-1 text-xs">
        <p className="flex justify-between"><span>🔴 Buracos</span><strong>31%</strong></p>
        <p className="flex justify-between"><span>🔵 Placas</span><strong>22%</strong></p>
        <p className="flex justify-between"><span>🟡 Iluminação</span><strong>18%</strong></p>
        <p className="flex justify-between"><span>🟢 Calçadas</span><strong>16%</strong></p>
      </div>
    </div>
  );
}

// ==========================================
// REUSABLE PANELS & SECTIONS
// ==========================================
function Panel({ title, action, action2, children }: { title: string; action?: string; action2?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200/90 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        <div className="flex gap-2">
          {action2 && <span className="text-xs text-slate-500 font-semibold">{action2}</span>}
          {action && <span className="text-xs text-emerald-700 font-semibold">{action}</span>}
        </div>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function StatusPill({ label, small = false }: { label: string; small?: boolean }) {
  const isRed = label.includes("Alta") || label.includes("Aberta");
  const isAmber = label.includes("Média") || label.includes("triagem") || label.includes("execução");
  const isGreen = label.includes("Online") || label.includes("operação") || label.includes("Resolvida");

  const palette = isRed ? "bg-red-50 text-red-700" : isAmber ? "bg-amber-50 text-amber-800" : isGreen ? "bg-emerald-50 text-emerald-800" : "bg-blue-50 text-blue-800";

  return <span className={`rounded-md font-semibold ${palette} ${small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}`}>{label}</span>;
}

function TeamsSection() {
  return (
    <div className="space-y-6">
      <Panel title="Quadro de Equipes Operacionais">
        <div className="space-y-3 text-xs">
          <p className="p-3 border rounded-lg"><strong>Equipe Obras 01:</strong> 5 serviços em andamento no Iguaçu</p>
          <p className="p-3 border rounded-lg"><strong>Equipe Iluminação:</strong> 3 serviços na Costeira</p>
          <p className="p-3 border rounded-lg"><strong>Equipe Sinalização:</strong> 4 serviços no Centro</p>
        </div>
      </Panel>
    </div>
  );
}

function ReportsSection() {
  return (
    <Panel title="Relatórios e Indicadores de Gestão Urbana">
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
        <h4 className="font-bold text-slate-900">Relatório Mensal de Ocorrências e SLA</h4>
        <p className="text-slate-500">Consolidado de todas as solicitações, tempos médios de resposta e bairros atendidos.</p>
        <button className="text-xs font-bold text-emerald-700 hover:underline">Exportar Relatório PDF / Excel →</button>
      </div>
    </Panel>
  );
}

function SettingsSection() {
  return (
    <Panel title="Configurações do Sistema Araucária em Ação">
      <div className="space-y-3 text-xs">
        <div className="flex justify-between border-b pb-2"><p className="font-bold">Notificações Automáticas</p><input type="checkbox" defaultChecked /></div>
        <div className="flex justify-between border-b pb-2"><p className="font-bold">Detecção Automática por IA em Frotas</p><input type="checkbox" defaultChecked /></div>
        <div className="flex justify-between"><p className="font-bold">Detector de Duplicidade Geoespacial</p><input type="checkbox" defaultChecked /></div>
      </div>
    </Panel>
  );
}
