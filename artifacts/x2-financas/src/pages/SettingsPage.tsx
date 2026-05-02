import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggle } = useTheme();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImageUrl(url);
    }
  };

  const categories = [
    "Entretenimento", "Alimentação", "Transporte", "Moradia", 
    "Saúde", "Educação", "Lazer"
  ];

  return (
    <motion.div 
      className="space-y-6 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 className="text-3xl font-bold font-title text-foreground">Configurações</h2>
        <p className="text-muted-foreground mt-1">Gerencie suas preferências de conta e segurança.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Left: Perfil */}
        <Card className="bg-card border-border flex flex-col">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Suas informações pessoais de exibição.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
            <div className="flex items-center gap-6">
              <div 
                className="relative group cursor-pointer" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="w-20 h-20 border-2 border-primary/20 transition-all group-hover:opacity-80">
                  {imageUrl ? (
                    <AvatarImage src={imageUrl} alt="Profile" className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">MA</AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
              />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Alterar Foto</Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue="Mikaely Alves" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" defaultValue="mikaely@kquadratica.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" defaultValue="(11) 99999-9999" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 mt-auto">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Salvar Alterações</Button>
          </CardFooter>
        </Card>

        {/* Top Right: Segurança */}
        <Card className="bg-card border-border flex flex-col">
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Gerencie a segurança da sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Autenticação em 2 Fatores (2FA)</Label>
                  <p className="text-sm text-muted-foreground">Adiciona uma camada extra de segurança.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Acesso com Biometria</Label>
                  <p className="text-sm text-muted-foreground">Usar Face ID ou Touch ID.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Alertas de Login</Label>
                  <p className="text-sm text-muted-foreground">Notificar sobre novos acessos.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 mt-auto">
            <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
              Mudar Senha
            </Button>
          </CardFooter>
        </Card>

        {/* Bottom Left: Notificações */}
        <Card className="bg-card border-border flex flex-col">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Escolha o que deseja receber.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <Label className="font-normal cursor-pointer" htmlFor="notif-1">Novas Transações</Label>
              <Switch id="notif-1" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-normal cursor-pointer" htmlFor="notif-2">Metas Atingidas</Label>
              <Switch id="notif-2" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-normal cursor-pointer" htmlFor="notif-3">Relatório Mensal</Label>
              <Switch id="notif-3" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-normal cursor-pointer" htmlFor="notif-4">Alertas de Limite</Label>
              <Switch id="notif-4" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Bottom Right: Preferências */}
        <Card className="bg-card border-border flex flex-col">
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>Ajustes regionais e de interface.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="space-y-2">
              <Label>Moeda</Label>
              <Select defaultValue="BRL">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (BRL)</SelectItem>
                  <SelectItem value="USD">Dólar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select defaultValue="pt-BR">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português Brasil</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Label>Tema Escuro</Label>
              <Switch checked={theme === "dark"} onCheckedChange={toggle} />
            </div>
          </CardContent>
        </Card>

        {/* Bottom Full Width: Categorias */}
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle>Categorias de Gastos</CardTitle>
            <CardDescription>Personalize suas categorias para organizar melhor.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="px-3 py-1 text-sm font-normal">
                  {cat}
                </Badge>
              ))}
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Adicionar Categoria
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
