import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockCalendarEvents, mockClients, mockTeamMembers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Bell,
  Video,
  Phone,
  AlertCircle,
} from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEventOpen, setNewEventOpen] = useState(false);

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    return mockCalendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  const eventTypeConfig = {
    hearing: { label: 'Audiência', color: 'bg-destructive', textColor: 'text-destructive', bgLight: 'bg-destructive/20', icon: AlertCircle },
    deadline: { label: 'Prazo', color: 'bg-warning', textColor: 'text-warning', bgLight: 'bg-warning/20', icon: Clock },
    meeting: { label: 'Reunião', color: 'bg-primary', textColor: 'text-primary', bgLight: 'bg-primary/20', icon: Video },
  };

  const upcomingEvents = mockCalendarEvents
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  const selectedDateEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  // Stats
  const thisMonthEvents = mockCalendarEvents.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
  });
  const hearingsCount = thisMonthEvents.filter(e => e.type === 'hearing').length;
  const deadlinesCount = thisMonthEvents.filter(e => e.type === 'deadline').length;
  const meetingsCount = thisMonthEvents.filter(e => e.type === 'meeting').length;

  return (
    <MainLayout title="Calendário" subtitle="Compromissos e prazos">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="metric-card">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Eventos este mês</span>
            <p className="text-3xl font-bold mt-2">{thisMonthEvents.length}</p>
          </div>
          <div className="metric-card metric-card-danger">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Audiências</span>
            <p className="text-3xl font-bold mt-2 text-destructive">{hearingsCount}</p>
          </div>
          <div className="metric-card metric-card-warning">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Prazos</span>
            <p className="text-3xl font-bold mt-2 text-warning">{deadlinesCount}</p>
          </div>
          <div className="metric-card metric-card-primary">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Reuniões</span>
            <p className="text-3xl font-bold mt-2 text-primary">{meetingsCount}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Calendar */}
          <div className="lg:col-span-3 dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-foreground">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button variant="outline" size="sm" onClick={goToToday} className="rounded-xl text-xs">
                  Hoje
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')} className="rounded-xl">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigateMonth('next')} className="rounded-xl">
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Dialog open={newEventOpen} onOpenChange={setNewEventOpen}>
                  <DialogTrigger asChild>
                    <Button className="ml-2 gap-2 bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
                      <Plus className="w-4 h-4" />
                      Novo Evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Evento</DialogTitle>
                      <DialogDescription>
                        Adicione um novo compromisso ao calendário.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Título do Evento</Label>
                        <Input placeholder="Ex: Audiência trabalhista" className="rounded-xl" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Select>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="hearing">Audiência</SelectItem>
                              <SelectItem value="deadline">Prazo</SelectItem>
                              <SelectItem value="meeting">Reunião</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Cliente</Label>
                          <Select>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              {mockClients.map(client => (
                                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Data</Label>
                          <Input type="date" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Horário</Label>
                          <Input type="time" className="rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Local</Label>
                        <Input placeholder="Ex: Vara do Trabalho, Sala 201" className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Observações</Label>
                        <Textarea placeholder="Notas adicionais..." className="rounded-xl min-h-[80px]" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewEventOpen(false)} className="rounded-xl">
                        Cancelar
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 rounded-xl">
                        Criar Evento
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-3">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const events = getEventsForDay(day);
                const isToday = day?.toDateString() === today.toDateString();
                const isSelected = day && selectedDate?.toDateString() === day.toDateString();

                return (
                  <div
                    key={index}
                    onClick={() => day && setSelectedDate(day)}
                    className={cn(
                      'min-h-[100px] p-2 rounded-xl border transition-all cursor-pointer',
                      day ? 'hover:border-primary/50' : 'cursor-default',
                      isToday && 'bg-primary/10 border-primary/50',
                      isSelected && !isToday && 'border-primary bg-primary/5',
                      !isToday && !isSelected && 'border-transparent hover:bg-secondary/50'
                    )}
                  >
                    {day && (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <p className={cn(
                            'text-sm font-semibold',
                            isToday ? 'text-primary' : 'text-foreground'
                          )}>
                            {day.getDate()}
                          </p>
                          {events.length > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                              {events.length}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {events.slice(0, 2).map(event => {
                            const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                            return (
                              <div
                                key={event.id}
                                className={cn(
                                  'text-xs px-2 py-1 rounded-lg truncate font-medium',
                                  config.bgLight,
                                  config.textColor
                                )}
                              >
                                {event.title.length > 10 ? event.title.slice(0, 10) + '...' : event.title}
                              </div>
                            );
                          })}
                          {events.length > 2 && (
                            <p className="text-xs text-primary font-medium text-center">
                              +{events.length - 2}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Selected Date Events */}
            {selectedDate && (
              <div className="dashboard-card">
                <h3 className="font-bold text-foreground mb-4">
                  {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map(event => {
                      const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                      const EventIcon = config.icon;
                      const eventDate = new Date(event.date);
                      const clientName = event.clientId
                        ? mockClients.find(c => c.id === event.clientId)?.name
                        : null;

                      return (
                        <div
                          key={event.id}
                          className={cn("p-3 rounded-xl border-l-4", config.bgLight)}
                          style={{ borderLeftColor: `hsl(var(--${config.color.replace('bg-', '')}))` }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <EventIcon className={cn("w-4 h-4", config.textColor)} />
                            <Badge className={cn('text-xs', config.bgLight, config.textColor)}>
                              {config.label}
                            </Badge>
                          </div>
                          <p className="font-semibold text-sm">{event.title}</p>
                          {clientName && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <User className="w-3 h-3" />
                              {clientName}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CalendarIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhum evento</p>
                  </div>
                )}
              </div>
            )}

            {/* Upcoming Events */}
            <div className="dashboard-card">
              <h3 className="font-bold text-foreground mb-4">Próximos Eventos</h3>
              <div className="space-y-3">
                {upcomingEvents.map(event => {
                  const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                  const EventIcon = config.icon;
                  const eventDate = new Date(event.date);

                  return (
                    <div
                      key={event.id}
                      className="p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn('p-2 rounded-lg', config.bgLight)}>
                          <EventIcon className={cn('w-4 h-4', config.textColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="dashboard-card">
              <h3 className="font-bold text-foreground mb-4">Legenda</h3>
              <div className="space-y-3">
                {Object.entries(eventTypeConfig).map(([key, config]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className={cn('w-3 h-3 rounded-full', config.color)} />
                    <span className="text-sm text-foreground">{config.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
