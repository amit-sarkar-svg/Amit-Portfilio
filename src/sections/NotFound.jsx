const NotFound = () => (
  <main id="main" className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
    <p className="font-mono caption-4 text-neutral-400">404</p>
    <h1 className="mt-4 heading-2 hero-gradient-text">This page does not exist</h1>
    <p className="mt-4 body-3 text-neutral-400">
      The link may be old or mistyped. Head back to the portfolio.
    </p>
    <a href="/" className="mt-8 btn-primary">Back to home</a>
  </main>
);

export default NotFound;
