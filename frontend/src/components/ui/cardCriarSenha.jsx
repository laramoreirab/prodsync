"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SuccessCard from "@/components/ui/modalCriarSenha";

export default function CriarSenha() {


    return (
        <section>
            <div className="w-full max-w-sm space-y-4">
                <Button onClick={() => setOpen(true)} className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg">
                    Criar
                </Button>

                {open && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <SuccessCard
                            onClose={() => setOpen(false)}
                            onContinue={() => setOpen(false)}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
