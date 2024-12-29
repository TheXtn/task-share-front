# TaskShare Frontend

TaskShare is a collaborative task management application built with Next.js, React, and TypeScript. It allows users to create, manage, and share task lists with others.

## Technologies Used

- Next.js 13 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Context API for state management

## Getting Started

### Prerequisites

- Node.js 14.0 or later
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/Thextn/task-share-front.git
   cd taskshare-frontend
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

### Running the Development Server

```
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Contains the Next.js 13 App Router pages and layouts
- `components/`: Reusable React components
- `contexts/`: React Context providers
- `services/`: API service functions
- `types/`: TypeScript type definitions
- `styles/`: Global styles and Tailwind CSS configuration

## Features

- User authentication (register, login, logout)
- Create and manage task lists
- Add, edit, and delete tasks within lists
- Share task lists with other users
- Responsive design for mobile and desktop
- Dark mode support

## Deployment
