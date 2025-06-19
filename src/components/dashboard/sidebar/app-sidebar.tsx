"use client"

import type * as React from "react"
import {
  Plane,
  MapPin,
  Users,
  Calendar,
  Hotel,
  Car,
  BarChart3,
  Settings2,
  Package,
  CreditCard,
  FileText,
  Globe,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/sidebar/nav-main"
import { NavProjects } from "@/components/dashboard/sidebar/nav-projects"
import { NavSecondary } from "@/components/dashboard/sidebar/nav-secondary"
import { NavUser } from "@/components/dashboard/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Ana García",
    email: "ana@viajesparadiso.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Resumen General",
          url: "/dashboard",
        },
        {
          title: "Métricas",
          url: "/dashboard/metricas",
        },
        {
          title: "Reportes",
          url: "/dashboard/reportes",
        },
      ],
    },
    {
      title: "Reservas",
      url: "/dashboard/booking",
      icon: Calendar,
      items: [
        {
          title: "Todas las Reservas",
          url: "/reservas",
        },
        {
          title: "Pendientes",
          url: "/dashboard/reservas/pendientes",
        },
        {
          title: "Confirmadas",
          url: "/reservas/confirmadas",
        },
        {
          title: "Canceladas",
          url: "/reservas/canceladas",
        },
      ],
    },
    {
      title: "Paquetes Turísticos",
      url: "/dashboard/tours",
      icon: Package,
      items: [
        {
          title: "Todos los Paquetes",
          url: "/paquetes",
        },
        {
          title: "Crear Paquete",
          url: "/paquetes/crear",
        },
        {
          title: "Promociones",
          url: "/paquetes/promociones",
        },
        {
          title: "Temporadas",
          url: "/paquetes/temporadas",
        },
      ],
    },
    {
      title: "Clientes",
      url: "/dashboard/users",
      icon: Users,
      items: [
        {
          title: "Lista de Clientes",
          url: "/clientes",
        },
        {
          title: "Historial",
          url: "/clientes/historial",
        },
        {
          title: "Preferencias",
          url: "/clientes/preferencias",
        },
      ],
    },
    {
      title: "Destinos",
      url: "/destinos",
      icon: MapPin,
      items: [
        {
          title: "Todos los Destinos",
          url: "/destinos",
        },
        {
          title: "Agregar Destino",
          url: "/destinos/crear",
        },
        {
          title: "Actividades",
          url: "/destinos/actividades",
        },
      ],
    },
    {
      title: "Servicios",
      url: "/servicios",
      icon: Hotel,
      items: [
        {
          title: "Hoteles",
          url: "/servicios/hoteles",
        },
        {
          title: "Transporte",
          url: "/servicios/transporte",
        },
        {
          title: "Excursiones",
          url: "/servicios/excursiones",
        },
        {
          title: "Proveedores",
          url: "/servicios/proveedores",
        },
      ],
    },
    {
      title: "Finanzas",
      url: "/finanzas",
      icon: CreditCard,
      items: [
        {
          title: "Facturación",
          url: "/finanzas/facturacion",
        },
        {
          title: "Pagos",
          url: "/finanzas/pagos",
        },
        {
          title: "Comisiones",
          url: "/finanzas/comisiones",
        },
        {
          title: "Reportes Financieros",
          url: "/finanzas/reportes",
        },
      ],
    },
    {
      title: "Configuración",
      url: "/configuracion",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/configuracion/general",
        },
        {
          title: "Usuarios",
          url: "/configuracion/usuarios",
        },
        {
          title: "Permisos",
          url: "/configuracion/permisos",
        },
        {
          title: "Integraciones",
          url: "/configuracion/integraciones",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Documentación",
      url: "/documentacion",
      icon: FileText,
    },
    {
      title: "Soporte Técnico",
      url: "/soporte",
      icon: Globe,
    },
  ],
  projects: [
    {
      name: "Caribe Premium",
      url: "/paquetes/caribe-premium",
      icon: Plane,
    },
    {
      name: "Europa Clásica",
      url: "/paquetes/europa-clasica",
      icon: MapPin,
    },
    {
      name: "Aventura Patagonia",
      url: "/paquetes/aventura-patagonia",
      icon: Car,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Plane className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Viajes Paraíso</span>
                  <span className="truncate text-xs">Panel Administrativo</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
