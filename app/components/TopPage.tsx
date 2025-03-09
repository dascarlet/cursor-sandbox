'use client';

import { FaMarkdown, FaClock, FaMoon, FaSort, FaEdit } from 'react-icons/fa';

export default function TopPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Markdown Editor</h1>
        <p className="text-xl text-gray-600">A modern, feature-rich markdown editor for your writing needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          icon={<FaMarkdown className="w-8 h-8" />}
          title="Real-time Markdown Preview"
          description="See your markdown rendered in real-time as you type with syntax highlighting"
        />
        <FeatureCard
          icon={<FaClock className="w-8 h-8" />}
          title="JST Timestamp"
          description="Automatic JST timestamp tracking for all your articles"
        />
        <FeatureCard
          icon={<FaMoon className="w-8 h-8" />}
          title="Dark Mode Support"
          description="Comfortable writing experience in both light and dark modes"
        />
        <FeatureCard
          icon={<FaSort className="w-8 h-8" />}
          title="Flexible Organization"
          description="Sort and organize your articles by creation time"
        />
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Click on "Articles" in the sidebar to view your articles</li>
          <li>Create a new article using the "Add Article" button</li>
          <li>Write your content using markdown syntax</li>
          <li>Use the preview pane to see the rendered output</li>
          <li>Your content is automatically saved as you type</li>
        </ol>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="text-blue-500">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
} 