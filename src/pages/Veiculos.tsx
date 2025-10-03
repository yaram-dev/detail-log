import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Veiculos = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Veículos</h1>
          <p className="text-muted-foreground">
            Gerencie os veículos cadastrados
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Veículo</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Cliente 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="placa">Placa</Label>
                <Input id="placa" placeholder="ABC-1234" />
              </div>
              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input id="marca" placeholder="Ex: Fiat, Volkswagen" />
              </div>
              <div>
                <Label htmlFor="modelo">Modelo</Label>
                <Input id="modelo" placeholder="Ex: Gol, Uno" />
              </div>
              <div>
                <Label htmlFor="ano">Ano</Label>
                <Input id="ano" type="number" placeholder="2024" />
              </div>
              <div>
                <Label htmlFor="cor">Cor</Label>
                <Input id="cor" placeholder="Ex: Branco, Prata" />
              </div>
              <Button type="submit" className="w-full">
                Cadastrar Veículo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Veículo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Buscar por placa, marca ou modelo..." />
            <Button variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Veículos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Nenhum veículo cadastrado ainda. Clique em "Novo Veículo" para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Veiculos;
