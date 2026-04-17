import RegisterForm from "@/components/ui/formCadastro";
import LeftCards from "@/components/ui/leftCadastro";

export default function RegisterPage() {
  return (
<div className="min-h-screen grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1.2fr_0.8fr] bg-gray-100">      
      {/* ESQUERDA */}
      <div className="hidden md:flex items-center justify-center relative">
        
        <LeftCards />
      </div>
      
      {/* DIREITA */}
      <div className="flex items-center justify-start p-4">
        <div className="w-full max-w-md"> 
          <RegisterForm />
        </div>
      </div>
      </div>
  );
}
