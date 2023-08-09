# EventHive

A Platform that enables hosting of various hackthons.

## Before using

- Please make sure that you have:
 - Node.js installed (https://nodejs.org/)
 - Python3 installed (https://www.python.org/downloads/)
 - Setup Environment variables
   - ## Frontend
      - ```bash
         NEXT_PUBLIC_BACKEND_URL=<your_backend_server_url>
      ```
      - For local environment use:
      ```bash
         NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
      ```
   - ## Backend
      - ```bash
         POSTGRES_URL=''
         PGNAME=''
         PGUSER=''
         POSTGRES_PASSWORD=''
         PGHOST=''
         PGPORT=''
         CLOUDINARY_CLOUD_NAME=''
         CLOUDINARY_API_KEY=''
         CLOUDINARY_API_SECRET=''      
      ```
   - For backend production, you can create account on Railway for postgres server and 
   on Cloudinary for django media storage and modify the .env variables.


## Usage

To run the project, please use the following commands:
 - `npm run dev`
    - Run this command in **_frontend_** directory and it will run the localhost server at port 3000.
    - Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
 - `python manage.py migrate`
 - `python manage.py runserver`
    - Run this command in **_backend_** directory and it will run the localhost server at port 8000.
    - send your requests to [http://localhost:8000](http://localhost:8000) to see the result.

Created By- _Kashish goyal_
