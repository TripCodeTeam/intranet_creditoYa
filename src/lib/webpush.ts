import webpush from "web-push";

const { VAPID_KEY, PRIVATE_VAPID_KEY } = process.env;

webpush.setVapidDetails(
  "mailto:test@tripcode.dev",
  VAPID_KEY as string,
  PRIVATE_VAPID_KEY as string
);

export default webpush;
