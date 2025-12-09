import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { notification, Popconfirm, Table } from "antd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Description } from "@radix-ui/react-toast";

const Servicos = () => {
  const [open, setOpen] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const nomeRef = useRef(null)
  const descricaoRef = useRef(null)
  const valorRef = useRef(null)
  // const nomeEditarRef = useRef(null)
  const [idEditar, setIdEditar] = useState("")
  const [nomeEditar, setNomeEditar] = useState("")
  const [descricaoEditar, setDescricaoEditar] = useState("")
  const [valorEditar, setValorEditar] = useState("")
  
  const [servicos, setServicos] = useState([])
  const [api, contextHolder] = notification.useNotification({
    placement: 'topRight',
  });

  async function criar() {
    event.preventDefault()
    let servico = {
      nome: nomeRef.current.value,
      descricao: descricaoRef.current.value,
      valor_base: valorRef.current.value
    }
    const req = await fetch("https://lavajato-api-s4mb.onrender.com/servicos", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(servico)
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
    let servico = {
      nome: nomeEditar,
      descricao: descricaoEditar,
      valor_base: valorEditar
    }
    const req = await fetch(`https://lavajato-api-s4mb.onrender.com/servicos/${idEditar}`, {
      method: "put",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(servico)
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
    const req = await fetch("https://lavajato-api-s4mb.onrender.com/servicos")
    const res = await req.json()
    if (res.mensagem) {
       api[res.tipo]({
        description: res.mensagem
      });
      return
    }
    setServicos(res)
  }
  useEffect(() => {
    buscar()
  }, [])

  async function deletar(id) {
    event.preventDefault()

    const req = await fetch(`https://lavajato-api-s4mb.onrender.com/servicos/${id}`, {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços oferecidos
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Serviço</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Serviço</Label>
                <Input id="nome" ref={nomeRef} placeholder="Ex: Lavagem Completa" />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  ref={descricaoRef}
                  id="descricao"
                  placeholder="Descreva os detalhes do serviço"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  ref={valorRef}
                  id="preco"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                />
              </div>

              <Button type="submit" className="w-full" onClick={criar}>
                Cadastrar Serviço
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={openEditar} onOpenChange={setOpenEditar}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar Serviço</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <Input type="hidden" value={idEditar} />
              <div>
                <Label htmlFor="nome">Nome do Serviço</Label>
                <Input id="nome" value={nomeEditar} onChange={(e) => setNomeEditar(e.target.value)} placeholder="Ex: Lavagem Completa" />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  value={descricaoEditar}
                  onChange={(e) => setDescricaoEditar(e.target.value)}
                  id="descricao"
                  placeholder="Descreva os detalhes do serviço"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  value={valorEditar}
                  onChange={(e) => setValorEditar(e.target.value)}
                  id="preco"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                />
              </div>

              <Button type="submit" className="w-full" onClick={editar}>
                Atualizar Serviço
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          {
            servicos.length == 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum serviço cadastrado ainda. Clique em "Novo Serviço" para começar.
              </div>
            ) : (
              <Table dataSource={servicos} rowKey={"servico_id"}>
                <Table.Column className="w-[50px]" title="ID" dataIndex="servico_id" key="servico_id" />
                <Table.Column title="Nome" dataIndex="nome" key="nome" />
                <Table.Column className="w-[100px]" title="Valor" dataIndex="valor_base" key="valor_base" render={(value) => `R$ ${value.toFixed(2)}`} />
                <Table.Column
                  className="w-[100px]"
                  title="Ações"
                  render={(_, servico) => (
                    <div className="flex gap-3 justify-center">
                      <Pencil
                        onClick={() => {
                          setNomeEditar(servico.nome)
                          setDescricaoEditar(servico.descricao)
                          setValorEditar(servico.valor_base)
                          setIdEditar(servico.servico_id)
                          setOpenEditar(true)

                        }}
                      />
                      <Popconfirm
                        title="Alerta"
                        description="Deseja realmente apagar?"
                        onConfirm={() => deletar(servico.servico_id)}
                        okText="Sim"
                        cancelText="Nao"
                      >

                        <Trash2 />
                      </Popconfirm>
                    </div>
                  )}
                />
              </Table>
              // <table className="w-full">
              //   <thead className="flex w-full border">
              //     <tr>

              //       <th className="w-[50px]">id</th>
              //       <th className="flex-1 text-left">nome</th>
              //       <th className="w-[100px] text-center">valor</th>
              //       <th className="w-[100px] text-center">acoes</th>
              //     </tr>
              //   </thead>
              //   <tbody>
              //     {
              //       servicos.map(servico => (
              //         <tr key={servico.servico_id} className="flex w-full border">
              //           <td className="w-[50px] text-center">{servico.servico_id}</td>
              //           <td className="flex-1">{servico.nome}</td>
              //           <td className="w-[100px] text-center">R$ {servico.valor_base.toFixed(2)}</td>
              //           <td className="w-[100px]">
              //             <div className="flex gap-3 justify-center">
              //               <Pencil
              //                 onClick={() => {
              //                   setOpenEditar(servico.servico_id)
              //                   setNomeEditar(servico.nome)
              //                   setDescricaoEditar(servico.descricao)
              //                   setValorEditar(servico.valor_base)
              //                   setOpenEditar(true)

              //                 }}
              //               />
              //               <Trash2 />
              //             </div>
              //           </td>
              //         </tr>

              //       ))
              //     }
              //   </tbody>
              // </table>
            )
          }
        </CardContent>
      </Card>
    </div>
  );
};

export default Servicos;
