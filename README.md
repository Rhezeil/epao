# LexConnect - Legal Services Management Portal

LexConnect is a modern, high-integrity legal portal designed to streamline the operations of the Public Attorney's Office. It facilitates seamless interaction between indigent citizens, public attorneys, and system administrators through a real-time, event-driven architecture.

## 🚀 System Overview

LexConnect operates as a centralized digital ecosystem powered by **Next.js 15**, **Firebase (Firestore/Auth)**, and **Genkit AI**. The platform is designed to handle the full lifecycle of a legal aid request—from initial public inquiry to official case resolution.

### Core Technical Pillars:
*   **Real-time Synchronization**: Using Firestore listeners, workstations update instantly when a booking is made or a case is assigned.
*   **Mandatory Accountability**: Lawyers must "Acknowledge" new tasks, and every administrative action is logged in a non-deletable System Audit.
*   **Performance Engineering**: Parallelized role-checking and single-pass data grouping ensure the Admin Dashboard remains responsive under heavy loads.
*   **Security Isolation**: Strict role-based access control (RBAC) ensures client confidentiality and professional boundary management.

## 👥 Detailed Feature Roadmap

### 🏛️ Administrator (Command Center)
*   **System Audit Feed**: A high-priority real-time log tracking every interaction across the platform (Bookings, Triage, Profile Updates).
*   **Intake Assessment**: A dedicated workstation to evaluate guest screenings, verify indigency proofs, and validate legal merit.
*   **Staff Workload Monitor**: Visualized data tracking active caseloads and daily session distributions across all Public Attorneys.
*   **Registry Management**: Unified control over the Client Directory and the Visit Registry, including override capabilities for any appointment.
*   **Statutory Standards Manager**: Tools to seed and update the documentary requirements and roadmaps for various legal jurisdictions.

### ⚖️ Public Attorney (Professional Workstation)
*   **Workstation Home**: A focused dashboard highlighting the daily session load and unread "Workstation Alerts."
*   **Assignment Alerts**: Immediate real-time notifications for new case assignments or client follow-ups with a required "Acknowledge" flow.
*   **Legal Case Registry**: Direct access to assigned client profiles, full visit history, and case status controls.
*   **Availability Registry**: Granular schedule management allowing lawyers to log Court Duty, Jail Visits, or Leave with categorized reasons and an overlap-free UI.

### 👤 Citizen / Client (Access Portal)
*   **Personal Dashboard**: Real-time status of their official legal record, Case ID, and assigned Public Attorney.
*   **Secure Follow-up Booking**: One-click scheduling with their specific assigned lawyer, protected by identity verification via mock SMS OTP.
*   **Office Notifications**: High-priority alerts if their assigned lawyer reschedules a session or if the office requires more documentation.
*   **Visit History**: A chronological log of every interaction with the Public Attorney's Office.

### 🌐 Guest (Public Assistance)
*   **Case Navigator**: A statutory guidance tool providing document checklists and procedural roadmaps for jurisdictions like Criminal, Civil, and Labor.
*   **Screening Booking**: A guided flow to schedule an initial eligibility interview, including a unique Reference Code for tracking.
*   **Visit Management**: capability to verify status, reschedule, or cancel screenings using their Reference Code and identity verification.

## 🛠️ Technical Architecture

*   **Frontend**: React 19, Tailwind CSS, and ShadCN UI components for a modern, accessible interface.
*   **Backend**: 
    *   **Firestore**: Real-time NoSQL database with complex indexing for audit logs and workload analytics.
    *   **Authentication**: Firebase Auth with multi-channel support (Email and Simulated SMS).
*   **AI Layer**: Genkit integration for automated SMS gateway simulation and message formatting.
*   **Optimization**: Custom `useMemoFirebase` and parallel `Promise.all` logic for high-speed dashboard rendering.

## 🔒 Security & Privacy
*   **Confidentiality**: Professional profiles and client details are shielded via Security Rules.
*   **Integrity**: The "System Audit" provides a permanent record of all professional and administrative actions, preventing unauthorized record modification.
