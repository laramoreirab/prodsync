"use client"

export default function SuccessCard({ onClose, onContinue }) {
  return (
    <div className="w-full max-w-[320px] bg-white rounded-2xl border shadow-lg p-6 relative flex flex-col gap-4 text-center">
      
      {/* FECHAR */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      {/* ICON */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 text-2xl">
          ✓
        </div>
      </div>

      {/* TEXTO */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">
          Senha criada com sucesso!
        </h2>
        <p className="text-sm text-gray-500">
          Tudo pronto para acompanhar sua produção em tempo real.
        </p>
      </div>

      {/* BUTTON */}
      <button
        onClick={onContinue}
        className="w-full h-10 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
      >
        Continuar
      </button>

      {/* LOGIN */}
      <p
        onClick={onClose}
        className="text-sm text-gray-500 cursor-pointer hover:underline"
      >
        Voltar para login
      </p>
    </div>
  )
}