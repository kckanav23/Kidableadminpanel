import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Plus, Key, Copy, X } from 'lucide-react';
import { formatDate } from '../lib/utils';

// Mock access codes data
const accessCodes = [
  {
    id: '1',
    code: 'ANNA-2025-****',
    fullCode: 'ANNA-2025-ABC123',
    userId: '1',
    userName: 'Anna Martinez',
    isAdmin: false,
    createdDate: new Date('2025-01-15'),
    lastUsed: new Date('2025-12-08T08:00:00'),
    status: 'active',
  },
  {
    id: '2',
    code: 'CHEN-2025-****',
    fullCode: 'CHEN-2025-XYZ789',
    userId: '2',
    userName: 'Dr. Sarah Chen',
    isAdmin: true,
    createdDate: new Date('2024-08-01'),
    lastUsed: new Date('2025-12-08T07:30:00'),
    status: 'active',
  },
  {
    id: '3',
    code: 'DAVID-2025-****',
    fullCode: 'DAVID-2025-DEF456',
    userId: '3',
    userName: 'David Williams',
    isAdmin: false,
    createdDate: new Date('2025-03-20'),
    lastUsed: new Date('2025-12-07T16:00:00'),
    status: 'active',
  },
];

export function AccessCodes() {
  const handleCopyCode = (fullCode: string) => {
    navigator.clipboard.writeText(fullCode);
    alert(`Access code copied: ${fullCode}`);
  };

  const handleRevoke = (userName: string) => {
    if (confirm(`Are you sure you want to revoke the access code for ${userName}?`)) {
      alert('Access code revoked (demo)');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Access Codes</h1>
        <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
          <Plus className="size-4" />
          Generate New Code
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{accessCodes.length} Active Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {accessCodes.map(code => (
              <Card key={code.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center size-12 rounded-lg bg-teal-100">
                      <Key className="size-6 text-teal-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium font-mono">{code.code}</h3>
                        {code.isAdmin && (
                          <Badge variant="default" className="bg-purple-600">Admin</Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={
                            code.status === 'active'
                              ? 'text-green-700 border-green-700'
                              : 'text-red-700 border-red-700'
                          }
                        >
                          {code.status}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-slate-600">
                        <p>
                          <span className="text-slate-500">User: </span>
                          {code.userName}
                        </p>
                        <p>
                          <span className="text-slate-500">Created: </span>
                          {formatDate(code.createdDate)}
                        </p>
                        <p>
                          <span className="text-slate-500">Last used: </span>
                          {formatDate(code.lastUsed)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleCopyCode(code.fullCode)}
                      >
                        <Copy className="size-4" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRevoke(code.userName)}
                      >
                        <X className="size-4" />
                        Revoke
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="text-2xl">ℹ️</div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">About Access Codes</p>
              <p className="text-blue-800">
                Access codes are used for staff authentication. Each staff member receives a unique code
                that they use to log in to the admin portal. Admin codes grant full access to all features,
                while therapist codes provide limited access appropriate to their role.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
