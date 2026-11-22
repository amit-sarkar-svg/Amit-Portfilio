const Eyebrow = ({ children }) => (
  <span className="eyebrow">
    <span className="size-1 rounded-full bg-neutral-500" aria-hidden="true" />
    {children}
  </span>
);
export default Eyebrow;
