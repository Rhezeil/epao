# LexConnect - Legal Services Management Portal

LexConnect is a modern, high-integrity legal portal designed to streamline the operations of the Public Attorney's Office. It facilitates seamless interaction between indigent citizens, public attorneys, and system administrators.

## 🚀 System Overview

LexConnect operates as a real-time digital workstation powered by **Next.js 15**, **Firebase**, and **Genkit AI**. The system is built on a role-based architecture that ensures data privacy, professional accountability, and operational transparency.

## 👥 User Roles & Features

### 🏛️ Administrator (Command Center)
*   **Diagnostic Analysis**: Real-time charts showing intake trends, eligibility ratios, and staff workload distribution.
*   **Intake Assessment**: A dedicated workstation to evaluate guest screenings, verify indigency, and assign Public Attorneys.
*   **System Audit Feed**: A global activity log tracking every interaction across the platform with direct navigation to records.
*   **Staff Management**: Tools to provision lawyer accounts, monitor active caseloads, and override professional schedules.
*   **Visit Registry**: A terminal control center to manage, confirm, or reschedule any appointment in the system.

### ⚖️ Public Attorney (Professional Workstation)
*   **Workstation Home**: Focused view of the daily session load and total active caseload.
*   **Real-time Workstation Alerts**: Immediate notifications for new case assignments or client follow-up bookings with a mandatory "Acknowledge" workflow.
*   **Legal Case Management**: Digital access to assigned client profiles, visit history, and case status controls.
*   **Availability Registry**: Granular schedule management allowing lawyers to log Court Duty, Jail Visits, or Leave with categorized reasons and an overlap-free UI.

### 👤 Citizen / Client (Access Portal)
*   **Personal Dashboard**: Real-time status of their official legal case and assigned counsel.
*   **Follow-up Scheduling**: One-click booking with their specific assigned lawyer, including identity verification via mock SMS OTP.
*   **Office Notifications**: High-priority alerts if a lawyer reschedules or modifies a session.
*   **Profile Management**: Self-service updates for contact and residential information.

### 🌐 Guest (Public Assistance)
*   **Case Navigator**: A statutory guidance tool providing document checklists and roadmaps for various legal jurisdictions (Criminal, Civil, Labor, etc.).
*   **Screening Booking**: A guided flow to schedule an initial eligibility interview at the PAO office.
*   **Visit Management**: Capability to track, reschedule, or cancel screenings using a unique Reference Code.

## 🛠️ Technical Architecture

*   **Frontend**: React 19, Tailwind CSS, and ShadCN UI for a high-performance, accessible interface.
*   **Backend**: 
    *   **Firestore**: Real-time NoSQL database with strict role-based Security Rules.
    *   **Authentication**: Firebase Auth supporting both Email/Password and simulated SMS OTP flows.
*   **AI Layer**: Genkit integration for automated SMS gateway simulation and message formatting.
*   **Performance**: Optimized parallel role-checking during login and single-pass grouping logic for heavy data analytics.

## 🔒 Security & Privacy
*   **Role Isolation**: Security rules ensure that Lawyers can only access their assigned clients, and Clients can only view their own cases.
*   **Audit Integrity**: System-wide notifications are non-deletable, providing a permanent record of all administrative and professional actions.
