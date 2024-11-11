import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const { data: statsData, error: statsError } = useWidgetAPI(widget, "device");

  if (statsError) {
    return <Container service={service} error={statsError} />;
  }

  if (!statsData) {
    return (
      <Container service={service}>
        <Block label="headscale.address" />
        <Block label="headscale.last_seen" />
        <Block label="headscale.expires" />
      </Container>
    );
  }

  const now = new Date();
  const compareDifferenceInTwoDates = (priorDate, futureDate) => {
    const diff = futureDate.getTime() - priorDate.getTime();
    const diffInYears = Math.ceil(diff / (1000 * 60 * 60 * 24 * 365));
    if (diffInYears > 1) return t("headscale.years", { number: diffInYears });
    const diffInWeeks = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
    if (diffInWeeks > 1) return t("headscale.weeks", { number: diffInWeeks });
    const diffInDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (diffInDays > 1) return t("headscale.days", { number: diffInDays });
    const diffInHours = Math.ceil(diff / (1000 * 60 * 60));
    if (diffInHours > 1) return t("headscale.hours", { number: diffInHours });
    const diffInMinutes = Math.ceil(diff / (1000 * 60));
    if (diffInMinutes > 1) return t("headscale.minutes", { number: diffInMinutes });
    const diffInSeconds = Math.ceil(diff / 1000);
    if (diffInSeconds > 10) return t("headscale.seconds", { number: diffInSeconds });
    return "Now";
  };

  const getLastSeen = () => {
    const date = new Date(statsData.node.lastSeen);
    const diff = compareDifferenceInTwoDates(date, now);
    return diff === "Now" ? t("headscale.now") : t("headscale.ago", { value: diff });
  };

  const getExpiry = () => {
    if (statsData.node.expiry === "0001-01-01T00:00:00Z") return t("headscale.never");
    const date = new Date(statsData.node.expiry);
    return compareDifferenceInTwoDates(now, date);
  };
  const isOnline = statsData.node.online ? t("headscale.online") : t("headscale.offline");

  return (
    <Container service={service}>
      <Block label="headscale.address" value={statsData.node.ipAddresses[0]} />
      <Block label="headscale.last_seen" value={getLastSeen()} />
      <Block label="headscale.expires" value={getExpiry()} />
      <Block label="headscale.online" value={isOnline} />
    </Container>
  );
}
