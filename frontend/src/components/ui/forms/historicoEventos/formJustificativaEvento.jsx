import { useState, useEffect } from 'react';
import { Loader2, Pencil } from "lucide-react";
import {
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function FormJustificativaEvento() {

    return (
        <>
            <div className="title_modal flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Pencil className="mr-2 text-4xl text-white" />
                    <DialogTitle className="text-3xl text-white">
                        Justificar Evento
                    </DialogTitle>
                </div>
            </div>
            <Separator className="my-2" />
            <form className="px-8 pb-8 pt-4 flex flex-col gap-6">
                <div className='flex flex-col'>
                    <h1>Informações do Evento</h1>
                </div>
            </form>
        </>
    )
}