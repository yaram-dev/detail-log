import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, FileText, DollarSign } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total de Clientes",
      value: "0",
      icon: Users,
      description: "Clientes cadastrados",
    },
    {
      title: "Veículos",
      value: "0",
      icon: Car,
      description: "Veículos registrados",
    },
    {
      title: "Ordens Abertas",
      value: "0",
      icon: FileText,
      description: "Ordens em andamento",
    },
    {
      title: "Receita do Mês",
      value: "R$ 0,00",
      icon: DollarSign,
      description: "Faturamento atual",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu lava jato
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Lava Jato Pro!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Sistema completo de gestão para o seu lava jato. Comece cadastrando seus clientes,
            veículos e serviços.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold mb-2 text-foreground">1. Cadastre Clientes</h3>
              <p className="text-sm text-muted-foreground">
                Registre os dados dos seus clientes
              </p>
            </div>
            <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
              <h3 className="font-semibold mb-2 text-foreground">2. Adicione Veículos</h3>
              <p className="text-sm text-muted-foreground">
                Cadastre os veículos dos clientes
              </p>
            </div>
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <h3 className="font-semibold mb-2 text-foreground">3. Abra Ordens</h3>
              <p className="text-sm text-muted-foreground">
                Crie ordens de serviço e gerencie pagamentos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
