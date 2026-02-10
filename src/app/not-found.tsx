export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-semibold">404 — Page not found</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <a
        href="/home"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Back to Home
      </a>
    </div>
  );
}
