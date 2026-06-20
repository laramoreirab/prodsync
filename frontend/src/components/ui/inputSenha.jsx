"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const InputSenha = ({ value, onChange, errorId }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="confirm-password">Confirmar Senha</Label>
      <div className="relative">
        <Input
          id="confirm-password"
          name="confirmPassword"
          className="bg-transparent [&::-ms-reveal]:hidden h-10 pr-10"
          onChange={onChange}
          type={showPassword ? "text" : "password"}
          value={value}
          autoComplete="new-password"
          required
          aria-describedby={errorId}
        />
        <Button
          className="absolute top-0 right-0 h-full px-3 hover:bg-transparent cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
          size="icon"
          type="button"
          variant="ghost"
          aria-label={showPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
        >
          {showPassword ? (
            <Eye aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          ) : (
            <EyeOff aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default InputSenha;