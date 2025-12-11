import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { ClientDetail } from './pages/ClientDetail';
import { Strategies } from './pages/Strategies';
import { Resources } from './pages/Resources';
import { Therapists } from './pages/Therapists';
import { Parents } from './pages/Parents';
import { AccessCodes } from './pages/AccessCodes';
import { AuditLogs } from './pages/AuditLogs';
import { Login } from './pages/Login';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

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
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-[#FEFDFB]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-7xl mx-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:clientId" element={<ClientDetail />} />
              <Route path="/strategies" element={<Strategies />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/therapists" element={<Therapists />} />
              <Route path="/parents" element={<Parents />} />
              <Route path="/access-codes" element={<AccessCodes />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthenticatedApp />
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}