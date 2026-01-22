import { useState } from 'react';
import { Package, Droplets, Stethoscope, LogOut, Leaf, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceQuery } from '@/components/VoiceQuery';
import { VoiceHerbAdd } from '@/components/VoiceHerbAdd';
import { InventorySection } from '@/components/InventorySection';
import { AddHerbDialog } from '@/components/AddHerbDialog';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

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
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Herbal Inventory</h1>
              <p className="text-xs text-muted-foreground">Your medicinary tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AddHerbDialog />
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Voice Section */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">Voice Controls</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <VoiceQuery />
            <VoiceHerbAdd />
          </div>
        </section>

        {/* Inventory Grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Inventory</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search herbs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <InventorySection
              location="backstock"
              title="Backstock"
              icon={<Package className="h-5 w-5 text-blue-600" />}
              description="Storage inventory"
              searchQuery={searchQuery}
            />
            <InventorySection
              location="tincture"
              title="Tinctures"
              icon={<Droplets className="h-5 w-5 text-purple-600" />}
              description="Currently brewing"
              searchQuery={searchQuery}
            />
            <InventorySection
              location="clinic"
              title="Clinic Stock"
              icon={<Stethoscope className="h-5 w-5 text-green-600" />}
              description="Ready to use"
              searchQuery={searchQuery}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
