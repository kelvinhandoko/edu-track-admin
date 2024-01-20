import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { NumericFormat } from "react-number-format";
import CourseRowActions from "./RowAction";
const columnHelpers = createColumnHelper<Course>();
const courseColumns = [
  columnHelpers.accessor("createdAt", {
    header: "date",
    cell: (info) => format(info.getValue(), "dd/MM/yyyy"),
  }),
  columnHelpers.accessor("name", {
    cell: (info) => info.getValue(),
  }),
  columnHelpers.accessor("price", {
    cell: (info) => (
      <NumericFormat
        displayType="text"
        value={info.getValue()}
        thousandSeparator="."
        decimalSeparator=","
        prefix="Rp. "
      />
    ),
  }),
  columnHelpers.display({
    id: "actions",
    cell: (info) => <CourseRowActions id={info.row.original.id} />,
  }),
] as ColumnDef<Course>[];

export default courseColumns;
