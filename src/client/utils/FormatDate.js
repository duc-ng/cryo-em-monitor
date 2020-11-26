import { formatRelative } from "date-fns";
import { enGB } from "date-fns/locale";

const formatRelativeLocale = {
  lastWeek: "'Last' eeee 'at' pp",
  yesterday: "'Yesterday at' pp",
  today: "'Today at' pp",
  tomorrow: "'Tomorrow at' pp",
  nextWeek: "eeee 'at' pp",
  other: "PPpp",
};

const locale = {
  ...enGB,
  formatRelative: (token) => formatRelativeLocale[token],
};

export default function FormatDate(date) {
  return formatRelative(date, new Date(), { locale });
}
