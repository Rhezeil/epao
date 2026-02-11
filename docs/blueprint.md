# **App Name**: LexConnect

## Core Features:

- Role-Based Authentication: Implement a secure login system that differentiates between admin, client, and lawyer roles, controlling access to different parts of the application based on role.
- User Profile Management: Allow admins, clients, and lawyers to manage their profiles, including updating personal information and passwords. Persist user data to Firestore.
- Secure Password Handling: Use secure hashing and salting techniques for storing passwords in Firestore, and offer password reset functionality.
- Session Management: Maintain user sessions to keep users logged in across multiple requests, with automatic logouts after a period of inactivity.
- Access Control: Ensure that users can only access data and functionality appropriate to their role. Clients should not access lawyer data, and vice versa. Persist role specific rules to Firestore.

## Style Guidelines:

- Primary color: Deep navy blue (#1A237E) to convey trust and professionalism.
- Background color: Light gray (#F5F5F5) for a clean and modern feel.
- Accent color: Teal (#008080) to highlight important actions and sections.
- Body and headline font: 'Inter' for a clean, modern, and highly readable experience. The neutral design makes it well-suited for a professional context.
- Use a set of consistent and professional icons (e.g., FontAwesome) to represent different functions and user roles.
- Design a clear, intuitive layout with separate dashboards for admins, clients, and lawyers, each tailored to their specific needs.
- Incorporate subtle animations for transitions and loading states to enhance user experience without being distracting.