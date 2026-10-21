import React from "react";
import Input from "./Input";
import Button from "./Button";
import { classNames, prependOption } from "../../utils";

const Filter = ({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  values = {},
  onFilterChange,
  onReset,
  className = "",
  searchInputProps = {},
  filterInputProps = {},
  resetLabel = "Reset",
  ...props
}) => {
  return (
    <div className={classNames("ui-filter", className)} {...props}>
      <div className="ui-filter-search">
        <Input
          aria-label="Search"
          placeholder={searchPlaceholder}
          value={search ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          {...searchInputProps}
        />
      </div>
      {filters.map((filter) => (
        <div className="ui-filter-select" key={filter.name}>
          <Input
            aria-label={filter.label}
            as="select"
            name={filter.name}
            value={values[filter.name] ?? ""}
            onChange={(e) => onFilterChange?.(filter.name, e.target.value)}
            {...filterInputProps[filter.name]}
            options={prependOption(filter.options, {
              value: "",
              label: filter.placeholder || `All ${filter.label}`,
            })}
          />
        </div>
      ))}
      {onReset && (
        <Button variant="ghost" onClick={onReset}>
          {resetLabel}
        </Button>
      )}
    </div>
  );
};

export default Filter;
