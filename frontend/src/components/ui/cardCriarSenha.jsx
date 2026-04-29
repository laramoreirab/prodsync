"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import InputSenha from "./inputSenha";
import { useState } from "react";
import { CheckCircle2, EyeClosed, Info, Eye } from "lucide-react";
import { apiFetch } from "@/lib/api"

export default function CriarSenha() {

    /* const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); */

    // Controle de Etapas
    const [step, setStep] = useState(1)

    // Estados dos inputs
    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [erro, setErro] = useState("")


    const validations = [
        { text: "No mínimo 8 caracteres", valid: password.length >= 8 },
        { text: "Pelo menos 1 letra maiúscula (A-Z)", valid: /[A-Z]/.test(password) },
        { text: "Pelo menos 1 caractere especial (como !#$%@)", valid: /[!@#$%^&*]/.test(password) },
    ];

    const strength = validations.filter((v) => v.valid).length;

    async function handleContinuar(e) {
        e.preventDefault()
        setErro("")

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/primeiroAcesso`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            })

            const data = await res.json()

            if (!res.ok) {
                setErro(data.mensagem || "Erro ao validar usuário");
                return;
            }
            if (data.token) {
                localStorage.setItem("token", data.token,);
                localStorage.setItem("tipo", data.tipo,);
                setStep(2);
            }

        } catch (error) {
            setErro("Erro de conexão com o servidor")
        }
    }

    async function handleCriarSenha(e) {
        e.preventDefault()
        const isAllValid = validations.every(v => v.valid);

        if (!isAllValid) {
            setErro("A senha não atende a todos os requisitos de segurança.");
            return;
        }

        if (password !== confirmPassword) {
            setErro("As senhas não coincidem.");
            return;
        }

        try {
            const res = await apiFetch("/api/registroSenha", {
                method: "POST",
                body: JSON.stringify({ password, confirmPassword })
            })

            const data = await res.json();

            if (!res.ok) {
                setErro(data.mensagem || "Erro ao registrar senha.");
                return;
            }

            alert("Senha criada com sucesso!");

            //redireciona pelo tipo que vem no token
            if (localStorage.getItem("tipo") === "Adm") router.push("/adm/DashboardGeral")
            if (localStorage.getItem("tipo") === "Gestor") router.push("/gestor/DashboardGeral")
            if (localStorage.getItem("tipo") === "Operador") router.push("/operador/DashboardGeral")

        } catch (error) {
            setErro("Erro de conexão com o servidor")
        }

    }

    return (
        <section
            className="lg:h-[calc(100vh-80px)] flex items-center justify-center relative">
            {step === 1 && (

                <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">

                    <Card className="px-6 py-8 sm:p-12 relative gap-6 animate-in fade-in zoom-in-95 duration-300">
                        <CardHeader className="text-center gap-6 p-0 mb-2">
                            <div className="mx-auto">
                                <img src="/logo.svg" alt="shadcnspace" className="h-20 w-20" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <CardTitle className="text-2xl font-semibold text-card-foreground">Primeiro Acesso</CardTitle>
                                <CardDescription className="text-sm font-medium text-muted-foreground">
                                    Por favor, entre com o ID associado à sua conta.
                                </CardDescription>
                            </div>
                        </CardHeader>






                        <CardContent className="p-0">
                            <form onSubmit={(e) => handleContinuar(e)} className="space-y-6" noValidate>
                                <FieldGroup className="gap-2">
                                    <Field>
                                        <FieldLabel htmlFor="userId" className="text-xs font-semibold text-muted-foreground">ID</FieldLabel>
                                        <Input
                                            id="userId"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            className="bg-transparent h-10 mb-2"
                                            required
                                        />
                                    </Field>

                                    <div className="flex flex-col gap-3">

                                        <Field>
                                            <Button type="submit" className="h-10 cursor-pointer hover:bg-primary/80">
                                                Continuar
                                            </Button>
                                        </Field>

                                        <Field className="flex text-center text-3x1">
                                            <a className="w-full font-semibold hover:bg-transparent">
                                                Voltar para Login
                                            </a>
                                        </Field>

                                    </div>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>

                    {/* erro vindo do backend */}
                    {erro && <p className="text-red-500 text-sm mt-3">{erro}</p>}
                </div>
            )}








            {step === 2 && (

                <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
                    <Card className="px-6 py-8 sm:p-12 relative gap-6">
                        <CardHeader className="text-center gap-6 p-0">
                            <div className="mx-auto">
                                <a href="">
                                    <img
                                        src="/logo.svg"
                                        alt="shadcnspace"
                                        className="h-20 w-20" />
                                </a>
                            </div>
                            <div className="flex flex-col gap-1">
                                <CardTitle className="text-2xl font-semibold text-card-foreground">
                                    Criação da Senha
                                </CardTitle>
                                <CardDescription className="text-sm font-medium text-muted-foreground">
                                    Crie uma senha para acessar sua conta.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <form>
                                <FieldGroup className="gap-6">

                                    <Field className="gap-0 mt-0">
                                        <div className="space-y-2">
                                            <FieldLabel htmlFor="password-realtime">Senha</FieldLabel>
                                            <div className="relative">
                                                <Input
                                                    className="bg-transparent [&::-ms-reveal]:hidden h-10"
                                                    id="password-realtime"
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    type={showPassword ? "text" : "password"}
                                                    value={password} />
                                                <Button
                                                    className="absolute top-0 right-0 h-full px-3 hover:bg-transparent cursor-pointer"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    size="icon"
                                                    type="button"
                                                    variant="ghost">
                                                    {showPassword ? (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <EyeClosed className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>


                                            </div>
                                        </div>


                                        <div className="space-y-1.5 pt-1">
                                            {validations.map((validation, index) => (
                                                <div
                                                    className={`flex items-center gap-2 text-sm transition-colors duration-200 ${validation.valid
                                                        ? "text-green-500"
                                                        : "text-muted-foreground"
                                                        }`}
                                                    key={index}>
                                                    {validation.valid ? (
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Info className="h-3.5 w-3.5" />
                                                    )}
                                                    <span className="text-[13px]">{validation.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Field>

                                    <div className="flex flex-col gap-4">

                                        <Field className="gap-0 mt-0">
                                            <InputSenha />

                                        </Field>
                                        {/* erro vindo do backend */}
                                        {erro && <p className="text-red-500 text-sm mt-3">{erro}</p>}
                                    </div>


                                    <Field className="gap-4">
                                        <Button
                                            type="submit"
                                            size={"lg"}
                                            className="rounded-xl h-10 cursor-pointer hover:bg-primary/80">
                                            Criar
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                </div>


            )}

        </section>
    );
}
