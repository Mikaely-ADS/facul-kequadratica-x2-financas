import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <motion.div 
      className="space-y-6 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 className="text-3xl font-bold font-title text-foreground">Configurações</h2>
        <p className="text-muted-foreground mt-1">Gerencie suas preferências de conta e segurança.</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Suas informações pessoais de exibição.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">MA</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Alterar Foto</Button>
          </div>
          
          <Separator className="bg-border" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" defaultValue="Mikauly Alves" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" defaultValue="mikauly@kquadratica.com" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border pt-4">
          <Button className="ml-auto" disabled>Salvar Alterações</Button>
        </CardFooter>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>Atualize sua senha e proteja sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="border-t border-border pt-4">
          <Button variant="outline" className="ml-auto" disabled>Atualizar Senha</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
