import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Funcionario } from "@/types/Funcionario";

interface FuncionarioEdicaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funcionario: Funcionario | null;
}

export function FuncionarioEdicao({
  open,
  onOpenChange,
  funcionario,
}: FuncionarioEdicaoProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Funcionário</DialogTitle>
          <DialogDescription>
            {funcionario ? 
              `Editando informações de ${funcionario.nome_usuario}` :
              "Nenhum funcionário selecionado"
            }
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <p className="text-sm text-gray-500">
            Formulário de edição em desenvolvimento...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}