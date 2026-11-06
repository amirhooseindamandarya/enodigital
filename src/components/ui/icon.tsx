import {
  ArrowLeft, ArrowUpLeft, Bell, Bike, BookOpen, Briefcase, Building2, Cake, ChartColumn, Check, ChevronDown, Clock,
  Code, Coffee, Contact, CreditCard, DoorOpen, ExternalLink, FileSpreadsheet, FileText, Filter, Layers, LifeBuoy,
  ListChecks, Lock, Mail, MapPin, MessageSquare, Paperclip, PenTool, Percent, Phone, Plug, Puzzle, QrCode, Receipt,
  Search, ShieldCheck, Smartphone, Sparkles, Store, Tag, Target, User, Users, Utensils, Wallet, Workflow, Wrench, X,
  type LucideProps,
} from "lucide-react";

export const icons = {
  arrow: ArrowLeft, arrowUp: ArrowUpLeft, bell: Bell, bike: Bike, menu: BookOpen, briefcase: Briefcase, building: Building2,
  cake: Cake, chart: ChartColumn, check: Check, chevron: ChevronDown, clock: Clock, code: Code, coffee: Coffee,
  contact: Contact, card: CreditCard, door: DoorOpen, external: ExternalLink, sheet: FileSpreadsheet, file: FileText,
  funnel: Filter, layers: Layers, lifebuoy: LifeBuoy, status: ListChecks, lock: Lock, mail: Mail, map: MapPin,
  message: MessageSquare, clip: Paperclip, pen: PenTool, percent: Percent, phone: Phone, plug: Plug, puzzle: Puzzle,
  qr: QrCode, receipt: Receipt, search: Search, shield: ShieldCheck, mobile: Smartphone, sparkles: Sparkles,
  store: Store, tag: Tag, target: Target, user: User, users: Users, utensils: Utensils, wallet: Wallet,
  workflow: Workflow, wrench: Wrench, x: X,
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = icons[name];
  return <C aria-hidden="true" strokeWidth={1.75} {...props} />;
}
