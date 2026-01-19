CREATE TABLE users(
    user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    role VARCHAR2(30) NOT NULL,
    full_name VARCHAR2(100),
    created_at DATE DEFAULT SYSDATE
);

CREATE TABLE patients(
    patient_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50),
    age NUMBER(3),
    gender VARCHAR2(10),
    contact_number VARCHAR2(15),
    address VARCHAR2(200),
    status VARCHAR2(20),
    created_at DATE DEFAULT SYSDATE
);

CREATE TABLE doctors(
    doctor_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50),
    specialization VARCHAR2(100),
    phone_number VARCHAR2(15),
    email VARCHAR2(100),
    created_at DATE DEFAULT SYSDATE
);

CREATE TABLE appointments(
    appointment_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id NUMBER NOT NULL,
    doctor_id NUMBER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR2(10) NOT NULL,
    appointment_type VARCHAR2(30),
    status VARCHAR2(20),

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id),

    CONSTRAINT fk_appointment_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(doctor_id)
);