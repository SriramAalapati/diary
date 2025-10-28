import React, { useState } from "react";
import { motion } from "framer-motion";

const UnderConstruction = ({
  repoUrl = "https://github.com/SriramAalapati/diary",
  contributeUrl = "https://github.com/SriramAalapati/diary/issues",
  contactEmail = "mailto:sriram.aalapati@sasi.ac.in?subject=Interested%20in%20Contributing",
}) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) {
      return setError("Please enter a valid email address.");
    }
    // Replace this with an API call if you want to store subscriptions
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-white p-6">
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-3xl w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-xl p-8 lg:p-12"
        aria-labelledby="under-construction-heading"
        role="region"
      >
        {/* HEADER */}
        <header className="flex items-start gap-5 border-b border-gray-100 pb-6 mb-6">
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-indigo-200 to-indigo-400 text-white rounded-2xl shadow-md">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v6" />
              <path d="M5 8v6a7 7 0 007 7v-3" />
              <path d="M19 12v-2" />
            </svg>
          </div>
          <div>
            <h1
              id="under-construction-heading"
              className="text-3xl font-bold text-gray-900 tracking-tight"
            >
              This Page Is Under Construction 🚧
            </h1>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed max-w-xl">
              We’re crafting something new and powerful for developers. Expect better UX, 
              cleaner code, and faster performance — all coming soon.  
              Want to get involved or stay updated?
            </p>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="grid gap-8 lg:grid-cols-2">
          {/* LEFT: CONTRIBUTION SECTION */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800">
              🚀 How You Can Contribute
            </h2>
            <ul className="mt-3 text-sm text-gray-600 space-y-3">
              <li>
                ⭐ <strong>Star the repo</strong> on GitHub to show your support and help others
                discover the project.
              </li>
              <li>
                🛠️ <strong>Contribute</strong> — open issues, suggest features, or submit pull
                requests. Every contribution helps!
              </li>
              <li>
                💬 <strong>Share feedback</strong> — have an idea? Reach out or create a discussion.
              </li>
            </ul>

            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-800 text-sm font-medium bg-white hover:bg-gray-50 hover:shadow transition"
                aria-label="Visit GitHub repository"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5a12 12 0 00-3.79 23.38c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.54-1.36-1.33-1.73-1.33-1.73-1.09-.75.08-.73.08-.73 1.2.08 1.83 1.25 1.83 1.25 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.91 0-1.3.47-2.36 1.24-3.19-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.22a11.42 11.42 0 016 0c2.29-1.54 3.3-1.22 3.3-1.22.66 1.66.24 2.88.12 3.18.77.83 1.24 1.89 1.24 3.19 0 4.59-2.8 5.6-5.47 5.9.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.57A12 12 0 0012 .5z" />
                </svg>
                Star on GitHub
              </a>
              <a
                href={contributeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 hover:shadow-md transition"
                aria-label="Contribute to repository"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Contribute
              </a>
            </div>
          </section>

          {/* RIGHT: SUBSCRIBE SECTION */}
          <aside className="bg-gray-50 border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="text-md font-semibold text-gray-800">
              Stay in the Loop 📬
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Subscribe to get notified once this page is live — no spam, just updates.
            </p>

            <form className="mt-4 flex gap-2" onSubmit={handleSubscribe}>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none transition"
                aria-invalid={error ? "true" : "false"}
              />
              <button
                type="submit"
                className={`px-2 py-2 rounded-lg text-xs font-medium text-white transition ${
                  subscribed
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {subscribed ? "Subscribed" : "Notify me"}
              </button>
            </form>

            {error && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            {subscribed && (
              <p className="mt-2 text-sm text-green-600">
                Thanks — we’ll email you when it’s ready!
              </p>
            )}

            <div className="mt-4 border-t border-gray-100 pt-3 text-sm text-gray-600">
              Prefer to chat directly?{" "}
              <a
                href={contactEmail}
                className="text-indigo-600 hover:underline font-medium"
              >
                Email us
              </a>
              .
            </div>
          </aside>
        </main>

        {/* FOOTER */}
        <footer className="mt-10 text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
          <p>
            Built with ❤️ by developers, for developers.  
            Contributions and ideas are always welcome.
          </p>
        </footer>
      </motion.section>
    </div>
  );
};

export default UnderConstruction;
