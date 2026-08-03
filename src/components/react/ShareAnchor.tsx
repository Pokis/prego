type ShareAnchorProps = {
  targetId: string;
  label: string;
  compact?: boolean;
};

export default function ShareAnchor({
  targetId,
  label,
  compact = false,
}: ShareAnchorProps) {
  return (
    <a
      className={`share-anchor${compact ? " compact" : ""}`}
      href={`#${targetId}`}
      data-share-anchor={targetId}
      data-share-label={label}
      aria-label={`Copy link to ${label}`}
      title={`Copy link to ${label}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M10.6 13.4a4.5 4.5 0 0 0 6.4 0l2.1-2.1a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2" />
        <path d="M13.4 10.6a4.5 4.5 0 0 0-6.4 0l-2.1 2.1a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" />
      </svg>
      <span className={`share-anchor-copy${compact ? " visually-hidden" : ""}`}>
        Copy link
      </span>
    </a>
  );
}
