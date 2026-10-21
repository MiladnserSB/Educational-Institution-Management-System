import { Inbox } from "lucide-react";
import { classNames } from "../../utils";

/** Centered empty-state placeholder, matching the prototype UX. */
const EmptyState = ({
  icon,
  title = "لا توجد بيانات",
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={classNames(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-canvas/50 px-4 py-12 text-center",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-border/50 text-muted">
        {icon || <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="mt-4 text-sm font-bold text-ink">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
