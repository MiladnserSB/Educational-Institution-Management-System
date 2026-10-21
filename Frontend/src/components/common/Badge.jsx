import { classNames } from "../../utils";

const tones = {
  neutral: "bg-border/70 text-ink/70",
  blue: "bg-brand-blue/12 text-brand-blue",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  error: "bg-error-50 text-error-700",
  info: "bg-info-50 text-info-700",
  amber: "bg-brand-amber/15 text-[#a06a1f]",
  lavender: "bg-brand-lavender/15 text-[#8b4fb8]",
  ink: "bg-ink/10 text-ink",
};

/** Small pill badge with semantic tones. */
const Badge = ({ children, tone = "neutral", dot = false, className = "" }) => (
  <span
    className={classNames(
      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
      tones[tone] || tones.neutral,
      className,
    )}
  >
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
    {children}
  </span>
);

/* --------------------------- status helpers --------------------------- */

/** Approval state driven by the schema: isActive / deletedAt. */
export const approvalBadge = (record) => {
  if (record?.deletedAt) return <Badge tone="error" dot>مرفوض</Badge>;
  if (record?.isActive) return <Badge tone="success" dot>معتمد</Badge>;
  return <Badge tone="warning" dot>قيد المراجعة</Badge>;
};

export const accountStatusBadge = (isActive) =>
  isActive ? (
    <Badge tone="success" dot>نشط</Badge>
  ) : (
    <Badge tone="neutral" dot>معطّل</Badge>
  );

export const sessionStatusBadge = (status) => {
  if (status === "scheduled") return <Badge tone="info" dot>مجدول</Badge>;
  if (status === "done") return <Badge tone="success" dot>منتهية</Badge>;
  if (status === "cancelled") return <Badge tone="error" dot>ملغاة</Badge>;
  return <Badge>{status}</Badge>;
};

export const cohortStatusBadge = (status) => {
  if (status === "active") return <Badge tone="success" dot>نشطة</Badge>;
  if (status === "planned") return <Badge tone="info" dot>مخططة</Badge>;
  if (status === "completed") return <Badge tone="neutral" dot>منتهية</Badge>;
  if (status === "cancelled") return <Badge tone="error" dot>ملغاة</Badge>;
  return <Badge>{status}</Badge>;
};

export const attendanceBadge = (status) => {
  if (status === "present") return <Badge tone="success">حاضر</Badge>;
  if (status === "absent") return <Badge tone="error">غائب</Badge>;
  if (status === "late") return <Badge tone="warning">متأخر</Badge>;
  if (status === "excused") return <Badge tone="info">بعذر</Badge>;
  return <Badge>{status}</Badge>;
};

export const enrollmentStatusBadge = (status) => {
  if (status === "active") return <Badge tone="success">نشط</Badge>;
  if (status === "withdrawn") return <Badge tone="neutral">منسحب</Badge>;
  if (status === "completed") return <Badge tone="blue">منتهي</Badge>;
  return <Badge>{status}</Badge>;
};

export default Badge;
