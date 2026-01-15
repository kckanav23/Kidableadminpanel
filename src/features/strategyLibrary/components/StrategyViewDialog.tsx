import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { STRATEGY_TYPE_LABELS, ZONE_LABELS } from '@/lib/constants';
import type { StrategyResponse } from '@/types/api';
import { isStrategyTypeKey } from '@/features/strategyLibrary/utils/mappers';

export function StrategyViewDialog({
  open,
  onOpenChange,
  strategy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy: StrategyResponse | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{strategy?.title || 'Strategy Details'}</DialogTitle>
          <DialogDescription>View complete strategy information</DialogDescription>
        </DialogHeader>
        {strategy ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-slate-600">Type</Label>
              <Badge variant="outline" className="text-teal-700 border-teal-700">
                {STRATEGY_TYPE_LABELS[isStrategyTypeKey(strategy.type) ? strategy.type : 'antecedent']}
              </Badge>
              {strategy.targetZone ? (
                <Badge variant="secondary" className="capitalize">
                  {ZONE_LABELS[strategy.targetZone as keyof typeof ZONE_LABELS]}
                </Badge>
              ) : null}
            </div>
            {strategy.description ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">Description</Label>
                <p className="mt-1 text-sm">{strategy.description}</p>
              </div>
            ) : null}
            {strategy.whenToUse ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">When to Use</Label>
                <p className="mt-1 text-sm">{strategy.whenToUse}</p>
              </div>
            ) : null}
            {strategy.howToUse ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">How to Use</Label>
                <p className="mt-1 text-sm whitespace-pre-line">{strategy.howToUse}</p>
              </div>
            ) : null}
            {strategy.steps && strategy.steps.length > 0 ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">Steps</Label>
                <ul className="mt-1 text-sm list-disc list-inside space-y-1">
                  {strategy.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {strategy.examples && strategy.examples.length > 0 ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">Examples</Label>
                <ul className="mt-1 text-sm list-disc list-inside space-y-1">
                  {strategy.examples.map((example, idx) => (
                    <li key={idx}>{example}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {strategy.createdAt ? (
              <div>
                <Label className="text-sm font-medium text-slate-600">Created</Label>
                <p className="mt-1 text-sm">{new Date(strategy.createdAt).toLocaleString()}</p>
              </div>
            ) : null}
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


