import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateWorkspaceConfig } from '@/hooks/useWorkspaceConfig';
import { WorkspaceConfig } from '@/lib/workspaceConfigDefaults';
import { IndustryPicker } from '@/components/onboarding/IndustryPicker';
import { LocationEditor } from '@/components/onboarding/LocationEditor';
import { StatusEditor } from '@/components/onboarding/StatusEditor';
import { ReviewStep } from '@/components/onboarding/ReviewStep';
import { toast } from 'sonner';

type Step = 'industry' | 'locations' | 'statuses' | 'review';

const STEPS: { id: Step; label: string }[] = [
  { id: 'industry', label: 'Industry' },
  { id: 'locations', label: 'Locations' },
  { id: 'statuses', label: 'Statuses' },
  { id: 'review', label: 'Review' },
];

const Onboarding = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const updateConfig = useUpdateWorkspaceConfig();

  const [stepIndex, setStepIndex] = useState(0);
  const [industryKey, setIndustryKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<WorkspaceConfig | null>(null);

  const step = STEPS[stepIndex].id;

  const handleSelectIndustry = (key: string, config: WorkspaceConfig) => {
    setIndustryKey(key);
    setDraft(config);
  };

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const canAdvance = step !== 'industry' || draft !== null;

  const handleConfirm = () => {
    if (!draft) return;
    updateConfig.mutate(draft, {
      onSuccess: () => {
        toast.success(`Workspace configured for ${draft.item_label_plural}`);
        navigate('/');
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to save configuration');
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20">
      <main className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Set up your workspace</h1>
            <p className="text-sm text-muted-foreground">
              Tell us about your business so we can tailor inventory, voice commands, and terminology to it.
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  i < stepIndex
                    ? 'bg-primary text-primary-foreground'
                    : i === stepIndex
                    ? 'border-2 border-primary text-primary'
                    : 'border text-muted-foreground'
                }`}
              >
                {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`text-sm ${i === stepIndex ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-background/60 p-6">
          {step === 'industry' && (
            <IndustryPicker selectedKey={industryKey} onSelect={handleSelectIndustry} />
          )}

          {step === 'locations' && draft && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="item-singular">What do you call one item?</Label>
                  <Input
                    id="item-singular"
                    value={draft.item_label_singular}
                    onChange={(e) => setDraft({ ...draft, item_label_singular: e.target.value })}
                    placeholder="e.g. herb, product, material"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="item-plural">What do you call them as a group?</Label>
                  <Input
                    id="item-plural"
                    value={draft.item_label_plural}
                    onChange={(e) => setDraft({ ...draft, item_label_plural: e.target.value })}
                    placeholder="e.g. herbs, products, materials"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Where do you keep {draft.item_label_plural || 'items'}?</Label>
                <LocationEditor
                  locations={draft.locations}
                  onChange={(locations) => setDraft({ ...draft, locations })}
                />
              </div>
            </div>
          )}

          {step === 'statuses' && draft && (
            <div className="space-y-1.5">
              <Label>What statuses should {draft.item_label_plural || 'items'} have?</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Click a status pill to change its color.
              </p>
              <StatusEditor
                statuses={draft.statuses}
                onChange={(statuses) => setDraft({ ...draft, statuses })}
              />
            </div>
          )}

          {step === 'review' && draft && <ReviewStep config={draft} />}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={goBack} disabled={stepIndex === 0} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step === 'review' ? (
            <Button onClick={handleConfirm} disabled={!draft || updateConfig.isPending} className="gap-2">
              <Check className="h-4 w-4" />
              {updateConfig.isPending ? 'Saving...' : 'Confirm & finish'}
            </Button>
          ) : (
            <Button onClick={goNext} disabled={!canAdvance} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
