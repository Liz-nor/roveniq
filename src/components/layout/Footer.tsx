export default function Footer() {
  return (
    <footer className="bg-muted-background p-4 text-center text-neutral-700 border-t">
      <div>
        <p>Follow us on social media:</p>
        <div className="flex justify-center gap-4 mt-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
      &copy; {new Date().getFullYear()} roveniq
      <span className="text-terracotta-500 text-3xl">.</span> All rights
      reserved.
    </footer>
  );
}
