import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Order } from "@/data/types";

interface StatusBadgeProps {
  status: Order["status"];
}

const STATUS_STYLES: Record<Order["status"], string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  Shipped: "bg-purple-100 text-purple-800 border-purple-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLanguage();

  const labels: Record<Order["status"], string> = {
    Pending: t.status_pending,
    Confirmed: t.status_confirmed,
    Shipped: t.status_shipped,
    Delivered: t.status_delivered,
    Cancelled: t.status_cancelled,
  };

  return (
    <Badge variant="outline" className={STATUS_STYLES[status]}>
      {labels[status]}
    </Badge>
  );
}
