function Notification({ notice, onClose }) {
  if (!notice) return null;

  return (
    <div className={`notice ${notice.type}`} role="alert">
      <span>{notice.message}</span>
      <button type="button" onClick={onClose} aria-label="Đóng thông báo">
        x
      </button>
    </div>
  );
}

export default Notification;
