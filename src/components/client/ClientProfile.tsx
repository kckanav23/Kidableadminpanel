import { Client } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface ClientProfileProps {
  client: Client;
}

export function ClientProfile({ client }: ClientProfileProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Basic Information</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2">
            <Edit className="size-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-600">Full Name</p>
            <p className="font-medium">{client.firstName} {client.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Date of Birth</p>
            <p className="font-medium">{formatDate(client.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Age</p>
            <p className="font-medium">{client.age} years old</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Therapy Start Date</p>
            <p className="font-medium">{formatDate(client.therapyStartDate)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Status</p>
            <Badge variant="outline" className="text-green-700 border-green-700">
              {client.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Sensory Profile */}
      {client.sensoryProfile && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sensory Profile</CardTitle>
            <Button variant="ghost" size="sm" className="gap-2">
              <Edit className="size-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.sensoryProfile.visual && (
              <div className="flex gap-3">
                <span className="text-xl">👁️</span>
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Visual</p>
                  <p>{client.sensoryProfile.visual}</p>
                </div>
              </div>
            )}
            {client.sensoryProfile.auditory && (
              <div className="flex gap-3">
                <span className="text-xl">👂</span>
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Auditory</p>
                  <p>{client.sensoryProfile.auditory}</p>
                </div>
              </div>
            )}
            {client.sensoryProfile.tactile && (
              <div className="flex gap-3">
                <span className="text-xl">✋</span>
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Tactile</p>
                  <p>{client.sensoryProfile.tactile}</p>
                </div>
              </div>
            )}
            {client.sensoryProfile.vestibular && (
              <div className="flex gap-3">
                <span className="text-xl">🔄</span>
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Vestibular</p>
                  <p>{client.sensoryProfile.vestibular}</p>
                </div>
              </div>
            )}
            {client.sensoryProfile.proprioceptive && (
              <div className="flex gap-3">
                <span className="text-xl">💪</span>
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Proprioceptive</p>
                  <p>{client.sensoryProfile.proprioceptive}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preferences & Dislikes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preferences & Dislikes</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2">
            <Edit className="size-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {client.preferences && client.preferences.length > 0 && (
            <div>
              <p className="text-sm text-slate-600 mb-2">❤️ Likes</p>
              <div className="flex flex-wrap gap-2">
                {client.preferences.map((pref, idx) => (
                  <Badge key={idx} variant="secondary">{pref}</Badge>
                ))}
              </div>
            </div>
          )}
          {client.dislikes && client.dislikes.length > 0 && (
            <div>
              <p className="text-sm text-slate-600 mb-2">⚠️ Dislikes / Triggers</p>
              <div className="flex flex-wrap gap-2">
                {client.dislikes.map((dislike, idx) => (
                  <Badge key={idx} variant="outline" className="border-red-300 text-red-700">
                    {dislike}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Communication Styles */}
      {client.communicationStyles && client.communicationStyles.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Communication Styles</CardTitle>
            <Button variant="ghost" size="sm" className="gap-2">
              <Edit className="size-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {client.communicationStyles.map((style, idx) => (
                <Badge key={idx} variant="outline">{style}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
