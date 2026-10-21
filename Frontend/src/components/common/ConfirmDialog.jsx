import Modal from "./Modal";
import Button from "./Button";

/**
 * Confirmation dialog built on Modal:
 *   <ConfirmDialog open onClose onConfirm title description confirmLabel tone />
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "تأكيد",
  tone = "primary",
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant="outline" onClick={onClose}>
          إلغاء
        </Button>
        <Button
          variant={tone === "danger" ? "danger" : "primary"}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-sm leading-relaxed text-ink/80">{description}</p>
  </Modal>
);

export default ConfirmDialog;
