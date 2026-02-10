export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">🚫 Access denied</h1>
      <p className="text-muted-foreground">
        You do not have permission to access this page.
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
