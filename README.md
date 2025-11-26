# Schneider Electric - SET SPS (Production Management System)

![Schneider Electric](https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Schneider_Electric_2007.svg/2560px-Schneider_Electric_2007.svg.png)

## Overview

**SET SPS** is a comprehensive Production Management System designed for Schneider Electric. It provides advanced analytics, time definition tracking, and performance monitoring for manufacturing lines. The system enables real-time visualization of Key Performance Indicators (KPIs) such as KD, DT, UT, NVA, and OTR, helping plant managers and engineers optimize production efficiency.

## Key Features

### 📊 Advanced Analytics
- **Global Dashboard**: Real-time overview of all production lines with aggregated metrics.
- **Waterfall Charts**: Visual representation of time losses and efficiency drops.
- **Trend Analysis**: Historical data tracking to identify long-term performance trends.
- **AI-Powered Insights**: Integrated AI assistant provides actionable insights based on production data.

### 🏭 Line Management
- **Dynamic Line Configuration**: Create, edit, and manage production lines effortlessly.
- **Product Management**: Track products associated with specific lines.
- **Yearly Data Tracking**: Manage performance data across different fiscal years.

### 👥 User & Role Management
- **Role-Based Access Control (RBAC)**: Secure access for Admins and Standard Users.
- **Line Assignments**: Granular permission system to assign specific lines to specific users.
- **Secure Authentication**: Robust login system powered by NextAuth.js.

### 🛡️ Security & Reliability
- **Data Integrity**: Transactional database operations ensure data consistency.
- **Backup & Restore**: Full JSON and Excel import/export capabilities for data safety.
- **Security Headers**: Implemented strict HTTP security headers for protection against web vulnerabilities.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/) / [Recharts](https://recharts.org/)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL Database

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/set-sps.git
    cd set-sps
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/setsps"
    NEXTAUTH_SECRET="your-super-secret-key"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Database Setup**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the application**
    ```bash
    npm run dev
    ```

## Deployment

The application is optimized for deployment on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository.
2.  Import the project into Vercel.
3.  Configure the Environment Variables in Vercel settings.
4.  Deploy!

## License

This project is proprietary software developed for **Schneider Electric**. Unauthorized copying, modification, or distribution is strictly prohibited.

---
*Developed by Ahmet Mersin*
