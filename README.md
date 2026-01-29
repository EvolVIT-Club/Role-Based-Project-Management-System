# Role-Based Project Management System

A modern web application for managing projects using **role-based access control (RBAC)**.  
The system clearly separates responsibilities between **Admin**, **Manager**, and **Team Member** roles, enabling efficient project planning, task assignment, and progress tracking.

---

## 🚀 Features

- 🔐 Role-Based Access Control (RBAC)
- 📁 Project creation and management
- 🧑‍💼 Admin, Manager, and Member dashboards
- ✅ Task assignment and status updates
- 📊 Progress tracking and visibility
- 👤 User profile management
- ⚡ Clean, responsive UI

---

## 🧩 User Roles

### Admin
- Create and manage users
- Create projects
- Assign managers to projects
- View overall progress

### Manager
- Manage assigned projects
- Create and assign tasks
- Track team progress

### Team Member
- View assigned tasks
- Update task status
- Track personal workload

---

## 🛠️ Tech Stack

- **Frontend:** React / Next.js
- **Styling:** Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT
- **Deployment:** Vercel

---

## 📦 Project Structure
app/
 ├─ layout.tsx        // Global layout with sidebar and header
 ├─ page.tsx          // Login page
 ├─ admin/
 │    ├─ page.tsx      // Admin dashboard
 │    ├─ managers/     // Manager profiles
 │    ├─ members/      // Member profiles
 │    ├─ projects/     // Project list
 │    └─ addProject/   // Form to add new project
 ├─ manager/
 │    ├─ page.tsx      // Manager dashboard
 │    ├─ projectList/  // Project overview
 │    ├─ members/      // Members list
 │    └─ assignTask/   // Assign task to members
 ├─ member/
 │    ├─ page.tsx      // Member dashboard
 │    └─ profile/      // Member profile
components/
 ├─ DashboardCard/
 ├─ Sidebar/
 ├─ ProfileCard/
 ├─ ProjectCard/
 ├─ TaskCard/
 └─ NotificationsModal/
hooks/
 ├─ useNotifications.js
 ├─ useTasks.js
 └─ useProjects.js
lib/
 └─ dummyData.ts
public/
 └─ images/
styles/
 ├─ globals.css
 └─ components/
## ⚙️ Installation & Setup

### Prerequisites

•⁠  ⁠Node.js (v16 or higher)
•⁠  ⁠npm or yarn
•⁠  ⁠MongoDB (local or cloud)

---

### Steps

1.⁠ ⁠*Clone the repository*
   ```bash
   git clone https://github.com/your-username/role-based-project-management.git
cd role-based-project-management
```
2.⁠ ⁠Install dependencies
npm install

3.⁠ ⁠Create .env file

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4.⁠ ⁠Run the application
npm run dev

5.⁠ ⁠Open browser and visit:
http://localhost:3000

📊 Application Flow
1. Admin creates users and projects
2. Admin assigns managers to projects
3. Managers assign tasks to team members
4. Team members update task status
5. Admin and managers monitor progress

🧪 Testing
Run tests using:
npm run test

✅ This README now includes all your requested updates:

Profile photo & DOB edit

Admin can add Admin, Manager, Member

Project/task assignments show brief data and workload

Manager assigns tasks with member workload & project options

Members can edit task status and see new task notifications

Dynamic progress bars and real-time updates

Fully Next.js App Router structure.
