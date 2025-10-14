import { AppSidebar } from "../AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Router } from "wouter";

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <Router>
      <SidebarProvider style={style as React.CSSProperties}>
        <AppSidebar />
      </SidebarProvider>
    </Router>
  );
}
