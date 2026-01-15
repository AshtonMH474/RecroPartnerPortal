# My App

A [Next.js](https://nextjs.org/) + [TinaCMS](https://tina.io/) project with MongoDB, authentication, and TailwindCSS.

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have these installed on your system:
- **Node.js** v22 or higher → [download here](https://nodejs.org/)
- **npm** (comes with Node)  
- **Git** (to clone the repo and work with TinaCMS)  


---

### 2. Install Dependencies

Run the following command in the root(my-app) of the project to install all required packages:

```bash
npm install
```
---
## 3. Fill Out a `.env` File

Create a `.env` file in the root of the project.

You can use the provided `.env.example` as a template — copy all of the variables listed there into your new `.env` file and fill them out with the correct values for your environment.

---
## 4. Running the Server

Use the following commands depending on what you need:

- **Development server (Next.JS + TinaCMS)**  
  ```bash
  npm run dev
  ```
- **Production server (Next.JS + TinaCMS)**
    ```bash
    npm run production
    ```
- **Build server (Next.JS + TinaCMS)**
    ```bash
    npm run build
    ```
---
## 5. Playwright Test

Create a `.env` file in the root of the Playwright directory.

You can use the provided `.env.example` as a template — copy all of the variables listed there into your new `.env` file and fill them out with the correct values for your environment.


Use the following command to run all test:

```bash
npm run test:e2e
```