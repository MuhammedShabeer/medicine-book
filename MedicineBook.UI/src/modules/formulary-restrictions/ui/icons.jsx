// Explicit icon imports keep the bundle small (tree-shaken) and let data refer to icons by name.
import {
  Search, X, Play, ShieldCheck, UserCheck, ScrollText, Stethoscope, CircleCheck, BadgeAlert, Lock, UserRoundCheck, Split,
  ListChecks, GraduationCap, Unlink, Pill, Syringe, Droplets, FlaskRound, Hand, Wind, Bandage, Package, FileQuestion, Hash,
  CalendarCheck, PackageCheck, Pin, PinOff, Copy, Link, Maximize2, Pencil, LayoutDashboard, LayoutGrid, SlidersHorizontal,
  ChevronDown, ChevronLeft, ChevronRight, Check, Moon, Sun, ArrowLeft, ChartColumn, History, Download, Plus, Trash2, Undo2,
  RefreshCw, Info, Users, SearchX, MousePointerClick, Flame, TextSearch, CircleHelp, Database, WandSparkles, Braces, Sheet,
  KeyRound, CircleAlert, GitBranchPlus, Shield, FileText, WifiOff, Shapes, Clipboard, Plug, PencilLine, SearchCheck,
} from 'lucide-react';

const MAP = {
  Search, X, Play, ShieldCheck, UserCheck, ScrollText, Stethoscope, CircleCheck, BadgeAlert, Lock, UserRoundCheck, Split,
  ListChecks, GraduationCap, Unlink, Pill, Syringe, Droplets, FlaskRound, Hand, Wind, Bandage, Package, FileQuestion, Hash,
  CalendarCheck, PackageCheck, Pin, PinOff, Copy, Link, Maximize2, Pencil, LayoutDashboard, LayoutGrid, SlidersHorizontal,
  ChevronDown, ChevronLeft, ChevronRight, Check, Moon, Sun, ArrowLeft, ChartColumn, History, Download, Plus, Trash2, Undo2,
  RefreshCw, Info, Users, SearchX, MousePointerClick, Flame, TextSearch, CircleHelp, Database, WandSparkles, Braces, Sheet,
  KeyRound, CircleAlert, GitBranchPlus, Shield, FileText, WifiOff, Shapes, Clipboard, Plug, PencilLine, SearchCheck,
};

export function Icon({ name, ...rest }) {
  const C = MAP[name] || FileText;
  return <C aria-hidden="true" className="lucide" {...rest} />;
}

/** Restrictions logo: a medicine capsule held inside a protective shield, with a padlock for access-controlled prescribing. */
export function RestrictionMark({ size = 30 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path d="M22 4.5 36 9.6V21c0 9-6 16.4-14 19.8C14 37.4 8 30 8 21V9.6Z" fill="#fff" fillOpacity=".14" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
      <g transform="rotate(-45 22 21.4)">
        <rect x="17.8" y="12.6" width="8.4" height="17.6" rx="4.2" fill="#fff" fillOpacity=".28" stroke="#fff" strokeWidth="2.4" />
        <path d="M17.8 21.4V16.8a4.2 4.2 0 0 1 8.4 0v4.6Z" fill="#fff" />
      </g>
      <path d="M32 31.5v-2.6a4 4 0 0 1 8 0v2.6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="29" y="31.5" width="14" height="11.5" rx="3" fill="#fff" />
      <circle cx="36" cy="36.4" r="1.6" fill="#8A1538" />
      <path d="M36 37.4v2.3" fill="none" stroke="#8A1538" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
