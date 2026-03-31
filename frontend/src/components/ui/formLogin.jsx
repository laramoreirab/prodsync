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
            <div className="w-130 max-w-2xl space-y-4 gap-0 border-2 pt-15 pb-10 px-10 rounded-[36px]">

                {/* TITULO */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Bem-vindo ao ProdSync
                    </h1>
                    <p className="text-md text-muted-foreground font-medium">
                        Faça seu login
                    </p>
                </div>

                {/* FORM */}
                <form>
                    <div className="flex flex-col gap-8 mt-5">
                        <div className="grid gap-3">
                            <Label className="font-medium text-muted-foreground mt-5">Identificador</Label>
                            <Input className="h-9" placeholder="Ex: 11.111.-11" />
                        </div>

                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label className="font-medium text-muted-foreground">Senha</Label>
                            </div>
                            <Input className="h-9" type="password" placeholder="••••••••" />

                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <Label className="flex items-center gap-2 cursor-pointer group">
                                <Input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                                />
                                <span className="text-sm font-semibold text-foreground group-hover:text-foreground transition-colors">
                                    Lembrar de mim
                                </span>
                            </Label>

                            <a
                                href="#"
                                className="hover:underline font-semibold text-sm transition-all"
                            >
                                Esqueceu sua senha?
                            </a>
                        </div>
                    </div>
                    {/* BUTTON LOGIN */}
                    <Button onClick={() => setOpen(true)} className="w-full mt-8 h-9 bg-primary hover:bg-primary/80 text-white text-sm font-medium rounded-lg">
                        Login
                    </Button>
                </form>

                {/* AINDA NÃO TEM UMA CONTA */}
                <p className="text-sm text-center text-muted-foreground">
                    Não tem uma conta?{" "}
                    <span className="font-medium text-foreground cursor-pointer hover:underline">
                        Cadastre-se
                    </span>
                </p>

                <p className="text-sm text-center font-medium text-foreground cursor-pointer hover:underline">
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