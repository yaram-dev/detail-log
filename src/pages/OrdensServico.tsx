import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { set } from "date-fns";

const OrdensServico = () => {
  const [open, setOpen] = useState(false);

  const [openEditar, setOpenEditar] = useState(false);
  const [openDetalhes, setOpenDetalhes] = useState(false);
  const [openFinalizar, setOpenFinalizar] = useState(false);
  const clienteIdRef = useRef(null)
  const veiculoIdRef = useRef(null)
  const dataAberturaRef = useRef(null)
  const dataFechamentoRef = useRef(null)
  const statusRef = useRef(null)
  const valorTotalRef = useRef(null)


  // const nomeEditarRef = useRef(null)
  const [idEditar, setIdEditar] = useState("")
  const [clienteIdEditar, setClienteIdEditar] = useState("")
  const [veiculoIdEditar, setVeiculoIdEditar] = useState("")
  const [dataAberturaEditar, setDataAberturaEditar] = useState("")
  const [dataFechamentoEditar, setDataFechamentoEditar] = useState("")
  const [clientes, setCliente] = useState([])
  const [clienteSelecionado, setClienteSelecionado] = useState({})
  const [statusEditar, setStatusEditar] = useState("")
  const [valorEditar, setValorEditar] = useState("")
  const [servicos, setServicos] = useState([])
  const [ItensOS, setItensOs] = useState([])
  const [totalValor, setTotalValor] = useState(0)
  const [osSelecionado, setOsSelecionado] = useState({})
  const [osIdFinalizado, setOsIdFinalizado] = useState("")
  const [valorFinalizado, setValorFinalizado] = useState("")
  const [dataFinalizada, setDataFinalizada] = useState("")
  const [formaPagamento, setFormaPagamento] = useState("")


  const [ordemServico, setOrdemServico] = useState([])
  const [api, contextHolder] = notification.useNotification({
    placement: 'topRight',
  });

  function itensDaOs(itemId) {
    if (ItensOS.includes(itemId)) {
      setItensOs(ItensOS.filter(i => i !== itemId))
    } else {
      setItensOs([...ItensOS, itemId])
    }
  }

  async function criar() {
    event.preventDefault()
    let ordemServico = {
      cliente_id: clienteIdRef.current.value,
      veiculo_id: veiculoIdRef.current.value,
      data_abertura: dataAberturaRef.current.value,
      data_fechamento: dataFechamentoRef.current.value,
      status: statusRef.current.value,
      valor_total: totalValor,
      servicos: ItensOS
    }
    const req = await fetch("https://lavajato-api-s4mb.onrender.com/os", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(ordemServico)
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
    let ordemServico = {
      cliente_id: clienteIdEditar,
      veiculo_id: veiculoIdEditar,
      data_abertura: dataAberturaEditar,
      data_fechamento: dataFechamentoEditar,
      status: statusEditar,
      valor_total: totalValor,
      servicos: ItensOS,
      os_id: idEditar
    }
    const req = await fetch(`https://lavajato-api-s4mb.onrender.com/os/${idEditar}`, {
      method: "put",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(ordemServico)
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
    const req = await fetch("https://lavajato-api-s4mb.onrender.com/os")
    const res = await req.json()
    if (res.mensagem) {
      api[res.tipo]({
        description: res.mensagem
      });
      return
    }
    setOrdemServico(res)
  }
  async function buscarClientes() {
    const req = await fetch("https://lavajato-api-s4mb.onrender.com/clientes")
    const res = await req.json()
    if (res.mensagem) {
      api[res.tipo]({
        description: res.mensagem
      });
      return
    }
    setCliente(res)
  }
  async function buscarServicos() {
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
  async function finalizar() {
    event.preventDefault()
    let pagamento = {
      os_id: osIdFinalizado,
      forma_pagamento: formaPagamento,
      valor_pago: valorFinalizado,
      data_pagamento: dataFinalizada, 
    }
    const req = await fetch("https://lavajato-api-s4mb.onrender.com/pagamentos", {
      method: "post",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(pagamento)
    })
    const res = await req.json()
    if (res.mensagem) {
      api[res.tipo]({
        description: res.mensagem
      });
    }
    setOpenFinalizar(false)
    buscar()
  }
  useEffect(() => {
    buscar()
    buscarClientes()
    buscarServicos()
  }, [])

  useEffect(() => {
    const total = servicos.filter(servico => ItensOS.includes(servico.servico_id)).reduce((total, servico) => total + servico.valor_base, 0).toFixed(2)
    setTotalValor(total)
  }, [ItensOS])

  async function deletar(id) {
    event.preventDefault()

    const req = await fetch(`https://lavajato-api-s4mb.onrender.com/os/${id}`, {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Ordens de Serviço</h1>
          <p className="text-muted-foreground">
            Gerencie as ordens de serviço
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Ordem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Abrir Nova Ordem de Serviço</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente">Cliente</Label>
                  <select ref={clienteIdRef} onChange={(e) => setClienteSelecionado(clientes.find(c => c.cliente_id === parseInt(e.target.value)))} >
                    {
                      clientes.length > 0 ? clientes.map((cliente) => (
                        <option key={`o-${cliente.cliente_id}`} value={cliente.cliente_id}>{cliente.nome}</option>
                      )) : null
                    }
                  </select>
                </div>

                <div>
                  <Label htmlFor="veiculo-os">Veículo</Label>
                  <select ref={veiculoIdRef} >
                    {
                      clienteSelecionado.veiculos?.length > 0 ? clienteSelecionado.veiculos?.map((veiculo) => (
                        <option key={`v-${veiculo.veiculo_id}`} value={veiculo.veiculo_id}>{veiculo.modelo}</option>
                      )) : null
                    }
                  </select>
                </div>
              </div>

              <div>
                <Label>Serviços</Label>
                <div className="border rounded-lg p-4 space-y-2 mt-2">
                  {
                    servicos.length > 0 ? servicos.map((servico) => (
                      <div key={`s-${servico.servico_id}`} className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            key={`o-${servico.servico_id}`}
                            value={servico.servico_id}
                            onChange={() => itensDaOs(servico.servico_id)}
                          />{servico.nome}
                        </div>
                        R${servico.valor_base.toFixed(2)}
                      </div>
                    )) : null
                  }
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data-entrada">Data de Abertura</Label>
                  <Input ref={dataAberturaRef} id="data-entrada" type="datetime-local" />
                </div>

                <div>
                  <Label htmlFor="data-entrada">Data de Fechamento</Label>
                  <Input ref={dataFechamentoRef} id="data-entrada" type="datetime-local" />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select ref={statusRef}>
                    <option value="aberta">Aberta</option>
                    <option value="em-andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold"> Valor Total:</span>
                  <span className="text-2xl font-bold text-primary">R$ {totalValor}</span>
                </div>
              </div>

              <Button onClick={criar} type="submit" className="w-full">
                Abrir Ordem de Serviço
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={openEditar} onOpenChange={setOpenEditar}>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle> Editar Ordem de Serviço</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="hidden" value={idEditar} />
                <div>
                  <Label htmlFor="cliente">Cliente</Label>
                  <select value={clienteSelecionado?.cliente_id} onChange={(e) => setClienteSelecionado(clientes.find(c => c.cliente_id === parseInt(e.target.value)))} >
                    {
                      clientes.length > 0 ? clientes.map((cliente) => (
                        <option key={`o-${cliente.cliente_id}`} value={cliente.cliente_id}>{cliente.nome}</option>
                      )) : null
                    }
                  </select>
                </div>

                <div>
                  <Label htmlFor="veiculo-os">Veículo</Label>
                  <select ref={veiculoIdRef} >
                    {
                      clienteSelecionado.veiculos?.length > 0 ? clienteSelecionado.veiculos?.map((veiculo) => (
                        <option key={`v-${veiculo.veiculo_id}`} value={veiculo.veiculo_id}>{veiculo.modelo}</option>
                      )) : null
                    }
                  </select>
                </div>
              </div>

              <div>
                <Label>Serviços</Label>
                <div className="border rounded-lg p-4 space-y-2 mt-2">
                  {
                    servicos.length > 0 ? servicos.map((servico) => (
                      <div key={`s-${servico.servico_id}`} className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            key={`o-${servico.servico_id}`}
                            value={servico.servico_id}
                            checked={ItensOS.includes(servico.servico_id)}
                            onChange={() => itensDaOs(servico.servico_id)}
                          />{servico.nome}
                        </div>
                        R${servico.valor_base.toFixed(2)}
                      </div>
                    )) : null
                  }
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data-entrada">Data de Abertura</Label>
                  <Input value={dataAberturaEditar} onChange={(e) => setDataAberturaEditar(e.target.value)} id="data-entrada" type="datetime-local" />
                </div>

                <div>
                  <Label htmlFor="data-entrada">Data de Fechamento</Label>
                  <Input value={dataFechamentoEditar} onChange={(e) => setDataFechamentoEditar(e.target.value)} id="data-entrada" type="datetime-local" />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select value={statusEditar} onChange={e => setStatusEditar(e.target.value)}>
                    <option value="aberta">Aberta</option>
                    <option value="em-andamento">Em Andamento</option>
                    <option value="concluido">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold"> Valor Total:</span>
                  <span className="text-2xl font-bold text-primary">R$ {totalValor}</span>
                </div>
              </div>

              <Button onClick={editar} type="submit" className="w-full">
                Abrir Ordem de Serviço
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={openDetalhes} onOpenChange={setOpenDetalhes}>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle> Editar Ordem de Serviço</DialogTitle>
            </DialogHeader>
            {osSelecionado && osSelecionado.servicos?.map((servico) => (
              <div key={`s-${servico.servico_id}`} className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2"> {servico.nome} </div>
              </div>
            ))}
          </DialogContent>
        </Dialog>
        <Dialog open={openFinalizar} onOpenChange={setOpenFinalizar}>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle> Finalizar Ordem de Serviço</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <Input value={osIdFinalizado} type="hidden" />
              <Label htmlFor="valor">Valor</Label>
              <Input value={valorFinalizado} onChange={(e) => setValorFinalizado(e.target.value)} id="valor" type="number" />
              <Label htmlFor="dataFinalizada">Data Finalizada</Label>
              <Input value={dataFinalizada} onChange={(e) => setDataFinalizada(e.target.value)} id="dataFinalizada" type="datetime-local" />
              <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
              <Input value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} id="formaPagamento" type="text" />
              <Button onClick={finalizar} type="submit" className="w-full">
                Finalizar Ordem de Serviço
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ordens de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          {ordemServico.length > 0 ? (
            <Table dataSource={ordemServico} rowKey={"os_id"}>
              <Table.Column className="w-[50px]" title="ID" dataIndex="os_id" key="os_id" />
              <Table.Column title="Nome" dataIndex="nome" key="nome" />
              <Table.Column className="w-[150px]" title="Modelo" dataIndex="modelo" key="modelo" />
              <Table.Column className="w-[100px]" title="Placa" dataIndex="placa" key="placa" />
              <Table.Column className="w-[100px]" title="Total" render={(_, os) => `R$ ${os.valor_total.toFixed(2)}`} />
              <Table.Column className="w-[100px]" title="Status" dataIndex="status" key="status" />
              <Table.Column
                className="w-[100px]"
                title="Ações"
                render={(_, os) => (
                  <div className="flex gap-3 justify-end">
                    {os.status == "aberta" && <Button onClick = {
                      () => {
                        setOsIdFinalizado(os.os_id)
                        setValorFinalizado(os.valor_total)
                        setDataFinalizada(new Date().toISOString().slice(0, 16))
                        setOpenFinalizar(true)
                      }
                    } variant="ghost" size="sm">Finalizar</Button>
                    }
                    <Eye
                      onClick={() => {
                        setOsSelecionado(os)
                        setOpenDetalhes(true)
                      }}
                    />
                    <Pencil
                      onClick={() => {
                        setClienteSelecionado(clientes.find(c => c.cliente_id === os.cliente_id))
                        os.servicos.map(s => itensDaOs(s.servico_id))
                        setDataAberturaEditar(new Date(os.data_abertura).toISOString().slice(0, 16))
                        setDataFechamentoEditar(new Date(os.data_fechamento).toISOString().slice(0, 16))
                        setStatusEditar(os.status)
                        setIdEditar(os.os_id)
                        setOpenEditar(true)

                      }}
                    />
                    <Popconfirm
                      title="Alerta"
                      description="Deseja realmente apagar?"
                      onConfirm={() => deletar(os.os_id)}
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

export default OrdensServico;
