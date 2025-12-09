import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { notification, Popconfirm, Table } from "antd";
import { set } from "date-fns";


const Pagamento = () => {
  const [open, setOpen] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);

  const osIdRef = useRef(null)
  const formaPagamentoRef = useRef(null)
  const valorPagoRef = useRef(null)
  const dataPagamentoRef = useRef(null)

  // const nomeEditarRef = useRef(null)
  const [idEditar, setIdEditar] = useState("")
  const [osIdEditar, setOsIdEditar] = useState("")
  const [formaPagamentoEditar, setFormaPagamentoEditar] = useState("")
  const [valorPagoEditar, setValorPagoEditar] = useState("")
  const [dataPagamentoEditar, setDataPagamentoEditar] = useState("")
  const [servicos, setServicos] = useState(0)
  const [faturamento, setFaturamento] = useState(0)

  const [pagamentos, setPagamentos] = useState([])

  const [api, contextHolder] = notification.useNotification({
    placement: 'topRight',
  });


  async function criar() {
    event.preventDefault()

    let pagamento = {
      osId: osIdRef.current.value,
      forma_pagamento: formaPagamentoRef.current.value,
      valor_pago: valorPagoRef.current.value,
      data_pagamento: dataPagamentoRef.current.value
    };

    const req = await fetch("http://localhost:8000/pagamentos", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(pagamento)
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

    let pagamento = {
      osId: osIdEditar,
      forma_pagamento: formaPagamentoEditar,
      valor_pago: valorPagoEditar,
      data_pagamento: dataPagamentoEditar,
    }
    const req = await fetch(`http://localhost:8000pagamento/${idEditar}`, {
      method: "put",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(pagamento)
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
    const req = await fetch("http://localhost:8000/pagamentos")
    const res = await req.json()
    if (res.mensagem) {
      api[res.tipo]({
        description: res.mensagem
      });
      return
    }
    setPagamentos(res.pagamentos)
    setServicos(res.totalServicos)
    setFaturamento(res.faturamento)
  }
  useEffect(() => {
    buscar()
  }, [])

  async function deletar(id) {
    event.preventDefault()

    const req = await fetch(`http://localhost:8000/pagamentos/${id}`, {
      method: "delete",
      headers: {
        "content-type": "application/json"
      },
    })
    const res = await req.json()
    if (res.mensagem) {
      api[res.tipo]({
        description: res.mensagem
      });
    }
    buscar()
  }

  return (
    <div className="space-y-6">
      {contextHolder}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Pagamentos</h1>
        <p className="text-muted-foreground">
          Controle financeiro e histórico de pagamentos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ordem de Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{servicos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Valor pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">R${faturamento.toFixed(2)}</div>
          </CardContent>
        </Card>

        <div>
          <Label htmlFor="data-entrada">Data de pagamento</Label>
          <Input id="data-entrada" type="datetime-local" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {
            pagamentos.length == 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum serviço cadastrado ainda. Clique em "Novo Serviço" para começar.
              </div>
            ) : (
              <Table dataSource={pagamentos} rowKey={"pagamento_id"}>
                <Table.Column className="w-[50px]" title="ID" dataIndex="pagamento_id" key="pagamento_id" />
                <Table.Column title="Nome" dataIndex="nome" key="nome" />
                <Table.Column title="Placa" dataIndex="placa" key="placa" />
                <Table.Column className="w-[100px]" title="Valor" dataIndex="valor_pago" key="valor_pago" render={(_,value) => `R$ ${value.valor_pago.toFixed(2)}`} />
                <Table.Column
                  className="w-[100px]"
                  title="Ações"
                  render={(_, pagamento) => (
                    <div className="flex gap-3 justify-center">
                      {/* <Pencil
                        onClick={() => {
                          // setNomeEditar(servico.nome)
                          setDescricaoEditar(servico.descricao)
                          setValorEditar(servico.valor_base)
                          setIdEditar(servico.servico_id)
                          setOpenEditar(true)

                        }}
                      /> */}
                      <Popconfirm
                        title="Alerta"
                        description="Deseja realmente apagar?"
                        onConfirm={() => deletar(pagamento.pagamento_id)}
                        okText="Sim"
                        cancelText="Nao"
                      >

                        <Trash2 />
                      </Popconfirm>
                    </div>
                  )}
                />
              </Table>

            )
          }
        </CardContent>
      </Card>
    </div>
  );
};

export default Pagamento;