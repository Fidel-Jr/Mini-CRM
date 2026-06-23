export default function Forbidden() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="max-w-md text-center">
                <div className="mb-6 inline-flex h-25 w-20 py-5 items-center justify-center rounded-full bg-destructive/10">
                    <span className="text-4xl">🚫</span>
                </div>

                <h1 className="text-7xl font-bold tracking-tight">
                    403
                </h1>

                <h2 className="mt-4 text-2xl font-semibold">
                    Access Denied
                </h2>

                <p className="mt-3 text-muted-foreground">
                    You don't have permission to access this page.
                    If you believe this is a mistake, please contact your administrator.
                </p>

                <div className="mt-8 flex items-center justify-center gap-3">
                    <a
                        href="/dashboard"
                        className="inline-flex items-center rounded-lg bg-primary px-10 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        Back to Dashboard
                    </a>

                    <a
                        href="/"
                        className="inline-flex items-center rounded-lg border px-10 py-2.5 text-sm font-medium transition hover:bg-muted"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        </main>
    );
}