# LexConnect - Legal Services Management Portal

LexConnect is a high-integrity digital ecosystem designed to modernize the operations of the Public Attorney's Office (PAO). It manages the entire lifecycle of a legal aid request—from initial public inquiry to official case resolution—through a multi-role digital workstation model.

## 🚀 System Overview

LexConnect operates as a centralized platform powered by **Next.js 15**, **Firebase (Firestore/Auth)**, and **Genkit AI**. The system is built to ensure that communication between indigent citizens and legal counsel is immediate, transparent, and fully auditable.

### Core Technical Pillars:
*   **Real-time Synchronization**: Using Firestore listeners, all workstations update instantly when a booking is made or a case is assigned.
*   **Entity-Driven Alerts**: Notifications for lawyers are pulled directly from `appointments` and `cases` to ensure workstation integrity and mandatory accountability.
*   **Security Isolation**: Strict role-based access control (RBAC) ensures client confidentiality and professional boundary management.
*   **Performance Engineering**: Parallelized role-checking and single-pass data grouping ensure the dashboards remain responsive under heavy loads.

## 👥 User Roles & Workstations

### 🏛️ Administrator (Command Center)
*   **Intake Assessment**: A dedicated workstation to evaluate guest screenings, verify indigency proofs, and validate legal merit.
*   **System Audit Feed**: A high-priority real-time log tracking every interaction across the platform for permanent accountability.
*   **Staff Workload Monitor**: Visualized data tracking active caseloads and daily session distributions across all Public Attorneys.
*   **Registry Management**: Unified control over the Client Directory and the Visit Registry, including override capabilities for any schedule.

### ⚖️ Public Attorney (Professional Workstation)
*   **Assignment Alerts**: Immediate real-time notifications for new case assignments or client follow-ups with a required "Acknowledge" flow.
*   **Workstation Home**: A focused dashboard highlighting the daily session load and active caseload.
*   **Legal Case Registry**: Direct access to assigned client profiles, full visit history, and case status controls.
*   **Availability Registry**: Granular schedule management allowing lawyers to log Court Duty, Field Work, or Leave with categorized reasons and an overlap-free UI.

### 👤 Citizen / Client (Access Portal)
*   **Personal Dashboard**: Real-time status of their official legal record, Case ID, and assigned Public Attorney.
*   **Secure Follow-up Booking**: One-click scheduling specifically with their assigned lawyer, protected by identity verification via mock SMS OTP.
*   **Office Notifications**: High-priority alerts if their assigned lawyer reschedules a session or cancels an appointment.

### 🌐 Guest (Public Assistance)
*   **Case Navigator**: A statutory guidance tool providing document checklists and procedural roadmaps for various legal jurisdictions (Criminal, Civil, Labor).
*   **Screening Booking**: A guided flow to schedule an initial eligibility interview, including a unique Reference Code for tracking.

## 🛠️ Technical Architecture

*   **Frontend**: Next.js 15, React 19, Tailwind CSS, and ShadCN UI components.
*   **Backend**: 
    *   **Firestore**: Real-time NoSQL database with optimized indexing for audit logs.
    *   **Authentication**: Firebase Auth with role-based redirection and parallelized verification.
*   **AI Layer**: Genkit integration for automated SMS gateway simulation.
*   **Security**: Hardened Firestore Security Rules for cross-role data isolation and integrity.

## 🔒 Security & Privacy
*   **Confidentiality**: Professional profiles and client details are shielded via strict Security Rules.
*   **Traceability**: The "System Audit" provides a permanent record of all professional and administrative actions, preventing unauthorized record modification.
# epao.cloud
# epao
