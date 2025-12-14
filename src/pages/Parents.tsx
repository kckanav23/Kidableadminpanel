import { useState, useEffect } from 'react';
import { getApiClient, handleApiError } from '../lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Mail, Phone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ParentResponse } from '../types/api';

export function Parents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [parents, setParents] = useState<ParentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch parents from API
  useEffect(() => {
    const fetchParents = async () => {
      setLoading(true);
      try {
        const api = getApiClient();
        const response = await api.adminParents.list6({
          q: searchQuery || undefined,
          size: 100, // Get all parents for now
        });
        setParents(response.items || []);
      } catch (error) {
        handleApiError(error, 'Failed to load parents');
        setParents([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search - wait 300ms after user stops typing
    const timeoutId = setTimeout(() => {
      fetchParents();
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Parent Directory</h1>
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

      {/* Parents List */}
      <Card>
        <CardHeader>
          <CardTitle>{parents.length} Parents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45]" />
              <span className="ml-2 text-slate-600">Loading parents...</span>
            </div>
          ) : parents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">
                {searchQuery ? 'No parents found matching your search' : 'No parents found'}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {parents.map(parent => (
                <Card key={parent.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center size-12 rounded-full bg-blue-100 text-blue-700">
                        <span className="text-lg">👤</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{parent.fullName || 'Unknown'}</h3>
                          <Badge
                            variant="outline"
                            className={
                              parent.status === 'active'
                                ? 'text-green-700 border-green-700'
                                : 'text-slate-600 border-slate-300'
                            }
                          >
                            {parent.status || 'unknown'}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-slate-600">
                          {parent.email && (
                            <p className="flex items-center gap-2">
                              <Mail className="size-4" />
                              {parent.email}
                            </p>
                          )}
                          {parent.phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="size-4" />
                              {parent.phone}
                            </p>
                          )}
                        </div>
                      </div>
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
