import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { notification, Popconfirm, Table } from "antd";

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

  const [openEditar, setOpenEditar] = useState(false);

    const clienteIdRef = useRef(null)
    const placaRef = useRef(null)
    const modeloRef = useRef(null)
    const corRef = useRef(null)
    const anoRef = useRef(null)
    // const nomeEditarRef = useRef(null)
    const [idEditar, setIdEditar] = useState("")
    const [clienteIdEditar, setClienteIdEditar] = useState("")
    const [placaEditar, setPlacaEditar] = useState("")
    const [modeloEditar, setModeloEditar] = useState("")
    const [corEditar, setCorEditar] = useState("")
    const [anoEditar, setAnoEditar] = useState("")
    
    const [veiculos, setVeiculos] = useState([])
    const [clientes, setClientes] = useState([])
    const [api, contextHolder] = notification.useNotification({
      placement: 'topRight',
    });
  
    async function criar() {
      event.preventDefault()
      let veiculo = {
        cliente_id: clienteIdRef.current.value,
        placa: placaRef.current.value,
        modelo: modeloRef.current.value,
        cor: corRef.current.value,
        ano: anoRef.current.value
      }
      const req = await fetch("https://lavajato-api-s4mb.onrender.com//veiculos", {
        method: "post",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(veiculo)
      })
      const res = await req.json()
      if (res) {
        setOpen(false)
        api[res.tipo]({
          description: res.mensagem
        });
      }
    }
    async function editar() {
      event.preventDefault()
      let veiculo = {
        cliente_id: clienteIdEditar,
        placa: placaEditar,
        modelo: modeloEditar,
        cor: corEditar,
        ano: anoEditar
      }
      const req = await fetch(`https://lavajato-api-s4mb.onrender.com//veiculos/${idEditar}`, {
        method: "put",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(veiculo)
      })
      const res = await req.json()
      if (res) {
        setOpenEditar(false)
        api[res.tipo]({
          description: res.mensagem
        });
        buscar()
      }
    }
  
    async function buscar() {
      const req = await fetch("https://lavajato-api-s4mb.onrender.com//veiculos")
      const res = await req.json()
      if (res.mensagem) {
        api[res.tipo]({
          description: res.mensagem
        });
        return
      }
      setVeiculos(res);
    }

    async function buscarClientes() {
    const req = await fetch("https://lavajato-api-s4mb.onrender.com//clientes")
    const res = await req.json()
    if (res.mensagem) {
      api[res.tipo]({
        description: res.mensagem
      });
      return
    }
    setClientes(res)
  }

    useEffect(() => {
      buscar()
      buscarClientes()
    }, []); 


    async function deletar(id) {
      event.preventDefault()
  
      const req = await fetch(`https://lavajato-api-s4mb.onrender.com//veiculos/${id}`, {
        method: "delete",
        headers: {
          "content-type": "application/json"
        },
      })
      const res = await req.json()
      if (res) {
        api[res.tipo]({
          description: res.mensagem
        });
        buscar()
      }
    }

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
                <select ref ={clienteIdRef} >
                  {
                      clientes.length > 0 ? clientes.map((cliente) => (
                        
                        <option key={`o-${cliente.cliente_id}`} value={cliente.cliente_id}>{cliente.nome}</option>
                       
                      )) : null
                    }
                </select>
              </div>
              <div>
                <Label htmlFor="placa">Placa</Label>
                <Input id="placa" ref = {placaRef} placeholder="ABC-1234" />
              </div>
              <div>
                <Label htmlFor="marca">Modelo</Label>
                <Input id="modelo" ref = {modeloRef} placeholder="Ex: Fiat, Volkswagen" />
              </div>
              <div>
                <Label htmlFor="cor">Cor</Label>
                <Input id="cor" ref = {corRef} placeholder="Ex: Onix, Prata" />
              </div>
              <div>
                <Label htmlFor="ano">Ano</Label>
                <Input id="ano" ref ={anoRef} type="number" placeholder="2024" />
              </div>
           
              <Button onClick = {criar}type="submit" className="w-full">
                Cadastrar Veículo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={openEditar} onOpenChange={setOpenEditar}>
        
          <DialogContent>
            <DialogHeader>
              <DialogTitle> Editar Veículo </DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
               <input type="hidden" value={idEditar}/>
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <select value={clienteIdEditar} onChange={e => setClienteIdEditar(e.target.value)} >
                  {
                      clientes.length > 0 ? clientes.map((cliente) => (
                        <option key={`o-${cliente.cliente_id}`} value={cliente.cliente_id}>{cliente.nome}</option>
                      )) : null
                    }
                </select>
              </div>

              <div>
                <Label htmlFor="placa">Placa</Label>
                <Input id="placa" value={placaEditar} onChange={e => setPlacaEditar(e.target.value)} placeholder="ABC-1234" />
              </div>
              <div>
                <Label htmlFor="marca">Modelo</Label>
                <Input id="modelo" value={modeloEditar} onChange={e => setModeloEditar(e.target.value)} placeholder="Ex: Fiat, Volkswagen" />
              </div>
              <div>
                <Label htmlFor="cor">Cor</Label>
                <Input id="cor" value={corEditar} onChange={e => setCorEditar(e.target.value)} placeholder="Ex: Onix, Prata" />
              </div>
              <div>
                <Label htmlFor="ano">Ano</Label>
                <Input id="ano" value={anoEditar} onChange={e => setAnoEditar(e.target.value)} type="number" placeholder="2024" />
              </div>
           
              <Button onClick = {editar}type="submit" className="w-full">
                Editar Veículo
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
          {veiculos.length > 0 ? (
            <Table dataSource={veiculos} rowKey={"veiculo_id"}>
              <Table.Column className="w-[50px]" title="ID" dataIndex="veiculo_id" key="veiculo_id" />
              <Table.Column title="Cliente  " dataIndex="nome" key="nome" />
              <Table.Column title="Placa" dataIndex="placa" key="placa" />
              <Table.Column title="Modelo" dataIndex="modelo" key="modelo" />
              <Table.Column title="Cor" dataIndex="cor" key="cor" />
              <Table.Column title="Ano" dataIndex="ano" key="ano" />
              <Table.Column
                className="w-[100px]"
                title="Ações"
                render={(_, veiculo) => (
                  <div className="flex gap-3 justify-center">
                    <Pencil
                      onClick={() => {
                        setIdEditar(veiculo.veiculo_id)
                        setClienteIdEditar(veiculo.cliente_id)
                        setPlacaEditar(veiculo.placa)
                        setModeloEditar(veiculo.modelo)
                        setCorEditar(veiculo.cor)
                        setAnoEditar(veiculo.ano)
                        
                        setOpenEditar(true)

                      }}
                    />
                    <Popconfirm
                      title="Alerta"
                      description="Deseja realmente apagar?"
                      onConfirm={() => deletar(veiculo.veiculo_id)}
                      okText="Sim"
                      cancelText="Nao"
                    >

                      <Trash2/>
                    </Popconfirm>
                  </div>
                )}
              />
            </Table>
          ) : (

            <div className="text-center py-12 text-muted-foreground">
              Nenhum cliente cadastrado ainda. Clique em "Novo Cliente" para começar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Veiculos;
