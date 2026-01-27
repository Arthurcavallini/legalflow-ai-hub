import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Building2,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Save,
} from 'lucide-react';

export default function Settings() {
  return (
    <MainLayout title="Configurações" subtitle="Gerencie as configurações do sistema">
      <div className="max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="office" className="gap-2">
              <Building2 className="w-4 h-4" />
              Escritório
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Faturamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-6">Informações Pessoais</h3>
              
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    DR
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Alterar foto</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" defaultValue="Dr. Ricardo Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" defaultValue="ricardo@escritorio.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="+55 11 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oab">OAB</Label>
                  <Input id="oab" defaultValue="SP 123.456" />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Save className="w-4 h-4" />
                  Salvar alterações
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="office" className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-6">Dados do Escritório</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="officeName">Nome do escritório</Label>
                  <Input id="officeName" defaultValue="Silva & Associados Advogados" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo/SP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officePhone">Telefone</Label>
                  <Input id="officePhone" defaultValue="+55 11 3333-3333" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officeEmail">E-mail</Label>
                  <Input id="officeEmail" type="email" defaultValue="contato@escritorio.com" />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Save className="w-4 h-4" />
                  Salvar alterações
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-6">Preferências de Notificação</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Novos leads</p>
                    <p className="text-sm text-muted-foreground">Receber notificações de novos leads</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tarefas atrasadas</p>
                    <p className="text-sm text-muted-foreground">Alertas de tarefas vencidas</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Intimações</p>
                    <p className="text-sm text-muted-foreground">Notificações do Diário Oficial</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pagamentos</p>
                    <p className="text-sm text-muted-foreground">Alertas de vencimentos e atrasos</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">E-mail diário</p>
                    <p className="text-sm text-muted-foreground">Resumo diário por e-mail</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-6">Segurança da Conta</h3>
              
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha atual</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div />
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova senha</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticação em dois fatores</p>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4" />
                    Atualizar senha
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-6">Plano e Faturamento</h3>
              
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Plano Profissional</p>
                  <span className="text-primary font-bold">R$ 299/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">Acesso a todos os recursos, até 10 usuários</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium">Próxima cobrança</p>
                    <p className="text-sm text-muted-foreground">01 de Fevereiro de 2024</p>
                  </div>
                  <span className="text-lg font-bold">R$ 299,00</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium">Método de pagamento</p>
                    <p className="text-sm text-muted-foreground">Cartão •••• 4242</p>
                  </div>
                  <Button variant="outline" size="sm">Alterar</Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Histórico de faturas</p>
                  <p className="text-sm text-muted-foreground">Visualize suas faturas anteriores</p>
                </div>
                <Button variant="outline">Ver faturas</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
