import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory, InventoryItem, InventoryLocation } from "@/hooks/useInventory";
import { DEFAULT_LOW_THRESHOLD, formatLbs } from "@/lib/bulkUnits";
import { Leaf } from "lucide-react";

// Locations that track an actual lb quantity (status is derived from quantity vs. the herb's threshold)
const LB_LOCATIONS: ReadonlySet<InventoryLocation> = new Set(["bulk", "bulk_backstock", "bulk_clinic"]);

const LOCATION_CARDS: { location: InventoryLocation; title: string }[] = [
  { location: "tincture", title: "Tinctures" },
  { location: "bulk", title: "Bulk herbs" },
  { location: "bulk_clinic", title: "Clinic Bulk" },
  { location: "bulk_backstock", title: "Bulk Backstock" },
  { location: "clinic", title: "Clinic stock" },
  { location: "backstock", title: "Backstock" },
];

type Level = "out" | "low" | "ok";

const levelOf = (item: InventoryItem): Level => {
  if (LB_LOCATIONS.has(item.location as InventoryLocation)) {
    const qty = Number(item.quantity ?? 0);
    const threshold = Number(item.herbs?.low_threshold_lb ?? DEFAULT_LOW_THRESHOLD);
    if (qty <= 0) return "out";
    if (qty <= threshold) return "low";
    return "ok";
  }
  if (item.status === "out") return "out";
  if (item.status === "low") return "low";
  return "ok";
};

const Reports = () => {
  const { data: inventory = [], isLoading } = useInventory();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading reports...</p>
      </div>
    );
  }

  const stats = LOCATION_CARDS.map(({ location, title }) => {
    const items = inventory.filter((item) => item.location === location);
    const levels = items.map(levelOf);
    const isLb = LB_LOCATIONS.has(location);
    return {
      location,
      title,
      isLb,
      total: items.length,
      out: levels.filter((l) => l === "out").length,
      low: levels.filter((l) => l === "low").length,
      lbs: isLb ? items.reduce((sum, i) => sum + Number(i.quantity ?? 0), 0) : null,
    };
  });

  const totalOut = stats.reduce((sum, s) => sum + s.out, 0);
  const totalLow = stats.reduce((sum, s) => sum + s.low, 0);

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

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{inventory.length}</p>
            </CardContent>
          </Card>
          <Card className="border-red-500/30">
            <CardHeader>
              <CardTitle>Out</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-700 dark:text-red-400">{totalOut}</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/30">
            <CardHeader>
              <CardTitle>Low</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{totalLow}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.location}>
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-3xl font-bold">{s.total}</p>
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full bg-red-500/20 px-2 py-1 text-red-700 dark:text-red-400">
                    {s.out} out
                  </span>
                  <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-yellow-700 dark:text-yellow-400">
                    {s.low} low
                  </span>
                  {s.lbs !== null && (
                    <span className="rounded-full bg-green-500/20 px-2 py-1 text-green-700 dark:text-green-400">
                      {formatLbs(s.lbs)} lb total
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Reports;
