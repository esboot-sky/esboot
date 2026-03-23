import { Card, Divider, Tag, Typography } from 'antd';
import { Outlet } from 'react-router';

const { Title, Paragraph, Text } = Typography;

function App() {
  const features = [
    {
      id: 'fast',
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Powered by Vite for instant dev server startup and lightning-fast HMR',
    },
    {
      id: 'react',
      icon: '⚛️',
      title: 'Modern React',
      description: 'Built on React 19 with latest features and best practices',
    },
    {
      id: 'typescript',
      icon: '📘',
      title: 'TypeScript First',
      description: 'Full TypeScript support with excellent type inference',
    },
    {
      id: 'tooling',
      icon: '🛠️',
      title: 'Built-in Tooling',
      description: 'ESLint, Stylelint, Prettier, and Commitlint pre-configured',
    },
    {
      id: 'i18n',
      icon: '🌍',
      title: 'Multi-language',
      description: 'Internationalization ready with react-intl integration',
    },
    {
      id: 'production',
      icon: '🚀',
      title: 'Production Ready',
      description: 'Optimized build with code splitting and tree shaking',
    },
  ];

  const techStack = [
    { id: 'react', name: 'React', version: '19.2' },
    { id: 'vite', name: 'Vite', version: '7.x' },
    { id: 'antd', name: 'Ant Design', version: '6.1' },
    { id: 'query', name: 'TanStack Query', version: '5.90' },
    { id: 'zustand', name: 'Zustand', version: '5.0' },
    { id: 'router', name: 'React Router', version: '7.11' },
  ];

  return (
    <div className="from-blue-50 via-purple-50 to-pink-50 min-h-screen bg-gradient-to-br">
      <div
        className={`
          max-w-7xl px-4 py-12
          sm:px-6
          lg:px-8
          mx-auto
        `}
      >
        <div className="mb-16 text-center">
          <div className="mb-4">
            <Tag color="blue" className="text-base px-4 py-1">
              <a href="http://esboot.dzfe.net" target="_blank" rel="noopener noreferrer">v4.0.3</a>
            </Tag>
          </div>
          <Title
            level={1}
            className={`
              text-6xl font-bold mb-4 from-blue-600 via-purple-600 to-pink-600 bg-gradient-to-r
              bg-clip-text text-transparent
            `}
          >
            ESBoot Framework
          </Title>
          <Title level={2} className="text-3xl text-gray-700 font-normal mb-6">
            Modern React Development Platform
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build lightning-fast web applications with enterprise-grade tooling and modern development experience
          </Paragraph>
        </div>

        <div className="mb-16">
          <Title level={3} className="text-2xl mb-8 text-center">
            Key Features
          </Title>
          <div
            className={`
              md:grid-cols-2
              lg:grid-cols-3
              gap-6 grid grid-cols-1
            `}
          >
            {features.map(feature => (
              <Card
                key={feature.id}
                hoverable
                className={`
                  hover:shadow-xl hover:-translate-y-1
                  transition-all duration-300
                `}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <Title level={4} className="mb-2">
                    {feature.title}
                  </Title>
                  <Text type="secondary">{feature.description}</Text>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <Title level={3} className="text-2xl mb-8 text-center">
            Tech Stack
          </Title>
          <div className="gap-3 flex flex-wrap justify-center">
            {techStack.map(tech => (
              <Tag key={tech.id} color="purple" className="text-base px-4 py-2 m-0">
                {tech.name}
                {' '}
                {tech.version}
              </Tag>
            ))}
          </div>
        </div>

        <Divider />

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
