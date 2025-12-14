import type { ClientProfile as ClientProfileType } from '../../types/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface ClientProfileProps {
  client: ClientProfileType;
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
            <p className="font-medium">
              {client.dateOfBirth ? formatDate(new Date(client.dateOfBirth)) : 'N/A'}
            </p>
          </div>
          {client.age !== undefined && (
            <div>
              <p className="text-sm text-slate-600">Age</p>
              <p className="font-medium">{client.age} years old</p>
            </div>
          )}
          {client.pronouns && (
            <div>
              <p className="text-sm text-slate-600">Pronouns</p>
              <p className="font-medium">{client.pronouns}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sensory Profile */}
      {client.sensoryProfile && Object.keys(client.sensoryProfile).length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sensory Profile</CardTitle>
            <Button variant="ghost" size="sm" className="gap-2">
              <Edit className="size-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(client.sensoryProfile).map(([key, value]) => {
              const icons: Record<string, string> = {
                visual: '👁️',
                auditory: '👂',
                tactile: '✋',
                vestibular: '🔄',
                proprioceptive: '💪',
              };
              return (
                <div key={key} className="flex gap-3">
                  <span className="text-xl">{icons[key] || '📝'}</span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 capitalize">{key}</p>
                    <p>{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                  </div>
                </div>
              );
            })}
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
          <CardContent className="space-y-3">
            {client.communicationStyles.map((style, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {style.method.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-slate-600 capitalize">
                  ({style.proficiency.replace('_', ' ')})
                </span>
                {style.notes && (
                  <span className="text-sm text-slate-500">- {style.notes}</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Initial Assessment */}
      {client.initialAssessment && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Initial Assessment</CardTitle>
            <Button variant="ghost" size="sm" className="gap-2">
              <Edit className="size-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{client.initialAssessment}</p>
          </CardContent>
        </Card>
      )}

      {/* Support Network */}
      {client.supportNetwork && client.supportNetwork.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Support Network</CardTitle>
            <Button variant="ghost" size="sm" className="gap-2">
              <Edit className="size-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.supportNetwork.map((contact, idx) => (
              <div key={idx} className="border-l-2 border-slate-200 pl-4">
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-slate-600">{contact.role}</p>
                {contact.contact && (
                  <p className="text-sm text-slate-500">{contact.contact}</p>
                )}
                {contact.notes && (
                  <p className="text-sm text-slate-500 mt-1">{contact.notes}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Initial Goals */}
      {client.initialGoals && client.initialGoals.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Initial Goals</CardTitle>
            <Button variant="ghost" size="sm" className="gap-2">
              <Edit className="size-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.initialGoals.map((goal) => (
              <div key={goal.id} className="border-l-2 border-teal-200 pl-4">
                <p className="font-medium">{goal.goalText}</p>
                <div className="flex items-center gap-2 mt-1">
                  {goal.therapy && (
                    <Badge variant="outline" className="text-xs">
                      {goal.therapy}
                    </Badge>
                  )}
                  {goal.setBy && (
                    <span className="text-xs text-slate-500">Set by: {goal.setBy}</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
