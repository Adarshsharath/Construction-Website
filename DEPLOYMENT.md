# Deployment Guide: Vercel + Render + MongoDB Atlas

This guide explains how to deploy the modern Construction Company Website in a production cloud environment.

---

## Part 1: Database Setup (MongoDB Atlas)

MongoDB Atlas is a cloud database service. We will host the production database here.

1. **Sign Up / Log In**:
   - Visit [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. **Create a Free Cluster**:
   - Create a new project.
   - Choose the **M0 Shared Free Tier** cluster.
   - Choose a cloud provider (e.g., AWS) and region nearest to your target audience.
3. **Database Security (Network Access & DB Users)**:
   - Go to **Database Access** under Security:
     - Add a new database user.
     - Select password authentication. Set a secure username (e.g., `db_admin`) and a strong password.
     - Under Database User Privileges, select **Read and write to any database**.
   - Go to **Network Access** under Security:
     - Click **Add IP Address**.
     - Select **Allow Access from Anywhere (0.0.0.0/0)** so the Render server can connect to the database. Click **Confirm**.
4. **Get Connection String**:
   - Navigate to the **Database** cluster view.
   - Click **Connect** on your cluster.
   - Choose **Drivers** under Connect to your application.
   - Copy the connection string. It will look like this:
     ```text
     mongodb+srv://db_admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
     ```
   - Keep this connection string ready. You will replace `<password>` with your database user password, and add a database name (e.g., `construction_db`) after the `/` slash if needed.

---

## Part 2: Backend Setup (Render.com)

Render hosts backends and serves them. We will deploy the Flask API here.

1. **Sign Up / Log In**:
   - Go to [render.com](https://render.com) and create an account (linking your GitHub account is recommended).
2. **Create a Web Service**:
   - Click **New +** and select **Web Service**.
   - Connect your GitHub repository containing the website project.
3. **Configure Build Settings**:
   - **Name**: `novabuild-backend`
   - **Region**: Same region as your MongoDB Atlas cluster.
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT --chdir backend app:app`
     *(This runs the WSGI server using the global `app` exposed in `backend/app.py`)*
4. **Configure Environment Variables**:
   - Click the **Advanced** tab and add the following Environment Variables:
     - `MONGO_URI`: The MongoDB Atlas connection string from Part 1 (with `<password>` replaced and database specified, e.g. `...mongodb.net/construction_db?retryWrites=...`).
     - `JWT_SECRET_KEY`: A long, unique, secure random string.
     - `ADMIN_USERNAME`: Define the admin portal login username (e.g., `admin`).
     - `ADMIN_PASSWORD`: Define the admin portal login password (e.g., `securePassword123`).
   - Click **Create Web Service**.
5. **Verify Backend**:
   - Once deployment completes, copy your Render Service URL (e.g., `https://novabuild-backend.onrender.com`).
   - Append `/health` to it (e.g., `https://novabuild-backend.onrender.com/health`) and verify it responds with status `healthy`.

---

## Part 3: Frontend Setup (Vercel)

Vercel hosts static pages and SPAs. We will deploy the React + Vite frontend here.

1. **Vercel rewrite configuration**:
   - Open [frontend/vercel.json](file:///d:/Construction%20website/frontend/vercel.json) in your repository.
   - Replace the `destination` URLs with your actual Render backend URL:
     ```json
     {
       "rewrites": [
         {
           "source": "/api/:path*",
           "destination": "https://novabuild-backend.onrender.com/api/:path*"
         },
         {
           "source": "/uploads/:path*",
           "destination": "https://novabuild-backend.onrender.com/uploads/:path*"
         },
         {
           "source": "/(.*)",
           "destination": "/index.html"
         }
       ]
     }
     ```
     *(This ensures the production frontend redirects requests correctly to your Render API server without CORS issues)*
2. **Deploy on Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **Add New** -> **Project**.
   - Import your GitHub repository.
   - Under **Project Settings**:
     - **Root Directory**: Edit and select the `frontend` folder.
     - **Build and Development Settings**:
       - Build Command: `npm run build`
       - Output Directory: `dist`
       - Install Command: `npm install`
   - Click **Deploy**.
3. **Verify App**:
   - Once deployed, Vercel will generate a public URL (e.g., `https://novabuild-group.vercel.app`).
   - Open the URL in your browser, check the works and contact pages, and go to `/admin` to log in using the `ADMIN_USERNAME` and `ADMIN_PASSWORD` you set on Render!
