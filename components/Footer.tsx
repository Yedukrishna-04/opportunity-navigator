export function Footer() {
  const name = process.env.NEXT_PUBLIC_OWNER_NAME ?? "Your Name";
  const github = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/your-profile";
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://linkedin.com/in/your-profile";

  return (
    <footer className="border-t border-ink/10 px-6 py-5 text-sm text-ink/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>Built for House of Edtech assignment by {name}</span>
        <div className="flex gap-4">
          <a className="hover:text-leaf" href={github} rel="noreferrer" target="_blank">
            GitHub
          </a>
          <a className="hover:text-leaf" href={linkedin} rel="noreferrer" target="_blank">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
