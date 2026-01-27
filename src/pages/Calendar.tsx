import { MainLayout } from '@/components/layout/MainLayout';
import { mockCalendarEvents, mockClients, mockTeamMembers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
} from 'lucide-react';
import { useState } from 'react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date('2024-01-15'));

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
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

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  const eventTypeConfig = {
    hearing: { label: 'Audiência', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50' },
    deadline: { label: 'Prazo', color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50' },
    meeting: { label: 'Reunião', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
  };

  const upcomingEvents = mockCalendarEvents
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <MainLayout title="Calendário" subtitle="Compromissos e prazos">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button className="ml-2 gap-2 bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Novo Evento
              </Button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const events = getEventsForDay(day);
              const isToday = day?.toDateString() === today.toDateString();

              return (
                <div
                  key={index}
                  className={cn(
                    'min-h-[100px] p-2 rounded-lg border border-transparent transition-colors',
                    day ? 'hover:border-border cursor-pointer' : '',
                    isToday && 'bg-primary/5 border-primary/20'
                  )}
                >
                  {day && (
                    <>
                      <p className={cn(
                        'text-sm font-medium mb-1',
                        isToday && 'text-primary'
                      )}>
                        {day.getDate()}
                      </p>
                      <div className="space-y-1">
                        {events.slice(0, 2).map(event => {
                          const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                          return (
                            <div
                              key={event.id}
                              className={cn(
                                'text-xs px-1.5 py-0.5 rounded truncate',
                                config.bgLight,
                                config.textColor
                              )}
                            >
                              {event.title.length > 15 ? event.title.slice(0, 15) + '...' : event.title}
                            </div>
                          );
                        })}
                        {events.length > 2 && (
                          <p className="text-xs text-muted-foreground text-center">
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

        {/* Upcoming Events */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
            <h3 className="font-semibold mb-4">Próximos Eventos</h3>
            <div className="space-y-3">
              {upcomingEvents.map(event => {
                const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                const eventDate = new Date(event.date);
                const clientName = event.clientId
                  ? mockClients.find(c => c.id === event.clientId)?.name
                  : null;

                return (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('w-1 h-full rounded-full', config.color)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={cn('text-xs', config.bgLight, config.textColor)}>
                            {config.label}
                          </Badge>
                        </div>
                        <p className="font-medium text-sm">{event.title}</p>
                        {clientName && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <User className="w-3 h-3" />
                            {clientName}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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
          <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
            <h3 className="font-semibold mb-4">Legenda</h3>
            <div className="space-y-2">
              {Object.entries(eventTypeConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={cn('w-3 h-3 rounded-full', config.color)} />
                  <span className="text-sm">{config.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
