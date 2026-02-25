# Autoflex Inventory Management System

## 📌 Overview

This project was developed as part of the Autoflex technical challenge.

The system manages products and their required raw materials, allowing:

-   CRUD operations for Products
-   CRUD operations for Raw Materials
-   Association between Products and Raw Materials
-   Calculation of producible products based on available stock
-   Prioritization of production by highest product value
-   Calculation of total production value

The application follows a clean architecture approach, separating
back-end and front-end as required.

------------------------------------------------------------------------

## 🏗 Architecture

Frontend (React + Redux + TypeScript)\
⬇\
Backend (Spring Boot REST API)\
⬇\
PostgreSQL Database

------------------------------------------------------------------------

## 🖥 Frontend

**Tech Stack**

-   React
-   TypeScript
-   Redux Toolkit
-   React Router
-   Axios
-   Bootstrap 5

Run frontend:

cd web-app-autoflex\
npm install\
npm run dev

Default URL: http://localhost:5173

------------------------------------------------------------------------

## ⚙ Backend

**Tech Stack**

-   Spring Boot
-   JPA / Hibernate
-   PostgreSQL
-   MapStruct
-   Maven

Run backend:

mvn spring-boot:run

Default API URL: http://localhost:8080/api

------------------------------------------------------------------------

## 🗄 Database

Database: PostgreSQL

Tables:

-   products
-   raw_materials
-   product_raw_materials

All database structures, columns, and code are written in English
(RNF007 compliant).

------------------------------------------------------------------------

## 🧠 Business Rule -- Production Calculation

The system calculates which products can be produced based on available
raw materials.

Algorithm logic:

1.  Products are ordered by highest value.
2.  For each product:
    -   The system verifies available raw materials.
    -   Calculates maximum producible quantity.
3.  Raw materials stock is reduced virtually during simulation.
4.  The system returns:
    -   Product name
    -   Producible quantity
    -   Total production value

This ensures prioritization of higher-value products when raw materials
are shared.

------------------------------------------------------------------------

## 🔍 API Endpoints (Main)

### Products

-   GET /api/products
-   POST /api/products
-   PUT /api/products/{id}
-   DELETE /api/products/{id}

### Raw Materials

-   GET /api/raw-materials
-   POST /api/raw-materials
-   PUT /api/raw-materials/{id}
-   DELETE /api/raw-materials/{id}

### Product Composition

-   POST /api/product-raw-materials
-   GET /api/product-raw-materials/product/{productId}
-   DELETE /api/product-raw-materials/{id}

### Production Simulation

-   GET /api/production

------------------------------------------------------------------------

## 📋 Requirements Compliance

✔ RNF001 -- Web platform\
✔ RNF002 -- API architecture\
✔ RNF003 -- Responsive frontend\
✔ RNF004 -- PostgreSQL database\
✔ RNF005 -- Spring Boot backend\
✔ RNF006 -- React + Redux frontend\
✔ RNF007 -- English code and database naming

✔ RF001 -- Product CRUD\
✔ RF002 -- Raw Material CRUD\
✔ RF003 -- Association CRUD\
✔ RF004 -- Production calculation\
✔ RF005 -- Product UI\
✔ RF006 -- Raw Material UI\
✔ RF007 -- Composition UI\
✔ RF008 -- Production UI

------------------------------------------------------------------------

## 🚀 Possible Improvements

-   Unit tests (backend and frontend)
-   Integration tests (Cypress)
-   Docker containerization
-   CI/CD pipeline
-   Production deployment

------------------------------------------------------------------------

## 👤 Author

Developed for Paulo Vargas.
