
  export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-20 text-center bg-gray-50">
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
        Shorten, Customize, and Track <span className="block text-teal-600">Your Links Effortlessly</span>
      </h1>
      <p className="mb-6 max-w-md text-lg text-gray-600">
        Simplify your online presence with our powerful URL shortener. Create custom links, track performance, and boost
        your reach.
      </p>
     
      <ul className="flex flex-wrap justify-center gap-4 text-gray-700">
        <li className="px-4 py-2 bg-teal-100 rounded-full">Customizable Links</li>
        <li className="px-4 py-2 bg-green-100 rounded-full">Real-Time Analytics</li>
      </ul>
    </section>
  );
}