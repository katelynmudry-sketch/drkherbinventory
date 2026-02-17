import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory } from "@/hooks/useInventory";
import { Leaf } from "lucide-react";

const Reports = () => {
  const { data: inventory = [], isLoading } = useInventory();

  const totalItems = inventory.length;
  const tinctures = inventory.filter((item) => item.location === "tincture");
  const bulk = inventory.filter((item) => item.location === "bulk");
  const clinic = inventory.filter((item) => item.location === "clinic");
  const backstock = inventory.filter((item) => item.location === "backstock");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Overview</h1>
            <p className="text-sm text-muted-foreground">
              High-level snapshot of your herbal inventory across locations.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalItems}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tinctures</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{tinctures.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bulk herbs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{bulk.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clinic stock</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{clinic.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Backstock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{backstock.length}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Items stored in backstock and not yet in active clinic use.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;



