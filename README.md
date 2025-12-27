# GearGuard: The Ultimate Maintenance Tracker

GearGuard is a modern, high-performance maintenance management system designed to track assets (equipment) and manage their maintenance lifecycle through an interactive Kanban board and scheduling tools.

## ✨ Features

- **Interactive Kanban Board**: Drag-and-drop workflow for managing maintenance requests from initiation to completion.
- **Smart Asset Connectivity**: Automatic routing of maintenance teams based on equipment selection.
- **Bi-Modal Maintenance**:
  - **Corrective**: Handles unplanned breakdowns.
  - **Preventive**: Planned routine checkups with calendar integration.
- **Equipment Repository**: Centralized database for equipment tracking by department, employee, and location.
- **Role-Based Views**: Tailored interfaces for Admins and Technicians.
- **Premium Design**: Smooth light theme with a modern, glassmorphism-inspired aesthetic.

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router, Server Components)
- **Styling**: Tailwind CSS 4+
- **UI Components**: Shadcn UI (Radix UI)
- **State Management**: Tanstack Query (React Query)
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Animations**: Framer Motion / Tailwind Transitions

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Build for production**:
   ```bash
   npm run build
   ```

## 📐 Project Structure

- `app/`: Next.js pages and layouts (Server-first).
- `components/`: Modular UI units.
  - `ui/`: Core atomic components.
  - `kanban/`: Workflow board implementation.
  - `equipment/`: Asset-related views.
  - `layout/`: Global shell components.
- `lib/`: Utilities, providers, and mock API logic.
- `types/`: TypeScript definitions.

## 🔒 Authentication Roles

- **Admin**: Full access to register equipment, assign teams, and manage technicians.
- **User (Technician)**: Manage assigned tasks on the Kanban board and record maintenance hours.
