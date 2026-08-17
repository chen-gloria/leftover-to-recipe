import Icon from './Icon.jsx';

export default function FlashMessage({ type = 'danger', message, onDismiss }) {
  if (!message) return null;

  return (
    <div className={`flash flash-${type}`} role="alert">
      {type === 'success' && <Icon name="checkCircle" size={18} />}
      <span>{message}</span>
      {onDismiss && (
        <button type="button" className="flash-dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}
