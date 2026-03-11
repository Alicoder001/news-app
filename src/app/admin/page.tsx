export default function AdminOverviewPage() {
  return (
    <main>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Admin Overview</h1>
      <p style={{ lineHeight: 1.6, maxWidth: 720 }}>
        This local admin surface will monitor pipeline runs, source ingestion,
        verification flow, and publishing status.
      </p>
    </main>
  );
}
