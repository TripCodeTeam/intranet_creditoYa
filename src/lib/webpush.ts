import webpush from "web-push";

const { NEXT_PUBLIC_VAPID_KEY, NEXT_PUBLIC_PRIVATE_VAPID_KEY } = process.env;

webpush.setVapidDetails(
  "mailto:test@tripcode.dev",
  NEXT_PUBLIC_VAPID_KEY as string,
  NEXT_PUBLIC_PRIVATE_VAPID_KEY as string
);

export default webpush;
