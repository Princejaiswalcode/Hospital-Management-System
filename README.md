# Hospital Management System

## Overview

The Hospital Management System is a full-stack web application designed to streamline hospital operations such as patient management, appointments, treatments, billing, and ward allocation.

The system provides role-based dashboards for different users, ensuring that each role accesses only the relevant features and data. The focus of this project is on practical system design, modular architecture, and real-world workflow simulation.

---

## Key Features

### Authentication and Authorization

* Secure login system
* Role-based access control
* Session-based user handling

### Role-Based Dashboards

* Separate dashboards for staff and patients
* Dynamic data rendering based on user role

### Patient Management

* Add and manage patient records
* View patient details and history
* Admission and discharge handling

### Appointment Management

* Schedule and track appointments
* View upcoming appointments
* Role-specific visibility

### Treatment Management

* Assign treatments to patients
* Maintain treatment history
* Accessible by doctors and nurses

### Ward and Admission

* Track ward availability
* Monitor bed occupancy
* Manage patient admissions

### Billing System

* Generate and manage bills
* Track payment status (paid or pending)
* Patient-specific billing interface

### Patient Portal

* View personal profile
* Access appointments and treatments
* Track billing information

---

## Technology Stack

### Frontend

* HTML5
* CSS3 (custom styling with responsive layout)
* JavaScript (vanilla)
* SweetAlert2 for alerts

### Backend

* Node.js
* Express.js
* REST API architecture

### Database

* Database: MySQL 

---

## Project Structure

frontend/
html/
dashboard.html
patient-dashboard.html
patient-profile.html
my-appointments.html
my-bills.html

css/
base.css
dashboard.css
patient-dashboard.css

js/
layout.js
dashboard.js
patient-dashboard.js

backend/
routes/
controllers/
models/
server.js

---

## Setup Instructions

### Clone Repository

git clone [https://github.com/your-username/hospital-management-system.git](https://github.com/your-username/hospital-management-system.git)
cd hospital-management-system

### Install Dependencies

npm install

### Run Backend

npm start

Server runs at:
[http://localhost:5000](http://localhost:5000)

### Run Frontend

Open the following file in browser or Live Server:

frontend/html/login.html

---

## API Endpoints (Sample)

POST   /api/auth/login
GET    /api/dashboard
GET    /api/patient/dashboard
GET    /api/appointments
GET    /api/bills
GET    /api/wards

---

## Core Concepts Implemented

* Role-based UI rendering
* Modular frontend structure
* RESTful API integration
* Session management using browser storage
* Dynamic DOM updates

---

## Known Limitations

* Limited animations and UI polish
* No advanced filtering or search
* Pagination not implemented
* Basic error handling
* Mobile responsiveness can be improved

---

## Future Improvements

* Notification system
* Advanced analytics dashboard
* Mobile application version
* File upload for reports and prescriptions
* Performance optimizations

---

## Author

Millind Amb
Mahek Yadav
Prince Jaiswal
B.Tech Student
Focused on building real-world systems through practical implementation

---

## Note

This project emphasizes hands-on development and system-level thinking. The goal is to understand how real applications are structured, built, and scaled rather than focusing only on theoretical concepts.

