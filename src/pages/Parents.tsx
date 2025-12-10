import { useState } from 'react';
import { parents, clients } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Mail, Phone } from 'lucide-react';

export function Parents() {
  const [searchQuery, setSearchQuery] = useState('');

  let filteredParents = parents;

  if (searchQuery) {
    filteredParents = filteredParents.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

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
          <CardTitle>{filteredParents.length} Parents</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredParents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No parents found</p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredParents.map(parent => {
                const childrenNames = parent.childrenIds
                  .map(id => {
                    const child = clients.find(c => c.id === id);
                    return child ? `${child.firstName} ${child.lastName}` : null;
                  })
                  .filter(Boolean);

                return (
                  <Card key={parent.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center size-12 rounded-full bg-blue-100 text-blue-700">
                          <span className="text-lg">👤</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{parent.name}</h3>
                            {parent.isPrimary && (
                              <Badge variant="default" className="bg-teal-600">Primary</Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={
                                parent.status === 'active'
                                  ? 'text-green-700 border-green-700'
                                  : 'text-slate-600 border-slate-300'
                              }
                            >
                              {parent.status}
                            </Badge>
                          </div>

                          <p className="text-sm text-slate-600 mb-2">{parent.relationship}</p>

                          <div className="space-y-1 text-sm text-slate-600">
                            <p className="flex items-center gap-2">
                              <Mail className="size-4" />
                              {parent.email}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="size-4" />
                              {parent.phone}
                            </p>
                            {childrenNames.length > 0 && (
                              <p className="text-slate-500">
                                Children: {childrenNames.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
