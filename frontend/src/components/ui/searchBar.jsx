'use client'

import { useEffect, useId, useState } from 'react'
import { SearchIcon, LoaderCircleIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SearchBar = () => {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const id = useId()

  useEffect(() => {
    if (value) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
    setIsLoading(false)
  }, [value])

  return (
    <div className='w-full lg:w-4/5 space-y-2'>
      <Label htmlFor={id} className="text-sm font-medium">Buscar</Label>
      <div className='relative'>
        <Input
          id={id}
          type='search'
          placeholder="Pesquisar..."
          value={value}
          onChange={e => setValue(e.target.value)}
          // pr-9 garante que o texto não fique sob o ícone no final
          className='pr-9'
        />

        {/* ÍCONE NO FINAL (DIREITA) */}
        <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground'>
          {isLoading ? (
            <LoaderCircleIcon className='size-4 animate-spin' />
          ) : (
            <SearchIcon className='size-4' />
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBar;