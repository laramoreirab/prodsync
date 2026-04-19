import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { EllipsisVertical, EyeIcon, Pencil, Trash2 } from 'lucide-react';

const DropdownActions = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' className="border-none bg-transparent">
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-36 font-semibold'>
                <DropdownMenuGroup>



                    <DropdownMenuItem>
                        <EyeIcon />
                        Ver Detalhes
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <Pencil className='text-primary' />
                        Editar
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <Trash2 className='text-vermelho-vivido'/>
                        Excluir
                    </DropdownMenuItem>

                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownActions;
