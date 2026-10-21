import { classNames } from "../../utils";

const Card = ({
  title,
  subtitle,
  action,
  children,
  footer,
  className = "",
  padding = "md",
  as: Component = "section",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  ...props
}) => {
  return (
    <Component
      className={classNames("ui-card", `ui-card--${padding}`, className)}
      {...props}
    >
      {(title || subtitle || action) && (
        <header className={classNames("ui-card-header", headerClassName)}>
          <div>
            {title && <h2 className="ui-card-title">{title}</h2>}
            {subtitle && <p className="ui-card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="ui-card-action">{action}</div>}
        </header>
      )}
      <div className={classNames("ui-card-body", bodyClassName)}>
        {children}
      </div>
      {footer && (
        <footer className={classNames("ui-card-footer", footerClassName)}>
          {footer}
        </footer>
      )}
    </Component>
  );
};

export default Card;
