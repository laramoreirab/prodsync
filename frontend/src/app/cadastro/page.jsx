import RegisterForm from "@/components/ui/formCadastro";
import LeftCards from "@/components/ui/leftCadastro";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100">
      
      {/* ESQUERDA */}
      <div className="hidden md:flex items-center justify-end relative">
        
        <LeftCards />
      </div>
      
      {/* DIREITA */}
      <div className="flex items-center justify-start p-8 md:p-16">
        <RegisterForm />
      </div>
    </div>
  );
}
