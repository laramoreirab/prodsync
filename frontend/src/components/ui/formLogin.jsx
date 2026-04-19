"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SuccessCard from "@/components/ui/modalCadastro";

export default function LoginForm() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="lg:min-w-120 w-95 space-y-4 gap-0 border-2 lg:pt-15 lg:pb-10 lg:px-10 rounded-[36px] pt-10 pb-8 px-8">

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
                <form>
                    <div className="flex flex-col gap-8 mt-5">
                        <div className="grid gap-3">
                            <Label className="text-[#545454] font-medium mt-5">Identificador</Label>
                            <Input className="h-9" placeholder="Ex: 11.111.-11" />
                        </div>

                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label className="font-medium text-[#545454]">Senha</Label>
                            </div>
                            <Input className="h-9" type="password" placeholder="••••••••" />

                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
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
                    {/* BUTTON LOGIN */}
                    <Button id="btn_login" onClick={() => setOpen(true)} className="cursor-pointer py-3 w-full lg:mt-8 mt-5 h-9 bg-primary hover:bg-primary/80 text-white text-sm font-semibold rounded-lg">
                        Entrar
                    </Button>
                </form>

                {/* AINDA NÃO TEM UMA CONTA */}
                <p className="text-sm text-center font-medium text-[#545454]">
                    Não tem uma conta?{" "}
                    <span className="font-semibold text-foreground cursor-pointer hover:underline">
                        Cadastre-se
                    </span>
                </p>

                <p className="text-sm text-center font-semibold text-foreground cursor-pointer hover:underline">
                    É seu primeiro acesso?
                </p>
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