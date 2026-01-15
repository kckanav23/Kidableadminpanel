import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/features/auth';

const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Clients = lazy(() => import('@/pages/Clients').then((m) => ({ default: m.Clients })));
const ClientDetail = lazy(() => import('@/pages/ClientDetail').then((m) => ({ default: m.ClientDetail })));
const Sessions = lazy(() => import('@/pages/Sessions').then((m) => ({ default: m.Sessions })));
const Strategies = lazy(() => import('@/pages/Strategies').then((m) => ({ default: m.Strategies })));
const Resources = lazy(() => import('@/pages/Resources').then((m) => ({ default: m.Resources })));
const Therapists = lazy(() => import('@/pages/Therapists').then((m) => ({ default: m.Therapists })));
const Parents = lazy(() => import('@/pages/Parents').then((m) => ({ default: m.Parents })));
const AuditLogs = lazy(() => import('@/pages/AuditLogs').then((m) => ({ default: m.AuditLogs })));
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto mb-3" />
        <p className="text-slate-600">Loading…</p>
      </div>
    </div>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FEFDFB]">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-[#0B5B45] mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Login />
      </Suspense>
    );
  }

  return (
    <div className="flex h-screen bg-[#FEFDFB]">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-7xl mx-auto p-6">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:clientId" element={<ClientDetail />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/strategies" element={<Strategies />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/therapists" element={<Therapists />} />
                <Route path="/parents" element={<Parents />} />
                <Route path="/audit-logs" element={<AuditLogs />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <Router>
      <AuthenticatedApp />
    </Router>
  );
}


