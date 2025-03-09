# Markdown Editor with Next.js

A modern markdown editor built with Next.js that supports syntax highlighting and local storage persistence. The application allows you to create, edit, and manage multiple articles with a clean and intuitive interface.

## Features

- Create and manage multiple articles
- Real-time markdown preview
- Syntax highlighting for code blocks using Prism.js
- Local storage persistence for article content
- Clean and modern UI with Tailwind CSS
- Responsive sidebar navigation
- Dark theme support for code blocks (Tomorrow Night theme)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/page.tsx` - Main editor component with markdown preview
- `app/components/` - React components
  - `TodoList.tsx` - Article list management
  - `Todo.tsx` - Individual article component
  - `Sidebar.tsx` - Navigation sidebar
- `app/types/` - TypeScript type definitions

## Technologies Used

- [Next.js](https://nextjs.org) - React framework
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering
- [Prism.js](https://prismjs.com) - Syntax highlighting
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org) - Type safety

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
