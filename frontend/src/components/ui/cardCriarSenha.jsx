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
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CheckCircle2, EyeClosed, X, Eye } from "lucide-react";

export default function CriarSenha() {

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validations = [
        { text: "At least 8 characters", valid: password.length >= 8 },
        { text: "Contains a number", valid: /\d/.test(password) },
        { text: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
        { text: "Contains special character", valid: /[!@#$%^&*]/.test(password) },
    ];

    const strength = validations.filter((v) => v.valid).length;

    const getStrengthColor = (score) => {
        if (score === 0) return "bg-muted";
        if (score <= 1) return "bg-red-600";
        if (score <= 2) return "bg-orange-500";
        if (score <= 3) return "bg-teal-400";
        return "bg-teal-500";
    };

    const getStrengthText = (score) => {
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
    };

    return (
        <section
            className="lg:h-[calc(100vh-80px)] flex items-center justify-center relative">
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
                                <div className="flex flex-col gap-4">
                                    <Field className="gap-1.5">
                                        <Label htmlFor="password-realtime">Password</Label>
                                        <div className="relative">
                                            <Input
                                                className="bg-transparent"
                                                id="password-realtime"
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter password"
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
                                    </Field>

                                    <Field className="gap-1.5">
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












                                <div className="space-y-2">
                                    <Label htmlFor="password-realtime">Senha</Label>
                                    <div className="relative">
                                        <Input
                                            className="bg-transparent"
                                            id="password-realtime"
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
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
                                    

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className={getStrengthTextColor(strength)}>
            {getStrengthText(strength)}
          </span>
        </div>
      </div>
      <div className="space-y-1.5 pt-1">
        {validations.map((validation, index) => (
          <div
            className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
              validation.valid
                ? "text-green-500"
                : "text-muted-foreground"
            }`}
            key={index}>
            {validation.valid ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
            <span className="text-[13px]">{validation.text}</span>
          </div>
        ))}
      </div>



                                </div>












                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}