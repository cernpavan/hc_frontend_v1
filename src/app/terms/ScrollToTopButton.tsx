'use client';

export default function ScrollToTopButton() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className="btn-secondary"
    >
      Back to Top
    </button>
  );
}
