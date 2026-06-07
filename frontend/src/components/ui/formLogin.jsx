"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import SuccessCard from "@/components/ui/modalCadastro";
import { setAuthToken } from "@/lib/auth";

const REMEMBER_ID_KEY = "rememberedLoginId";

export default function LoginForm() {
    const router = useRouter()

    const [open, setOpen] = useState(false);
    const [id, setId] = useState("");
    const [senha, setSenha] = useState("");
    const [lembrarDeMim, setLembrarDeMim] = useState(false);
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState("")
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        const rememberedId = localStorage.getItem(REMEMBER_ID_KEY);
        if (!rememberedId) return;

        setId(rememberedId);
        setLembrarDeMim(true);
    }, []);

    async function handleLogin() {
        setCarregando(true)
        setErro("")


        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, senha, lembrarDeMim })
            })

            const data = await res.json()

            console.log(data)

            if (!res.ok) {
                setErro(data.mensagem)
                return
            }


            setAuthToken(data.dados.token, lembrarDeMim);

            if (lembrarDeMim) {
                localStorage.setItem(REMEMBER_ID_KEY, id);
            } else {
                localStorage.removeItem(REMEMBER_ID_KEY);
            }


            //redireciona pelo tipo que vem no token
            if (data.dados.tipo === "Adm") router.push("/adm")
            if (data.dados.tipo === "Gestor") router.push("/gestor")
            if (data.dados.tipo === "Operador") router.push("/operador")

        } catch (error) {
            setErro("Erro de conexão com o servidor")
        } finally {
            setCarregando(false)
        }
    }

    return (
        <>
            <div className="login-card-shell w-95 gap-0 space-y-4 rounded-[36px] bg-white px-8 pb-8 pt-10 lg:min-w-120 lg:px-10 lg:pb-10 lg:pt-15">

                {/* TITULO */}
                <div className="space-y-1">
                    <h1 className="text:2x1 sm:text-3xl font-semibold tracking-tight">
                        Bem-vindo de volta!
                    </h1>
                    <p className="text-md text-muted-foreground font-medium">
                        Faça seu login.
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div className="flex flex-col gap-8 mt-5">
                        <div className="grid gap-3">
                            <Label className="text-[#545454] font-medium mt-5">Identificador</Label>
                            <Input className="h-9" placeholder="Ex: 11111111"
                                value={id} onChange={(e) => setId(e.target.value)} />
                        </div>

                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label className="font-medium text-[#545454]">Senha</Label>
                            </div>

                            {/* Container relativo para prender o botão absoluto */}
                            <div className="relative flex items-center">
                                <Input
                                    className="h-9 w-full pr-10"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-0 top-0 bottom-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground"
                                    onClick={() => setShowPassword((current) => !current)}
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={lembrarDeMim}
                                    onChange={(e) => setLembrarDeMim(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                                />
                                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                    Lembrar de mim
                                </span>
                            </label>
                            <a
                                href="#"
                                className="hover:underline font-semibold text-sm transition-all"
                            >
                                Esqueceu sua senha?
                            </a>
                        </div>
                    </div>

                    {/* erro vindo do backend */}
                    {erro && <p className="text-red-500 text-sm mt-3">{erro}</p>}

                    {/* BUTTON LOGIN */}
                    <Button id="btn_login"
                        type="submit"
                        disabled={carregando}
                        className="mt-5 h-9 w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-semibold text-white shadow-md lg:mt-8">
                        {carregando ? "Entrando..." : "Entrar"}
                    </Button>
                </form>

                {/* AINDA NÃO TEM UMA CONTA */}
                <p className="text-sm text-center font-medium text-[#545454]">
                    Não tem uma conta?{" "}
                    <a href="/cadastro">
                        <span className="cursor-pointer font-semibold text-foreground hover:underline">
                            Cadastre-se
                        </span>
                    </a>
                </p>

                <div className="flex items-center justify-center text-center font-semibold text-foreground">
                    <a href="/primeiro-acesso" className="flex cursor-pointer items-center gap-2 text-sm hover:underline">
                        <span>É seu primeiro acesso?</span>
                    </a>
                </div>
            </div>


            {/* MODAL*/}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <SuccessCard
                        onClose={() => setOpen(false)}
                        onContinue={() => setOpen(false)}
                    />
                </div>
            )}


        </>
    );
}

/* FORM */
function FormField({ label, placeholder }) {
    return (
        <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
                {label}
            </Label>
            <Input className="h-9" placeholder={placeholder} />
        </div>
    );
}
