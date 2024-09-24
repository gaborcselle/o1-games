import Link from 'next/link';

const games = [
  { slug: 'space-encoders', name: 'Space Encoders' },
  { slug: 'codey-crush', name: 'Codey Crush' },
  { slug: 'ai-man', name: 'AI Man' },
  { slug: 'ai-steroids', name: 'Aisteroids' },
  { slug: 'among-code', name: 'Among Code' },
  { slug: 'code-break', name: 'Code Break' },
  { slug: 'code-lemmings', name: 'Code Lemmings' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          o1-games
        </h1>
        <p className="text-xl text-center text-gray-700 dark:text-gray-300 mb-8">
          A collection of classic games reimagined and written entirely by OpenAI's o1-preview model.
        </p>
        <div className="text-center mb-8">
          <a
            href="https://github.com/gaborcselle/o1-games"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View on GitHub: gaborcselle/o1-games
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/${game.slug}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {game.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}