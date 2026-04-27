import { useState } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Plus} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';

export default function FormCadastroSetor() {
    return (
        <>
            <div className="flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Plus className="mr-2 text-3xl text-white" />
                    <DialogTitle className="text-3xl text-white">Criar Setor</DialogTitle>
                </div>
            </div>
            <Separator className="m-2 bg-[#a6a6a6]" />
            <form className="px-8 pb-8 pt-4 flex flex-col gap-6">

            </form>
        </>
    )
} 