import { CircleCheck } from "lucide-react";

export default function ModalSucessNotificacao() {
  return (
    <div className="p-20">
      <div className="flex flex-col items-center justify-center gap-3">
        <CircleCheck size={100} className="text-[#369948]" />
        <h1 className="text-center font-bold text-2xl">
          Justificativa solicitada ao operador <br /> com sucesso!
        </h1>
        <p className="text-center font-medium text-lg text-[#7c7c81]">
          O operador receberá um alerta para<br /> preencher a justificativa do evento.
        </p>
      </div>
    </div>
  );
}
