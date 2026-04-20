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
import { Input } from "@/components/ui/input";
import InputSenha from "./inputSenha";
import { useState } from "react";
import { CheckCircle2, EyeClosed, Info, Eye } from "lucide-react";

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


    const validations = [
        { text: "No mínimo 8 caracteres", valid: password.length >= 8 },
        { text: "Pelo menos 1 letra maiúscula (A-Z)", valid: /[A-Z]/.test(password) },
        { text: "Pelo menos 1 caractere especial (como !#$%@)", valid: /[!@#$%^&*]/.test(password) },
    ];

    const strength = validations.filter((v) => v.valid).length;

    const handleContinuar = (e) => {
        e.preventDefault()
        if (userId.trim() !== "") {
            setStep(2) // Avança para a tela de senha
        }
    }

    const handleCriarSenha = (e) => {
        e.preventDefault()
        const isAllValid = validations.every(v => v.valid)
        if (isAllValid) {
            alert("Senha criada com sucesso!")
        }
    }

    /* const getStrengthText = (score) => {
        if (score === 0) return "";
        if (score <= 1) return "Weak";
        if (score <= 2) return "Moderate";
        if (score <= 3) return "Strong";
        return "Very Strong";
    };

    const getStrengthTextColor = (score) => {
        if (score === 0) return "text-muted-foreground";
        if (score <= 1) return "text-red-500";
        if (score <= 2) return "text-orange-500";
        if (score <= 3) return "text-teal-400";
        return "text-teal-500";
    }; */

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
                            <form onSubmit={handleContinuar} className="space-y-6" noValidate>
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







/* 

*/