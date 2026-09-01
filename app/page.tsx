"use client";

import {
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
  FileCheck,
  FileText,
  Filter,
  Home as HomeIcon,
  MapPin,
  Menu,
  MoreVertical,
  Paperclip,
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
  Truck,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type LeafletMap = {
  invalidateSize: () => LeafletMap;
  remove: () => void;
  setView: (coords: [number, number], zoom: number) => LeafletMap;
  zoomIn: () => void;
  zoomOut: () => void;
};

type LeafletLayer = {
  addTo: (map: LeafletMap) => LeafletLayer;
  on?: (event: "click", handler: () => void) => LeafletLayer;
};

type LeafletGlobal = {
  map: (
    element: HTMLElement,
    options?: {
      attributionControl?: boolean;
      scrollWheelZoom?: boolean;
      zoomControl?: boolean;
    },
  ) => LeafletMap;
  tileLayer: (url: string, options?: Record<string, unknown>) => LeafletLayer;
  divIcon: (options: {
    className: string;
    html: string;
    iconAnchor: [number, number];
    iconSize: [number, number];
  }) => unknown;
  marker: (coords: [number, number], options?: { icon?: unknown; title?: string }) => LeafletLayer;
  polyline: (coords: Array<[number, number]>, options?: Record<string, unknown>) => LeafletLayer;
};

declare global {
  interface Window {
    L?: LeafletGlobal;
    __leafletLoadPromise?: Promise<LeafletGlobal>;
  }
}

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
  { id: "overview", label: "Visão Geral", icon: HomeIcon },
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
  coords?: [number, number];
}

interface KanbanColumn {
  title: "Nova" | "Em triagem" | "Encaminhada" | "Em execução" | "Resolvida";
  count: number;
  color: string;
  items: Occurrence[];
}

type BootstrapIconName =
  | "arrowDown"
  | "arrowUp"
  | "camera"
  | "checkCircle"
  | "clock"
  | "geoAlt"
  | "handThumbsUp"
  | "image"
  | "lightbulb"
  | "person"
  | "play"
  | "signpost"
  | "trash";

function BootstrapIcon({ className = "h-3.5 w-3.5", name }: { className?: string; name: BootstrapIconName }) {
  const paths: Record<BootstrapIconName, ReactNode> = {
    arrowDown: <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />,
    arrowUp: <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5A.5.5 0 0 0 8 15" />,
    camera: <><path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" /><path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 1a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1M8 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" /></>,
    checkCircle: <><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" /><path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" /></>,
    clock: <><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" /><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" /></>,
    geoAlt: <><path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" /><path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4" /></>,
    handThumbsUp: <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.478 1.934-1.064a1.86 1.86 0 0 0 .254-.912c.152-.091.293-.223.41-.391.24-.346.37-.807.37-1.293 0-.246-.034-.485-.098-.699.203-.205.369-.499.463-.853.093-.353.099-.745.018-1.111.189-.258.296-.594.296-.957 0-.764-.586-1.44-1.4-1.44h-3.33c.102-.308.188-.654.243-1.017.068-.45.067-.995-.097-1.614-.16-.602-.522-1.271-1.176-2.01zM3 8.72c0-.212.173-.413.482-.498.984-.268 1.817-.896 2.458-1.611.637-.712 1.107-1.555 1.28-2.054.235-.681.406-1.768.482-2.938.022-.326.342-.568.667-.486.64.16 1.155.585 1.52 1.139.36.548.522 1.197.455 1.75-.062.522-.209 1.002-.45 1.455-.136.257.043.523.333.523h3.52c.261 0 .5.236.5.44 0 .168-.068.304-.177.394a.5.5 0 0 0-.154.504c.109.407.094.775-.014 1.017-.101.226-.255.329-.454.329a.5.5 0 0 0-.486.621c.076.306.04.639-.087.861-.119.207-.292.334-.536.334a.5.5 0 0 0-.497.559c.046.386-.024.751-.182.983-.15.219-.35.324-.66.324H8c-.508 0-.855-.067-1.137-.164a3.4 3.4 0 0 1-.732-.372l-.046-.028c-.524-.32-1.224-.747-2.531-.886C3.208 13.879 3 13.612 3 13.171z" />,
    image: <><path d="M6.002 5.5a1.5 1.5 0 1 1-3.001 0 1.5 1.5 0 0 1 3 0" /><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" /></>,
    lightbulb: <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a1.96 1.96 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3.47 8.5a.5.5 0 0 1 .5-.5h4.06a.5.5 0 0 1 0 1H5.97a.5.5 0 0 1-.5-.5" />,
    person: <><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6" /><path d="M14 14s-1-4-6-4-6 4-6 4 1 1 6 1 6-1 6-1m-1.05-.684A5.48 5.48 0 0 0 8 11a5.48 5.48 0 0 0-4.95 2.316C3.735 13.56 5.246 14 8 14s4.265-.44 4.95-.684" /></>,
    play: <path d="M10.804 8 5 4.633v6.734zM4.5 3.748a.5.5 0 0 1 .757-.43l6.5 3.75a.5.5 0 0 1 0 .864l-6.5 3.75a.5.5 0 0 1-.757-.43z" />,
    signpost: <path d="M7 1.414V2H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v2H2.5a.5.5 0 0 0-.354.146l-1.5 1.5a.5.5 0 0 0 0 .708l1.5 1.5A.5.5 0 0 0 2.5 12H7v3h1v-3h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H8V6h5.5a.5.5 0 0 0 .354-.146l1.5-1.5a.5.5 0 0 0 0-.708l-1.5-1.5A.5.5 0 0 0 13.5 2H8v-.586a.5.5 0 0 0-1 0" />,
    trash: <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2H5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h2.5a1 1 0 0 1 1 1" />,
  };

  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 16 16">
      {paths[name]}
    </svg>
  );
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
    image: "occurrences/pothole-road.png",
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
    image: "occurrences/streetlight-off.png",
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
    image: "occurrences/illegal-dumping.png",
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
    image: "occurrences/pothole-road.png",
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
    image: "occurrences/pothole-road.png",
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
    image: "occurrences/damaged-sign.png",
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
    image: "occurrences/broken-sidewalk.png",
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
    image: "occurrences/damaged-sign.png",
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
    image: "occurrences/damaged-sign.png",
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
  { title: "Buraco", location: "Rua das Flores, 1280", neighborhood: "Costeira", time: "Hoje, 09:32", confidence: "96%", image: "occurrences/pothole-road.png" },
  { title: "Placa danificada", location: "Av. Archelau de Almeida Torres, 2100", neighborhood: "Thomaz Coelho", time: "Hoje, 09:24", confidence: "91%", image: "occurrences/damaged-sign.png" },
  { title: "Faixa apagada", location: "Rua Pedro Druszcz, 320", neighborhood: "Iguaçu", time: "Hoje, 09:18", confidence: "88%", image: "occurrences/streetlight-off.png" },
  { title: "Buraco", location: "Rua José de Anchieta, 560", neighborhood: "Fazenda Velha", time: "Hoje, 09:10", confidence: "95%", image: "occurrences/pothole-road.png" },
];

const occurrenceCoordinates: Record<string, [number, number]> = {
  "#98542": [-25.5912, -49.4078],
  "#98540": [-25.5886, -49.3944],
  "#98533": [-25.6026, -49.4182],
  "#98528": [-25.5968, -49.3831],
  "#98518": [-25.6084, -49.4019],
  "#98561": [-25.5818, -49.4126],
  "#98539": [-25.5992, -49.4326],
  "#98566": [-25.5899, -49.4262],
  "#98530": [-25.6044, -49.389],
  "#98507": [-25.5863, -49.4006],
};

const araucariaPins: Array<{ id: string; coords: [number, number]; color: string; index: number }> = [
  { id: "#98542", coords: occurrenceCoordinates["#98542"], color: "#ef4444", index: 0 },
  { id: "#98540", coords: occurrenceCoordinates["#98540"], color: "#f59e0b", index: 1 },
  { id: "#98533", coords: occurrenceCoordinates["#98533"], color: "#3b82f6", index: 2 },
  { id: "#98528", coords: occurrenceCoordinates["#98528"], color: "#10b981", index: 3 },
  { id: "#98518", coords: occurrenceCoordinates["#98518"], color: "#ef4444", index: 4 },
  { id: "#98561", coords: occurrenceCoordinates["#98561"], color: "#8b5cf6", index: 5 },
  { id: "#98539", coords: occurrenceCoordinates["#98539"], color: "#10b981", index: 6 },
];

const fleetRoute: Array<[number, number]> = [
  [-25.6062, -49.4345],
  [-25.5962, -49.419],
  [-25.5915, -49.404],
  [-25.5879, -49.3922],
  [-25.5962, -49.3792],
];

function loadLeaflet() {
  if (typeof window === "undefined") return Promise.reject(new Error("Leaflet is only available in the browser."));
  if (window.L) return Promise.resolve(window.L);
  if (window.__leafletLoadPromise) return window.__leafletLoadPromise;

  window.__leafletLoadPromise = new Promise<LeafletGlobal>((resolve, reject) => {
    if (!document.querySelector("[data-leaflet-css]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.dataset.leafletCss = "true";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => (window.L ? resolve(window.L) : reject(new Error("Leaflet failed to initialize.")));
    script.onerror = () => reject(new Error("Leaflet failed to load."));
    document.body.appendChild(script);
  });

  return window.__leafletLoadPromise;
}

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

  const handleOpenOccurrence = useCallback((item: Occurrence) => setSelectedOccurrence(item), []);
  const handleCloseOccurrence = useCallback(() => setSelectedOccurrence(null), []);
  const handleRoleChange = useCallback((role: Role) => {
    setCurrentRole(role);
    setSelectedOccurrence(null);
    setNewOccurrenceModalOpen(false);
  }, []);

  const handleCreateOccurrence = useCallback((newOcc: Occurrence) => {
    setOccurrences((prev) => [newOcc, ...prev]);
    setNewOccurrenceModalOpen(false);
    setSelectedOccurrence(newOcc);
  }, []);

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden bg-[#f4f7f5] text-slate-900 font-sans antialiased ${newOccurrenceModalOpen ? "arau-modal-open" : ""}`}>
      {/* Role Switcher Bar */}
      <header className="sticky top-0 z-50 flex w-full flex-wrap items-center justify-between gap-3 border-b border-emerald-950/10 bg-slate-900 px-4 py-2.5 text-white shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-xs">
            <Radio className="h-4 w-4 animate-pulse text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-100 leading-tight">Perfil Ativo:</span>
            <span className="text-[11px] text-emerald-400 font-medium leading-tight">
              {currentRole === "prefeitura" && "Backoffice Prefeitura"}
              {currentRole === "cidadao" && "App do Cidadão (Mobile PWA)"}
              {currentRole === "equipe" && "Equipe de Rua (Ordem de Serviço)"}
              {currentRole === "frota" && "Central de Frota & IA"}
            </span>
          </div>
        </div>

        {/* Role Switch Buttons */}
        <div className="flex items-center gap-1.5 rounded-lg bg-slate-800 p-1">
          <button
            onClick={() => handleRoleChange("prefeitura")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              currentRole === "prefeitura" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Prefeitura</span>
          </button>

          <button
            onClick={() => handleRoleChange("cidadao")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              currentRole === "cidadao" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cidadão</span>
          </button>

          <button
            onClick={() => handleRoleChange("equipe")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              currentRole === "equipe" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Equipe de Rua</span>
          </button>

          <button
            onClick={() => handleRoleChange("frota")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              currentRole === "frota" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Frota & IA</span>
          </button>
        </div>

        {/* Global Action: New Occurrence */}
        <button
          onClick={() => setNewOccurrenceModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-xs transition hover:bg-emerald-400"
        >
          <BootstrapIcon name="camera" className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Nova ocorrência</span>
          <span className="md:hidden">Nova</span>
        </button>
      </header>

      {/* Role 1: Prefeitura Backoffice */}
      {currentRole === "prefeitura" && (
        <div className="grid min-h-[calc(100vh-48px)] w-full max-w-full lg:grid-cols-[280px_1fr]">
          <aside className="hidden border-r border-slate-200/80 bg-white lg:flex lg:flex-col lg:justify-between">
            <div className="flex flex-col">
              <Brand />

              <nav className="space-y-1 px-3 py-3">
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
                  <BootstrapIcon name="camera" className="h-4 w-4" /> Nova ocorrência
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
              <div className="fixed inset-0 z-[1200] flex lg:hidden">
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
                <OverviewSection onSelectOccurrence={handleOpenOccurrence} occurrences={occurrences} selectedOccurrence={selectedOccurrence} />
              )}
              {activeSection === "occurrences" && (
                <OccurrencesSection
                  occurrences={occurrences}
                  onSelectOccurrence={handleOpenOccurrence}
                  selectedOccurrence={selectedOccurrence}
                  viewMode={occurrencesViewMode}
                  setViewMode={setOccurrencesViewMode}
                />
              )}
              {activeSection === "map" && (
                <Panel title="Mapa Completo de Ocorrências e Monitoramento" action="Filtros avançados">
                  <CityMap expanded occurrences={occurrences} focusedOccurrence={selectedOccurrence} onSelectOccurrence={handleOpenOccurrence} />
                </Panel>
              )}
              {activeSection === "fleet" && <FleetSection occurrences={occurrences} focusedOccurrence={selectedOccurrence} onSelectOccurrence={handleOpenOccurrence} />}
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
          <FleetSection occurrences={occurrences} focusedOccurrence={selectedOccurrence} onSelectOccurrence={handleOpenOccurrence} />
        </div>
      )}

      {/* Occurrence Detail Drawer */}
      {selectedOccurrence && (currentRole === "prefeitura" || currentRole === "frota") && (
        <OccurrenceDetailDrawer occurrence={selectedOccurrence} onClose={handleCloseOccurrence} />
      )}

      {/* New Occurrence Modal */}
      {newOccurrenceModalOpen && (
        <NewOccurrenceModal onClose={() => setNewOccurrenceModalOpen(false)} onCreate={handleCreateOccurrence} />
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
      <img alt="Araucária em Ação" className="h-10 w-10 shrink-0" src="/city-logo.svg" />
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
  selectedOccurrence,
}: {
  onSelectOccurrence: (item: Occurrence) => void;
  occurrences: Occurrence[];
  selectedOccurrence: Occurrence | null;
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
          <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-700"><BootstrapIcon name="arrowUp" /> 8,7% <span className="font-normal text-slate-500">em relação à semana anterior</span></p>
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
          <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-700"><BootstrapIcon name="arrowUp" /> 12,3% <span className="font-normal text-slate-500">em relação à semana anterior</span></p>
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
          <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-700"><BootstrapIcon name="arrowUp" /> 15,1% <span className="font-normal text-slate-500">em relação à semana anterior</span></p>
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
          <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-700"><BootstrapIcon name="arrowDown" /> -0,6 dia <span className="font-normal text-slate-500">em relação à semana anterior</span></p>
        </div>
      </div>

      {/* Row 1: Map & Bairro Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <Panel title="Mapa de Ocorrências" action="Filtros" action2="Camadas">
            <CityMap occurrences={occurrences} focusedOccurrence={selectedOccurrence} onSelectOccurrence={onSelectOccurrence} />
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
  viewMode,
  setViewMode,
}: {
  occurrences: Occurrence[];
  onSelectOccurrence: (item: Occurrence) => void;
  selectedOccurrence: Occurrence | null;
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
          <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><BootstrapIcon name="arrowUp" className="h-3 w-3" /> 18,6% vs semana ant.</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Clock3 className="h-4 w-4" /></span>
            <div><p className="text-[11px] text-slate-500">Em Triagem</p><p className="text-lg font-bold text-slate-900">213</p></div>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><BootstrapIcon name="arrowUp" className="h-3 w-3" /> 8,4% vs semana ant.</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600"><FileCheck className="h-4 w-4" /></span>
            <div><p className="text-[11px] text-slate-500">Em Execução</p><p className="text-lg font-bold text-slate-900">438</p></div>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><BootstrapIcon name="arrowUp" className="h-3 w-3" /> 13,7% vs semana ant.</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></span>
            <div><p className="text-[11px] text-slate-500">Resolvidas</p><p className="text-lg font-bold text-slate-900">1.248</p></div>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><BootstrapIcon name="arrowUp" className="h-3 w-3" /> 12,7% vs semana ant.</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600"><ShieldAlert className="h-4 w-4" /></span>
            <div><p className="text-[11px] text-slate-500">Duplicadas</p><p className="text-lg font-bold text-slate-900">89</p></div>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><BootstrapIcon name="arrowDown" className="h-3 w-3" /> -6,7% vs semana ant.</p>
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
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700"><BootstrapIcon name="clock" className="h-3 w-3" /> SLA: {item.sla}</span>
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
    <div className="pointer-events-none fixed inset-0 z-[1100]">
      <button
        type="button"
        aria-label="Fechar ocorrência"
        className="pointer-events-auto absolute inset-0 bg-slate-900/15 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />
      <aside className="pointer-events-auto absolute bottom-3 right-3 top-20 z-10 flex w-[min(430px,calc(100vw-24px))] flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl sm:bottom-5 sm:right-5 sm:top-24">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold text-slate-900">Ocorrência {occurrence.id}</span>
            <StatusPill label={occurrence.status} />
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-5">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs">
            <img alt={occurrence.title} className="h-56 w-full object-cover" src={`/${occurrence.image}`} />
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-md bg-red-50 px-3 py-1 text-xs font-bold text-red-700">● {occurrence.priority}</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"><BootstrapIcon name="clock" /> SLA: {occurrence.sla}</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><BootstrapIcon name="person" /> {occurrence.source}</span>
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
function FleetSection({
  focusedOccurrence,
  occurrences = initialOccurrences,
  onSelectOccurrence,
}: {
  focusedOccurrence?: Occurrence | null;
  occurrences?: Occurrence[];
  onSelectOccurrence?: (item: Occurrence) => void;
}) {
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
          <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-700"><BootstrapIcon name="arrowUp" /> +12,4% em relação a ontem</p>
        </div>
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-700"><Zap className="h-6 w-6" /></div><div><p className="text-xs text-slate-500">Detecções por IA</p><p className="text-2xl font-bold text-slate-900">89</p></div></div>
          <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-700"><BootstrapIcon name="arrowUp" /> +18,7% em relação a ontem</p>
        </div>
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><ShieldCheck className="h-6 w-6" /></div><div><p className="text-xs text-slate-500">Confiança média</p><p className="text-2xl font-bold text-slate-900">92%</p></div></div>
          <p className="mt-3 text-xs font-semibold text-emerald-700">● Alta precisão das detecções</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <Panel title="Monitoramento em tempo real">
            <CityMap fleet occurrences={occurrences} focusedOccurrence={focusedOccurrence} onSelectOccurrence={onSelectOccurrence} />
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
    <div className="mx-auto w-full max-w-md p-0 sm:p-6">
      <div className="min-h-[calc(100vh-48px)] overflow-hidden bg-white shadow-none sm:min-h-0 sm:rounded-[36px] sm:border-4 sm:border-slate-800 sm:shadow-2xl">
        <div className="hidden items-center justify-between bg-white px-6 pt-3 pb-1 text-xs font-bold text-slate-800 sm:flex">
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
                    <span className="absolute bottom-1 left-1 inline-flex items-center gap-1 rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      <BootstrapIcon name="camera" className="h-3 w-3" /> {occ.photosCount || 1}
                    </span>
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
                <BootstrapIcon name="camera" className="h-4 w-4" /> Nova ocorrência
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

  return (
    <div className="mx-auto w-full max-w-md p-0 sm:p-6">
      <div className="min-h-[calc(100vh-48px)] overflow-hidden bg-white shadow-none sm:min-h-0 sm:rounded-[36px] sm:border-4 sm:border-slate-800 sm:shadow-2xl">
        <div className="hidden items-center justify-between bg-white px-6 pt-3 pb-1 text-xs font-bold text-slate-800 sm:flex">
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
              <button className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white">
                <BootstrapIcon name="play" className="h-4 w-4" /> Iniciar atendimento
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-600 bg-white py-2.5 text-xs font-bold text-emerald-800">
                <BootstrapIcon name="geoAlt" className="h-4 w-4" /> Cheguei ao local
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-600 bg-white py-2.5 text-xs font-bold text-emerald-800">
                <BootstrapIcon name="camera" className="h-4 w-4" /> Foto antes
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-600 bg-white py-2.5 text-xs font-bold text-emerald-800">
                <BootstrapIcon name="camera" className="h-4 w-4" /> Foto depois
              </button>
            </div>
            <button onClick={() => setServiceStatus("concluido")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 py-3 text-xs font-bold text-emerald-800">
              <BootstrapIcon name="checkCircle" className="h-4 w-4" /> Concluir serviço
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2 text-xs">
            <div className="flex justify-between font-bold"><span>Checklist de execução</span><span className="text-emerald-700">4/4</span></div>
            {["EPI utilizado", "Sinalização do local", "Material utilizado (Lâmpada 250W)", "Observações concluídas"].map((item) => (
              <p key={item} className="flex items-center gap-2">
                <BootstrapIcon name="checkCircle" className="h-3.5 w-3.5 text-emerald-700" /> {item}
              </p>
            ))}
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
// NEW OCCURRENCE MODAL
// ==========================================
function NewOccurrenceModal({ onClose, onCreate }: { onClose: () => void; onCreate: (occ: Occurrence) => void }) {
  const occurrenceTypes: Array<{
    category: Occurrence["category"];
    icon: BootstrapIconName;
    priority: Occurrence["priority"];
    title: string;
  }> = [
    { title: "Buraco na estrada", category: "Buracos", icon: "geoAlt", priority: "Alta" },
    { title: "Placa danificada", category: "Placas", icon: "signpost", priority: "Média" },
    { title: "Iluminação apagada", category: "Iluminação", icon: "lightbulb", priority: "Média" },
    { title: "Calçada irregular", category: "Calçadas", icon: "geoAlt", priority: "Baixa" },
    { title: "Entulho ou lixo", category: "Limpeza", icon: "trash", priority: "Média" },
  ];

  const sampleImages = [
    { title: "Buraco na estrada", img: "occurrences/pothole-road.png", category: "Buracos", location: "Rua Pedro Druszcz, 45 - Iguaçu" },
    { title: "Placa danificada", img: "occurrences/damaged-sign.png", category: "Placas", location: "Av. Victor do Amaral, 720 - Centro" },
    { title: "Iluminação apagada", img: "occurrences/streetlight-off.png", category: "Iluminação", location: "Rua das Araucárias, 1.245 - Costeira" },
    { title: "Calçada irregular", img: "occurrences/broken-sidewalk.png", category: "Calçadas", location: "Rua Santa Catarina, 450 - Fazenda Velha" },
    { title: "Entulho ou lixo", img: "occurrences/illegal-dumping.png", category: "Limpeza", location: "Rua das Flores, 890 - Thomaz Coelho" },
  ];

  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
  const [selectedSample, setSelectedSample] = useState(0);
  const [description, setDescription] = useState("");
  const currentType = occurrenceTypes[selectedTypeIndex];
  const currentSample = sampleImages[selectedSample];

  const chooseType = (index: number) => {
    setSelectedTypeIndex(index);
    const matchingPhoto = sampleImages.findIndex((photo) => photo.category === occurrenceTypes[index].category);
    if (matchingPhoto >= 0) setSelectedSample(matchingPhoto);
  };

  const handleFinish = () => {
    const jitter = () => (Math.random() - 0.5) * 0.018;

    onCreate({
      id: `#${Math.floor(100000 + Math.random() * 900000)}`,
      protocol: `PROTO-2025-${Math.floor(100000 + Math.random() * 900000)}`,
      title: currentType.title,
      category: currentType.category,
      neighborhood: currentSample.location.split("-")[1]?.trim() || "Araucária",
      address: currentSample.location,
      priority: currentType.priority,
      status: "Nova",
      image: currentSample.img,
      sla: "3 dias",
      source: "Cidadão (App)",
      date: "Hoje",
      time: "Agora",
      description: description || "Ocorrência registrada pelo cidadão com foto e localização.",
      confirmationsCount: 1,
      photosCount: 1,
      coords: [-25.5935 + jitter(), -49.4048 + jitter()],
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-3 pt-14 sm:items-center sm:p-4">
      <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative z-10 max-h-[78dvh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-48px)] sm:p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <BootstrapIcon name="camera" className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Nova ocorrência</h3>
              <p className="text-xs text-slate-500">Fotografe o problema e escolha o tipo do chamado.</p>
            </div>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1.05fr] md:gap-4">
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <img alt={currentType.title} className="h-28 w-full object-cover sm:h-44" src={`/${currentSample.img}`} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-xs font-bold text-emerald-800 sm:py-3">
                <BootstrapIcon name="camera" className="mb-1 h-4 w-4 sm:mb-1.5 sm:h-5 sm:w-5" />
                Abrir câmera
                <span className="mt-0.5 text-[10px] font-medium text-emerald-700">Fotografar agora</span>
                <input className="hidden" type="file" accept="image/*" capture="environment" />
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-bold text-slate-800 sm:py-3">
                <BootstrapIcon name="image" className="mb-1 h-4 w-4 text-slate-500 sm:mb-1.5 sm:h-5 sm:w-5" />
                Galeria
                <span className="mt-0.5 text-[10px] font-medium text-slate-500">Escolher arquivo</span>
                <input className="hidden" type="file" accept="image/*" />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="occurrence-type" className="mb-1.5 block text-xs font-bold text-slate-800">Tipo da ocorrência</label>
              <select
                id="occurrence-type"
                value={selectedTypeIndex}
                onChange={(event) => chooseType(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-hidden focus:border-emerald-500"
              >
                {occurrenceTypes.map((type, index) => (
                  <option key={type.title} value={index}>{type.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {occurrenceTypes.map((type, index) => (
                <button
                  key={type.title}
                  type="button"
                  onClick={() => chooseType(index)}
                  className={`flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-left text-[11px] font-bold transition sm:min-h-16 sm:text-xs ${
                    selectedTypeIndex === index ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
                  }`}
                >
                  <BootstrapIcon name={type.icon} className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  <span>{type.title}</span>
                </button>
              ))}
            </div>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descreva o problema encontrado..."
              maxLength={500}
              className="h-20 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-hidden focus:border-emerald-500 sm:h-24"
            />

            <button onClick={handleFinish} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700">
              <Send className="h-4 w-4" /> Registrar ocorrência
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAP COMPONENT
// ==========================================
function CityMap({
  fleet = false,
  expanded = false,
  focusedOccurrence,
  occurrences = initialOccurrences,
  onSelectOccurrence,
}: {
  fleet?: boolean;
  expanded?: boolean;
  focusedOccurrence?: Occurrence | null;
  occurrences?: Occurrence[];
  onSelectOccurrence?: (item: Occurrence) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;

    void loadLeaflet().then((leaflet) => {
      if (cancelled || !containerRef.current) return;

      const map = leaflet.map(containerRef.current, {
        attributionControl: true,
        scrollWheelZoom: true,
        zoomControl: false,
      }).setView([-25.5935, -49.4048], expanded ? 13 : 12);

      mapRef.current = map;

      leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      if (fleet) {
        leaflet.polyline(fleetRoute, {
          color: "#10b981",
          weight: 5,
          opacity: 0.72,
        }).addTo(map);
      }

      window.setTimeout(() => map.invalidateSize(), 80);

      const mapOccurrences = occurrences.length > 0 ? occurrences : initialOccurrences;

      mapOccurrences.forEach((occurrence, index) => {
        const fallbackPin = araucariaPins[index % araucariaPins.length];
        const coords = occurrence.coords ?? occurrenceCoordinates[occurrence.id] ?? fallbackPin.coords;
        const color =
          occurrence.status === "Resolvida" ? "#10b981" :
          occurrence.status === "Em triagem" || occurrence.status === "Em andamento" ? "#f59e0b" :
          occurrence.status === "Encaminhada" ? "#8b5cf6" :
          occurrence.source.includes("IA") ? "#3b82f6" :
          "#ef4444";
        const icon = leaflet.divIcon({
          className: "arau-leaflet-pin",
          iconAnchor: [17, 32],
          iconSize: [34, 34],
          html: `<span style="background:${color}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></span>`,
        });
        const marker = leaflet.marker(coords, { icon, title: occurrence.title });
        marker.addTo(map);
        marker.on?.("click", () => {
          map.invalidateSize();
          map.setView(coords, expanded ? 15 : 14);
          onSelectOccurrence?.(occurrence);
        });
      });
    }).catch(() => {
      // The fallback below keeps the layout usable if the map CDN is blocked.
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [expanded, fleet, occurrences, onSelectOccurrence]);

  useEffect(() => {
    if (!focusedOccurrence) return;
    const coords = focusedOccurrence.coords ?? occurrenceCoordinates[focusedOccurrence.id];
    if (!coords) return;

    const timer = window.setTimeout(() => {
      mapRef.current?.invalidateSize();
      mapRef.current?.setView(coords, expanded ? 15 : 14);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [expanded, focusedOccurrence]);

  return (
    <div className={`arau-city-map relative w-full overflow-hidden rounded-xl bg-[#e8efe9] border border-slate-200/80 ${expanded ? "h-[420px]" : "h-[280px] sm:h-[340px]"}`}>
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-1.5 shadow-xs">
        <span className="text-xs font-bold text-slate-800">Araucária • Paraná</span>
      </div>
      <div className="absolute right-3 top-3 grid gap-2">
        <button type="button" onClick={() => mapRef.current?.zoomIn()} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-lg font-bold text-slate-700 shadow-xs">+</button>
        <button type="button" onClick={() => mapRef.current?.zoomOut()} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-lg font-bold text-slate-700 shadow-xs">-</button>
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
