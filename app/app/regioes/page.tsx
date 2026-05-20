import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currency } from "@/lib/utils";

const regions = [
  { name: "Gleba Palhano", city: "Londrina", price: 7400, rent: 3200, score: 86, note: "liquidez alta, demanda forte, preço exigente" },
  { name: "Jardim Norte", city: "Londrina", price: 4200, rent: 2100, score: 78, note: "boa assimetria para studios compactos" },
  { name: "Distrito Industrial", city: "Apucarana", price: 1900, rent: 1600, score: 64, note: "renda depende de operação e vacância" }
];

export default function RegionsPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <p className="text-sm font-medium text-primary">Regiões e dados externos</p>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Score de bairro, liquidez e sinais de mercado</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {regions.map((region) => (
          <Card key={region.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{region.name}</CardTitle>
                <Badge tone={region.score >= 80 ? "success" : "warning"}>{region.score}</Badge>
              </div>
              <CardDescription>{region.city}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Preço m²: <strong>{currency(region.price)}</strong></p>
              <p>Aluguel médio: <strong>{currency(region.rent)}</strong></p>
              <p className="text-muted-foreground">{region.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
