import {
  BarChart3,
  Bell,
  CalendarDays,
  Camera,
  Car,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  FileText,
  Filter,
  Home,
  MapPin,
  Menu,
  Plus,
  Route,
  Search,
  ShieldCheck,
  Smartphone,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Section = "overview" | "occurrences" | "fleet" | "citizen" | "service";
type StatInput = [string, string, string, LucideIcon, string];

const navItems = [
  { id: "overview", label: "Visao Geral", icon: Home },
  { id: "occurrences", label: "Ocorrencias", icon: ClipboardList },
  { id: "fleet", label: "Frota & IA", icon: Truck },
  { id: "citizen", label: "Cidadao", icon: Smartphone },
  { id: "service", label: "Equipe de rua", icon: FileText },
] satisfies { id: Section; label: string; icon: LucideIcon }[];

const overviewStats: StatInput[] = [
  ["Ocorrencias abertas", "512", "+8,7%", ClipboardList, "green"],
  ["Resolvidas", "1.248", "+12,3%", CheckCircle2, "teal"],
  ["Detectadas por IA", "689", "+15,1%", Camera, "blue"],
  ["Tempo medio de resolucao", "3,6 dias", "-0,6 dia", Clock3, "cyan"],
];

const kanban = [
  {
    title: "Nova",
    count: 146,
    color: "blue",
    items: [
      ["#98542", "Buracos", "Iguacu", "Alta", "IMG_5572.PNG"],
      ["#98561", "Placas", "Centro", "Media", "IMG_5570.PNG"],
      ["#98578", "Limpeza", "Costeira", "Alta", "IMG_5575.PNG"],
    ],
  },
  {
    title: "Em triagem",
    count: 213,
    color: "amber",
    items: [
      ["#98540", "Iluminacao publica", "Costeira", "Media", "IMG_5576.PNG"],
      ["#98539", "Calcada irregular", "Fazenda Velha", "Baixa", "IMG_5575.PNG"],
      ["#98571", "Outros", "Thomas Coelho", "Baixa", "IMG_5570.PNG"],
    ],
  },
  {
    title: "Encaminhada",
    count: 198,
    color: "indigo",
    items: [
      ["#98533", "Entulho em via publica", "Thomas Coelho", "Media", "IMG_5572.PNG"],
      ["#98566", "Semaforo", "Centro", "Alta", "IMG_5570.PNG"],
      ["#98572", "Poda de arvores", "Campina da Barra", "Media", "IMG_5573.PNG"],
    ],
  },
  {
    title: "Em execucao",
    count: 438,
    color: "orange",
    items: [
      ["#98528", "Recapeamento", "Barra do Aricanduva", "Media", "IMG_5570.PNG"],
      ["#98530", "Iluminacao publica", "Capela Velha", "Media", "IMG_5576.PNG"],
      ["#98543", "Limpeza", "Portelas", "Baixa", "IMG_5572.PNG"],
    ],
  },
  {
    title: "Resolvida",
    count: 1248,
    color: "emerald",
    items: [
      ["#98518", "Buracos", "Centro", "Baixa", "IMG_5575.PNG"],
      ["#98507", "Placas", "Iguacu", "Baixa", "IMG_5572.PNG"],
      ["#98501", "Iluminacao publica", "Costeira", "Baixa", "IMG_5576.PNG"],
    ],
  },
];

const detections = [
  ["Buraco na via", "Rua das Flores, 1280", "96%", "IMG_5573.PNG"],
  ["Placa danificada", "Av. Archelaue de Almeida Torres", "91%", "IMG_5572.PNG"],
  ["Faixa apagada", "Rua Pedro Druszcz, 320", "88%", "IMG_5570.PNG"],
  ["Buraco na via", "Rua Jose de Anchieta, 560", "95%", "IMG_5575.PNG"],
];

const categories = [
  ["Buracos", 728, "bg-red-500"],
  ["Placas", 517, "bg-blue-500"],
  ["Iluminacao", 422, "bg-amber-400"],
  ["Calcada", 375, "bg-emerald-500"],
  ["Limpeza", 190, "bg-violet-500"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-emerald-950/10 bg-white lg:flex lg:flex-col">
          <Brand />
          <div className="border-y border-emerald-950/10 px-6 py-5">
            <div className="text-sm font-semibold">Prefeitura de Araucaria</div>
            <div className="mt-1 text-xs text-slate-500">Parana, Brasil</div>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navItems.map((item) => (
              <a
                key={item.id}
                className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-medium text-slate-600 transition first:bg-emerald-50 first:text-emerald-800 first:ring-1 first:ring-emerald-200 hover:bg-slate-50"
                href={`#${item.id}`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </a>
            ))}
          </nav>
          <div className="m-5 rounded-md border border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50 p-5">
            <p className="text-sm font-semibold text-emerald-900">
              Cidade inteligente se constroi juntos.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Participe, cuide e acompanhe cada melhoria da cidade.
            </p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
            <button className="rounded-md border border-slate-200 p-2 lg:hidden" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden flex-1 items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 md:flex">
              <Search className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-500">
                Buscar ocorrencias, locais, bairros, equipes...
              </span>
            </div>
            <button className="relative rounded-md border border-slate-200 p-2" aria-label="Notificacoes">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-2 rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">
                12
              </span>
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                <img alt="Administrador" className="h-full w-full object-cover" src="/IMG_5570.PNG" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold">Carlos Andrade</div>
                <div className="text-xs text-slate-500">Administrador</div>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
            </div>
          </header>

          <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <Brand compact />
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 first:border-emerald-600 first:bg-emerald-50 first:text-emerald-800"
                  href={`#${item.id}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="px-4 py-6 md:px-8">
            <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Araucaria em Acao</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Plataforma municipal para detectar, triar, executar e comprovar manutencoes urbanas.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium">
                  <CalendarDays className="h-4 w-4" />
                  18/05/2025 - 24/05/2025
                </button>
                <button className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                  <Plus className="h-4 w-4" />
                  Nova ocorrencia
                </button>
              </div>
            </div>

            <div className="space-y-10">
              <ProductSection id="overview" title="Visao Geral">
                <Overview />
              </ProductSection>
              <ProductSection id="occurrences" title="Ocorrencias">
                <Occurrences />
              </ProductSection>
              <ProductSection id="fleet" title="Frota & IA">
                <Fleet />
              </ProductSection>
              <ProductSection id="citizen" title="Cidadao">
                <Citizen />
              </ProductSection>
              <ProductSection id="service" title="Equipe de rua">
                <ServiceOrder />
              </ProductSection>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProductSection({ id, title, children }: { id: Section; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="mb-4 text-xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "px-6 py-6"}`}>
      <div className="grid h-12 w-12 place-items-center rounded-md bg-emerald-700 text-xl font-black text-white">
        A
      </div>
      <div>
        <div className="text-xl font-bold text-emerald-800">Araucaria em Acao</div>
        <div className="text-sm text-slate-500">Gestao Urbana Inteligente</div>
      </div>
    </div>
  );
}

function StatCard({ item }: { item: StatInput }) {
  const [label, value, delta, Icon] = item;
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-md bg-emerald-50 text-emerald-700">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
        </div>
      </div>
      <p className="mt-4 text-xs font-medium text-emerald-700">{delta} em relacao a semana anterior</p>
    </div>
  );
}

function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((item) => (
          <StatCard key={item[0]} item={item} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Panel title="Mapa de ocorrencias" action="Camadas">
          <CityMap />
        </Panel>
        <Panel title="Ocorrencias por bairro" action="Top 10">
          <BarChart />
        </Panel>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <Panel title="Ocorrencias recentes" action="Ver todas">
          <RecentTable />
        </Panel>
        <Panel title="Ocorrencias por categoria" action="Relatorio">
          <CategoryDonut />
        </Panel>
      </div>
    </div>
  );
}

function Occurrences() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-full bg-slate-100 p-1">
            <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
              Quadro Kanban
            </button>
            <button className="px-4 py-2 text-sm font-medium text-slate-500">Tabela</button>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
              <Filter className="h-4 w-4" />
              Filtros
            </button>
            <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">Ordenar</button>
          </div>
        </div>
        <div className="grid gap-4 overflow-x-auto pb-2 xl:grid-cols-5">
          {kanban.map((column) => (
            <div key={column.title} className="min-w-[220px] rounded-md border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between border-b border-slate-200 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  {column.title}
                  <span className="text-slate-400">{column.count}</span>
                </div>
                <Plus className="h-4 w-4 text-slate-500" />
              </div>
              <div className="space-y-3 p-3">
                {column.items.map((item) => (
                  <OccurrenceCard key={item[0]} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <DetailRail />
    </div>
  );
}

function Fleet() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Veiculos ativos", "28 de 42", Car],
          ["Km analisados hoje", "1.248 km", Route],
          ["Deteccoes por IA", "89", Zap],
          ["Confianca media", "92%", ShieldCheck],
        ].map((item) => (
          <StatCard key={item[0] as string} item={[item[0] as string, item[1] as string, "+12,4%", item[2] as LucideIcon, "green"]} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Panel title="Monitoramento em tempo real" action="Expandir">
          <CityMap fleet />
        </Panel>
        <Panel title="Deteccoes recentes da IA" action="Ver todas">
          <div className="space-y-3">
            {detections.map((item) => (
              <div key={item[0] + item[1]} className="grid grid-cols-[112px_1fr_auto] gap-3 rounded-md border border-slate-200 p-2">
                <img alt="" className="h-20 w-28 rounded-md object-cover" src={`/${item[3]}`} />
                <div className="py-1">
                  <div className="text-sm font-semibold">{item[0]}</div>
                  <div className="mt-2 text-xs text-slate-500">{item[1]}</div>
                  <div className="mt-2 text-xs text-slate-500">Hoje, 09:32</div>
                </div>
                <div className="self-center text-right">
                  <div className="text-xs text-slate-500">Confianca</div>
                  <div className="text-2xl font-bold text-emerald-700">{item[2]}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Status da frota" action="Online">
          <FleetTable />
        </Panel>
        <Panel title="Deteccoes por categoria" action="Completo">
          <CategoryDonut compact />
        </Panel>
      </div>
    </div>
  );
}

function Citizen() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <PhoneFrame>
        <div className="flex items-center justify-between">
          <Brand compact />
          <Bell className="h-5 w-5 text-slate-600" />
        </div>
        <h2 className="mt-7 text-2xl font-bold">Minhas Ocorrencias</h2>
        <p className="mt-1 text-sm text-slate-500">Acompanhe suas solicitacoes em Araucaria, Parana.</p>
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-md border border-slate-200 p-1 text-sm">
          <button className="rounded-md bg-emerald-50 py-2 font-semibold text-emerald-700">Todas</button>
          <button className="py-2 text-slate-600">Em andamento</button>
          <button className="py-2 text-slate-600">Resolvidas</button>
        </div>
        <div className="mt-5 space-y-3">
          {[
            ["#98542", "Buraco na via", "Iguacu", "Aberta", "IMG_5573.PNG"],
            ["#98541", "Placa de transito danificada", "Centro", "Em andamento", "IMG_5572.PNG"],
            ["#98540", "Iluminacao publica apagada", "Costeira", "Aberta", "IMG_5576.PNG"],
            ["#98539", "Calcada irregular", "Fazenda Velha", "Em andamento", "IMG_5575.PNG"],
          ].map((item) => (
            <div key={item[0]} className="grid grid-cols-[88px_1fr] gap-3 rounded-md border border-slate-200 p-3">
              <img alt="" className="h-24 w-24 rounded-md object-cover" src={`/${item[4]}`} />
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <strong>{item[0]}</strong>
                  <StatusPill label={item[3]} />
                </div>
                <p className="mt-2 text-sm text-slate-700">{item[1]}</p>
                <p className="mt-4 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {item[2]}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="mx-auto mt-5 flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg">
          <Plus className="h-5 w-5" />
          Nova ocorrencia
        </button>
      </PhoneFrame>
      <PhoneFrame>
        <div className="flex items-center justify-between">
          <button className="rounded-md border border-slate-200 p-2" aria-label="Voltar">
            <ChevronDown className="h-5 w-5 rotate-90" />
          </button>
          <h2 className="font-bold">Ocorrencia #98542</h2>
          <Menu className="h-5 w-5" />
        </div>
        <div className="mt-6 grid grid-cols-[120px_1fr] gap-4 rounded-md border border-slate-200 p-4">
          <img alt="" className="h-24 w-28 rounded-md object-cover" src="/IMG_5573.PNG" />
          <div>
            <div className="flex items-start justify-between">
              <strong>Buraco na via</strong>
              <StatusPill label="Aberta" />
            </div>
            <p className="mt-3 text-sm text-slate-500">Iguacu</p>
            <p className="mt-3 text-sm text-slate-500">24/05/2025 09:18</p>
          </div>
        </div>
        <Timeline />
        <Panel title="Fotos">
          <div className="grid grid-cols-2 gap-3">
            <img alt="" className="h-28 rounded-md object-cover" src="/IMG_5573.PNG" />
            <div className="grid h-28 place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500">
              Foto apos a solucao em breve
            </div>
          </div>
        </Panel>
        <Panel title="Confirmacoes da comunidade">
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-emerald-700">12 confirmacoes</strong>
              <p className="text-sm text-slate-500">Outros cidadaos confirmaram esta ocorrencia.</p>
            </div>
            <Users className="h-7 w-7 text-emerald-700" />
          </div>
        </Panel>
      </PhoneFrame>
    </div>
  );
}

function ServiceOrder() {
  return (
    <PhoneFrame wide>
      <div className="flex items-center justify-between">
        <button className="rounded-md border border-slate-200 p-2" aria-label="Voltar">
          <ChevronDown className="h-5 w-5 rotate-90" />
        </button>
        <Brand compact />
        <Bell className="h-5 w-5 text-slate-600" />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ordem de Servico</h2>
          <p className="text-sm text-slate-500">Protocolo OS-2025-00098542</p>
        </div>
        <span className="rounded-md bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">Prioridade Alta</span>
      </div>
      <div className="mt-4 grid overflow-hidden rounded-md border border-slate-200 md:grid-cols-[1fr_280px]">
        <div className="space-y-5 p-4">
          <InfoRow icon={Zap} label="Categoria" value="Iluminacao publica apagada" />
          <InfoRow icon={MapPin} label="Endereco" value="Rua das Araucarias, 1.245 - Centro" />
        </div>
        <CityMap mini />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <MiniMetric label="Prazo (SLA)" value="02h 18m" detail="Concluir ate 24/05 - 16:00" />
        <MiniMetric label="Origem" value="Cidadao (App)" detail="Protocolo via Araucaria em Acao" />
        <MiniMetric label="Aberta em" value="24/05/2025" detail="Por Joao da Silva" />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel title="Foto enviada pelo cidadao">
          <img alt="" className="h-40 w-full rounded-md object-cover" src="/IMG_5576.PNG" />
        </Panel>
        <Panel title="Descricao da solicitacao">
          <p className="text-slate-700">Lampada queimada no poste em frente a padaria.</p>
          <hr className="my-4 border-slate-200" />
          <p className="text-sm text-slate-500">Observacoes internas</p>
          <p className="mt-1 text-slate-700">Trocar lampada vapor metalico 250W.</p>
        </Panel>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {["Iniciar atendimento", "Cheguei ao local", "Adicionar foto antes", "Adicionar foto depois"].map((label, index) => (
          <button
            key={label}
            className={`flex items-center justify-center gap-2 rounded-md border px-4 py-3 font-semibold ${
              index === 0
                ? "border-emerald-700 bg-emerald-600 text-white"
                : "border-emerald-600 bg-white text-emerald-700"
            }`}
          >
            {index < 2 ? <MapPin className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
            {label}
          </button>
        ))}
      </div>
      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-emerald-600 bg-emerald-50 px-4 py-3 font-semibold text-emerald-700">
        <CheckCircle2 className="h-5 w-5" />
        Concluir servico
      </button>
      <div className="mt-4 rounded-md border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <strong>Checklist de execucao</strong>
          <span className="text-sm font-semibold text-emerald-700">4/4</span>
        </div>
        {["EPI utilizado", "Sinalizacao do local", "Material utilizado", "Observacoes"].map((item) => (
          <div key={item} className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm last:border-b-0">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              {item}
            </span>
            <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function Panel({ title, action, children }: { title: string; action?: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h2 className="font-semibold">{title}</h2>
        {action ? <button className="text-sm font-semibold text-blue-600">{action}</button> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function CityMap({ fleet = false, mini = false }: { fleet?: boolean; mini?: boolean }) {
  const pins = [
    ["left-[20%] top-[30%]", "bg-red-500"],
    ["left-[38%] top-[45%]", "bg-amber-500"],
    ["left-[55%] top-[35%]", "bg-blue-500"],
    ["left-[72%] top-[52%]", "bg-emerald-600"],
    ["left-[48%] top-[68%]", "bg-red-500"],
    ["left-[62%] top-[75%]", "bg-blue-500"],
  ];
  return (
    <div className={`relative overflow-hidden rounded-md bg-[#eef3ef] ${mini ? "h-full min-h-40" : "h-[340px]"}`}>
      <div className="absolute inset-0 opacity-70">
        <div className="absolute left-0 top-1/4 h-1 w-full rotate-[-8deg] bg-white" />
        <div className="absolute left-0 top-2/3 h-1 w-full rotate-[7deg] bg-white" />
        <div className="absolute left-1/4 top-0 h-full w-1 rotate-[18deg] bg-white" />
        <div className="absolute left-2/3 top-0 h-full w-1 rotate-[-12deg] bg-white" />
        <div className="absolute bottom-0 right-0 h-28 w-44 rounded-tl-full bg-blue-100" />
      </div>
      {fleet ? (
        <svg aria-hidden className="absolute inset-0 h-full w-full">
          <path d="M70 230 C170 90 260 120 330 170 S500 260 650 90" fill="none" stroke="#22c55e" strokeDasharray="8 8" strokeWidth="6" />
        </svg>
      ) : null}
      {pins.map(([position, color], index) => (
        <span key={position} className={`absolute ${position} grid h-8 w-8 place-items-center rounded-full ${color} text-white shadow-lg`}>
          {fleet && index % 2 ? <Truck className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
        </span>
      ))}
      <div className="absolute inset-0 grid place-items-center">
        <strong className="rounded bg-white/80 px-3 py-1 text-2xl shadow-sm">Araucaria</strong>
      </div>
    </div>
  );
}

function BarChart() {
  const data = [
    ["Iguacu", 218],
    ["Centro", 176],
    ["Costeira", 142],
    ["Capela Velha", 118],
    ["Fazenda Velha", 96],
    ["Thomas Coelho", 84],
    ["Campina", 72],
  ];
  return (
    <div className="flex h-[340px] items-end gap-4 border-b border-l border-slate-200 px-3 pt-8">
      {data.map(([label, value]) => (
        <div key={label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-semibold">{value}</span>
          <div className="w-full max-w-12 rounded-t bg-blue-500" style={{ height: `${Number(value) * 1.05}px` }} />
          <span className="h-14 -rotate-45 text-xs text-slate-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

function CategoryDonut({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid items-center gap-6 ${compact ? "md:grid-cols-[180px_1fr]" : "md:grid-cols-[220px_1fr]"}`}>
      <div className="relative mx-auto aspect-square w-44 rounded-full bg-[conic-gradient(#ef4444_0_31%,#3b82f6_31%_53%,#f59e0b_53%_71%,#10b981_71%_87%,#8b5cf6_87%_95%,#cbd5e1_95%_100%)]">
        <div className="absolute inset-10 grid place-items-center rounded-full bg-white text-center">
          <strong className="text-2xl">2.349</strong>
          <span className="text-xs text-slate-500">Total</span>
        </div>
      </div>
      <div className="space-y-3">
        {categories.map(([name, value, color]) => (
          <div key={name} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
              {name}
            </span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTable() {
  const rows = [
    ["#98542", "Buraco na via", "Buracos", "Iguacu", "IA - Veiculo 07", "Aberta"],
    ["#98541", "Placa de transito danificada", "Placas", "Centro", "Cidadao (App)", "Em andamento"],
    ["#98540", "Iluminacao publica apagada", "Iluminacao", "Costeira", "IA - Veiculo 03", "Aberta"],
    ["#98539", "Calcada irregular", "Calcada", "Fazenda Velha", "Cidadao (Web)", "Em andamento"],
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-xs text-slate-500">
          <tr>
            {["ID", "Descricao", "Categoria", "Bairro", "Origem", "Status"].map((head) => (
              <th key={head} className="px-3 py-3 font-semibold">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-slate-100">
              {row.map((cell, index) => (
                <td key={cell} className="px-3 py-3">
                  {index === 5 ? <StatusPill label={cell} /> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OccurrenceCard({ item }: { item: string[] }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-2 shadow-sm">
      <img alt="" className="h-24 w-full rounded-md object-cover" src={`/${item[4]}`} />
      <strong className="mt-2 block text-sm">{item[0]}</strong>
      <p className="text-sm font-semibold">{item[1]}</p>
      <p className="mt-1 text-xs text-slate-500">{item[2]}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">SLA: 3 dias</span>
        <StatusPill label={item[3]} small />
      </div>
    </article>
  );
}

function DetailRail() {
  return (
    <aside className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <strong>Ocorrencia #98542</strong>
        <StatusPill label="Nova" />
      </div>
      <img alt="" className="mt-4 h-40 w-full rounded-md object-cover" src="/IMG_5573.PNG" />
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <span className="rounded bg-red-50 px-2 py-2 font-semibold text-red-600">Alta</span>
        <span className="rounded bg-blue-50 px-2 py-2 font-semibold text-blue-600">SLA: 3 dias</span>
        <span className="rounded bg-slate-50 px-2 py-2 font-semibold text-slate-600">Cidadao</span>
      </div>
      <dl className="mt-5 space-y-4 text-sm">
        {[
          ["Categoria", "Buracos"],
          ["Bairro", "Iguacu"],
          ["Endereco", "Rua Pedro Druszcz, 45"],
          ["Origem", "Cidadao (App)"],
          ["Responsavel", "Equipe: Obras"],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[100px_1fr] gap-3">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <Timeline compact />
      <button className="mt-4 w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Encaminhar</button>
    </aside>
  );
}

function FleetTable() {
  const rows = [
    ["FLT-012", "Costeira", "Em operacao", "Online", "12"],
    ["FLT-007", "Thomas Coelho", "Em operacao", "Online", "9"],
    ["FLT-021", "Iguacu", "Em operacao", "Online", "7"],
    ["FLT-028", "Portelas", "Manutencao", "Offline", "0"],
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="bg-slate-50 text-xs text-slate-500">
          <tr>
            {["ID do veiculo", "Bairro atual", "Status", "Camera", "Deteccoes hoje"].map((head) => (
              <th key={head} className="px-3 py-3 font-semibold">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-slate-100">
              {row.map((cell, index) => (
                <td key={cell} className="px-3 py-3">
                  {index === 2 || index === 3 ? <StatusPill label={cell} small /> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PhoneFrame({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`mx-auto rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 ${wide ? "max-w-3xl" : "max-w-[420px]"}`}>
      <div className="mb-4 flex items-center justify-between text-sm font-bold">
        <span>08:42</span>
        <span className="rounded bg-slate-900 px-1.5 text-xs text-white">100</span>
      </div>
      {children}
    </div>
  );
}

function Timeline({ compact = false }: { compact?: boolean }) {
  const steps = [
    ["Recebida", "Sua ocorrencia foi registrada com sucesso."],
    ["Em triagem", "Estamos analisando sua solicitacao."],
    ["Equipe enviada", "Equipe acionada e a caminho."],
    ["Resolvida", "Assim que concluirmos, voce sera notificado."],
  ];
  return (
    <div className={`${compact ? "mt-5" : "my-5 rounded-md border border-slate-200 p-4"}`}>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step[0]} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={`grid h-8 w-8 place-items-center rounded-full border ${index < 2 ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-300 bg-slate-50 text-slate-400"}`}>
                <CheckCircle2 className="h-4 w-4" />
              </span>
              {index < steps.length - 1 ? <span className="h-8 w-px bg-slate-200" /> : null}
            </div>
            <div>
              <strong className={index === 1 ? "text-blue-600" : ""}>{step[0]}</strong>
              <p className="text-sm text-slate-500">{step[1]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ label, small = false }: { label: string; small?: boolean }) {
  const palette =
    label.includes("Alta") || label.includes("Aberta")
      ? "bg-red-50 text-red-600"
      : label.includes("Media") || label.includes("andamento") || label.includes("Manutencao")
        ? "bg-amber-50 text-amber-700"
        : label.includes("Online") || label.includes("operacao") || label.includes("Nova")
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600";
  return <span className={`rounded px-2 py-1 font-semibold ${palette} ${small ? "text-[11px]" : "text-xs"}`}>{label}</span>;
}

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function MiniMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-emerald-700">{detail}</p>
    </div>
  );
}
