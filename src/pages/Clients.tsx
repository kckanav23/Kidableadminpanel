import { useState } from 'react';
import { Link } from 'react-router-dom';
import { clients, currentUser } from '../lib/mockData';
import { Client } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ClientAvatar } from '../components/ClientAvatar';
import { TherapyBadge } from '../components/TherapyBadge';
import { Search, ArrowRight, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function Clients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'my' | 'all'>(
    currentUser.role === 'therapist' ? 'my' : 'all'
  );

  let filteredClients = clients;

  // Filter by view mode
  if (viewMode === 'my' && currentUser.role === 'therapist') {
    filteredClients = filteredClients.filter(c => c.primaryTherapistId === currentUser.id);
  }

  // Filter by search
  if (searchQuery) {
    filteredClients = filteredClients.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter by status
  if (statusFilter !== 'all') {
    filteredClients = filteredClients.filter(c => c.status === statusFilter);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Clients</h1>
        <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
          <Plus className="size-4" />
          New Client
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {currentUser.role === 'therapist' && (
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'my' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('my')}
                  className={viewMode === 'my' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                >
                  My Clients
                </Button>
                <Button
                  variant={viewMode === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('all')}
                  className={viewMode === 'all' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                >
                  All Clients
                </Button>
              </div>
            )}

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Client List */}
      <Card>
        <CardHeader>
          <CardTitle>{filteredClients.length} Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No clients found</p>
              <Button variant="outline">Clear Filters</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredClients.map(client => (
                <Link
                  key={client.id}
                  to={`/clients/${client.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                >
                  <ClientAvatar
                    name={`${client.firstName} ${client.lastName}`}
                    photoUrl={client.photoUrl}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{client.firstName} {client.lastName}</p>
                    <p className="text-sm text-slate-600">{client.age} years old</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {client.therapyTypes.map(type => (
                      <TherapyBadge key={type} type={type} showLabel={false} />
                    ))}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      client.status === 'active'
                        ? 'text-green-700 border-green-700'
                        : 'text-slate-600 border-slate-300'
                    }
                  >
                    {client.status}
                  </Badge>
                  <ArrowRight className="size-4 text-slate-400" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
