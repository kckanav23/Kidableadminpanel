import { useState } from 'react';
import { users, currentUser } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Plus, Mail, UserPlus } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { THERAPY_LABELS } from '../lib/constants';

export function Therapists() {
  const [searchQuery, setSearchQuery] = useState('');

  const therapists = users.filter(u => u.role === 'therapist');
  
  let filteredTherapists = therapists;

  if (searchQuery) {
    filteredTherapists = filteredTherapists.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Therapist Directory</h1>
        {currentUser.role === 'admin' && (
          <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
            <Plus className="size-4" />
            Add Therapist
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Therapists List */}
      <Card>
        <CardHeader>
          <CardTitle>{filteredTherapists.length} Therapists</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTherapists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No therapists found</p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTherapists.map(therapist => (
                <Card key={therapist.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center size-12 rounded-full bg-teal-100 text-teal-700">
                        <span className="text-lg">👩‍⚕️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{therapist.name}</h3>
                          <Badge
                            variant="outline"
                            className={
                              therapist.status === 'active'
                                ? 'text-green-700 border-green-700'
                                : 'text-slate-600 border-slate-300'
                            }
                          >
                            {therapist.status}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-slate-600">
                          <p className="flex items-center gap-2">
                            <Mail className="size-4" />
                            {therapist.email}
                          </p>
                          {therapist.specializations && therapist.specializations.length > 0 && (
                            <p>
                              <span className="text-slate-500">Specializations: </span>
                              {therapist.specializations.map(s => THERAPY_LABELS[s]).join(', ')}
                            </p>
                          )}
                          {therapist.lastLogin && (
                            <p className="text-slate-500">
                              Last login: {formatDate(therapist.lastLogin)}
                            </p>
                          )}
                        </div>
                      </div>

                      {currentUser.role === 'admin' && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <UserPlus className="size-4" />
                            Access Code
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
