# Mini CRM

> A Minimal CRM built with ASP.NET Core, PostgreSQL, Next.js, and AI-assisted knowledge workflow.

Mini CRM is a small Customer Relationship Management (CRM) application for managing customers, contacts, and opportunities, enhanced with an AI knowledge assistant powered by company documents and basic dashboard analytics. This is a personal project built to showcase full-stack development skills, including authentication, authorization, relational database design, RESTful API development, business workflow implementation, and Retrieval-Augmented Generation (RAG) using Large Language Models.

The interface is based on the next-shadcn-admin-dashboard template by arhamkhnz, customized and extended to support CRM workflows and AI features.

## Features

### CRM

- Customer Management
- Contact Management
- Opportunity Pipeline Tracking
- Activity Notes
- Dashboard Analytics
- Search & Filtering

### Authentication & Authorization

- ASP.NET Core Identity
- JWT Authentication
- Role-Based Access Control (RBAC)
- Admin & Sales Representative Roles

### AI Features & Workflow

- Knowledge Base Assistant (RAG)
- Document-Based Question Answering
  
1. Admin uploads company documents.
2. The backend extracts and chunks the document.
3. Embeddings are generated and stored.
4. A sales representative asks a question.
5. Relevant chunks are retrieved through vector search.
6. The retrieved context is sent to the LLM.
7. The AI returns an answer grounded in the uploaded documents.

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- ASP.NET Identity
- JWT Authentication

### Database
- PostgreSQL

### AI
- OpenRouter API
- Retrieval-Augmented Generation (RAG)
- Vector Embeddings

### Tools & Deployment
- Git
- Neon
- Vercel
- MonsterASP.NET

## Environment Variables

Backend

OpenRouter:KEY=your_openrouter_api_key

Jwt:Key=your_super_secret_jwt_key

ModelName=ai_model_name

Frontend

NEXT_PUBLIC_API_URL=http://localhost:5000/api

## Acknowledgements

The user interface is based on the
[next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard)
template by arhamkhnz, licensed under the MIT License.
The template has been customized and extended to support the CRM workflows and AI features implemented in this project.
