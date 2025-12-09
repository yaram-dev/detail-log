import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { notification, Popconfirm, Table } from "antd";

const Clientes = () => {
  const [open, setOpen] = useState(false);

  const [openEditar, setOpenEditar] = useState(false);
  const nomeRef = useRef(null)
  const cpfRef = useRef(null)
  const telefoneRef = useRef(null)
  const enderecoRef = useRef(null)
  const emailRef = useRef(null)
  // const nomeEditarRef = useRef(null)
  const [idEditar, setIdEditar] = useState("")
  const [nomeEditar, setNomeEditar] = useState("")
  const [cpfEditar, setCpfEditar] = useState("")
  const [telefoneEditar, setTelefoneEditar] = useState("")
  const [enderecoEditar, setEnderecoEditar] = useState("")
  const [emailEditar, setEmailEditar] = useState("")

  const [clientes, setClientes] = useState([])
  const [api, contextHolder] = notification.useNotification({
    placement: 'topRight',
  });

  async function criar() {
    event.preventDefault()
    let cliente = {
      nome: nomeRef.current.value,
      cpf: cpfRef.current.value,
      telefone: telefoneRef.current.value,
      endereco: enderecoRef.current.value,
      email: emailRef.current.value
    }
    const req = await fetch("https://lavajato-api-s4mb.onrender.com/clientes", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(cliente)
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
    let cliente = {
      nome: nomeEditar,
      cpf: cpfEditar,
      telefone: telefoneEditar,
      enderco: enderecoEditar,
      email: emailEditar
    }
    const req = await fetch(`https://lavajato-api-s4mb.onrender.com/clientes/${idEditar}`, {
      method: "put",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(cliente)
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
    const req = await fetch("https://lavajato-api-s4mb.onrender.com/clientes")
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
  }, [open])

  async function deletar(id) {
    event.preventDefault()

    const req = await fetch(`https://lavajato-api-s4mb.onrender.com/clientes/${id}`, {
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
      {contextHolder}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes cadastrados
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input ref={nomeRef} id="nome" placeholder="Digite o nome do cliente" />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input ref={cpfRef} id="cpf" placeholder="000.000.000-00" />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input ref={telefoneRef} id="telefone" placeholder="(00) 00000-0000" />
              </div>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input ref={enderecoRef} id="endereco" placeholder="Digite seu endereço" />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input ref={emailRef} id="email" type="email" placeholder="cliente@email.com" />
              </div>
              <Button onClick = {criar} type="submit" className="w-full">

                Cadastrar Cliente
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={openEditar} onOpenChange={setOpenEditar}>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <input type="hidden" value={idEditar} />
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input  id="nome" value={nomeEditar} onChange={e => setNomeEditar(e.target.value)} placeholder="Digite o nome do cliente" />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input  id="cpf" value={cpfEditar} onChange={e => setCpfEditar(e.target.value)} placeholder="000.000.000-00" />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input  id="telefone" value={telefoneEditar} onChange={e => setTelefoneEditar(e.target.value)} placeholder="(00) 00000-0000" />
              </div>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" value={enderecoEditar} onChange={e => setEnderecoEditar(e.target.value)} placeholder="Digite seu endereço" />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" value={emailEditar} onChange={e => setEmailEditar(e.target.value)} type="email" placeholder="cliente@email.com" />
              </div>
              <Button onClick = {editar} type="submit" className="w-full">

                Editar Cliente
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {clientes.length > 0 ? (
            <Table dataSource={clientes} rowKey={"cliente_id"}>
              <Table.Column className="w-[50px]" title="ID" dataIndex="cliente_id" key="cliente_id" />
              <Table.Column title="Nome" dataIndex="nome" key="nome" />
              <Table.Column className="w-[150px]" title="Cpf" dataIndex="cpf" key="cpf"/>
              <Table.Column className="w-[100px]" title="telefone" dataIndex="telefone" key="telefone"/>
              <Table.Column
                className="w-[100px]"
                title="Ações"
                render={(_, cliente) => (
                  <div className="flex gap-3 justify-center">
                    <Pencil
                      onClick={() => {
                        setNomeEditar(cliente.nome)
                        setCpfEditar(cliente.cpf)
                        setTelefoneEditar(cliente.telefone)
                        setEnderecoEditar(cliente.enderco)
                        setEmailEditar(cliente.email)
                        setIdEditar(cliente.cliente_id)
                        setOpenEditar(true)

                      }}
                    />
                    <Popconfirm
                      title="Alerta"
                      description="Deseja realmente apagar?"
                      onConfirm={() => deletar(cliente.cliente_id)}
                      okText="Sim"
                      cancelText="Nao"
                    >

                      <Trash2 />
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

export default Clientes;
