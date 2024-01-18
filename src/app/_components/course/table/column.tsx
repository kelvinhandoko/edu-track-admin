import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { NumericFormat } from "react-number-format";
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
        value={info.getValue()}
        thousandSeparator="."
        decimalSeparator=","
        prefix="Rp. "
      />
    ),
  }),
] as ColumnDef<Course>[];

export default courseColumns;
