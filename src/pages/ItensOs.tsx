import { useEffect, useState,useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import { notification } from "antd";

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

const ItensOs = () => {
  const [open, setOpen] = useState(false);

    const [openEditar, setOpenEditar] = useState(false);
    const osIdRef = useRef(null)
    const servicoIdRef = useRef(null)
    const quantidadeRef = useRef(null)

    // const nomeEditarRef = useRef(null)
    const [osIdEditar, setIdEditar] = useState("")
    const [servicoIdEditar, setClienteIdEditar] = useState("")
    const [quantidadeEditar, setVeiculoIdEditar] = useState("")
    
    const [statusEditar, setStatusEditar] = useState("")
    const [valorEditar, setValorEditar] = useState("")

     const [ItensOS, setItensOs] = useState([])
     const [api, contextHolder] = notification.useNotification({
        placement: 'topRight',
     });

     async function criar() {
    event.preventDefault()
    let ItensOs = {
      os_id: osIdRef.current.value,
      servico_id: servicoIdRef.current.value,
      quantidade: quantidadeRef.current.value,
    }
    const req = await fetch("https://lavajato-api-s4mb.onrender.com/ItensOs", {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(ItensOs)
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
      let ItensOs = {
        os_id: osIdEditar,
        servico_id: servicoIdEditar,
        quantidade: quantidadeEditar,
          
      }
      const req = await fetch(`https://lavajato-api-s4mb.onrender.com/ItensOs/${osIdEditar}`, {
        method: "put",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(ItensOs)
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
      const req = await fetch("https://lavajato-api-s4mb.onrender.com/ItensOs")
      const res = await req.json()
      if (res.mensagem) {
         api[res.tipo]({
          description: res.mensagem
        });
        return
      }
      setItensOs(res)
    }
    useEffect(() => {
      buscar()
    }, [])
  
    async function deletar(id) {
      event.preventDefault()
  
      const req = await fetch(`https://lavajato-api-s4mb.onrender.com/ItensOs/${id}`, {
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
}