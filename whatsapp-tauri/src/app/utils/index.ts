import dayjs from "dayjs";

export const formatTime = (timestamp: number | string) => {
  if (typeof timestamp === "string") {
    const parsed = dayjs(timestamp);
    return parsed.isValid() ? parsed.format("h:mm A") : timestamp;
  }
  return dayjs.unix(timestamp).format("h:mm A");
};

export const getTimestamp = () => {
  const date = new Date();
  const now = dayjs(date).unix();
  return now;
};

export const getDisplayNameFromJid = (jid: string) => {
  const [user] = jid.split("@");
  return user || jid || "Unknown chat";
};

type MentionableUser = {
  id: string;
  name?: string;
  phoneNumber?: string;
  phoneJid?: string;
  lidJid?: string;
};

export const getMentionNames = (users: MentionableUser[]) => Object.fromEntries(
  users.flatMap((user) => user.name
    ? [user.id, user.phoneNumber, user.phoneJid, user.lidJid]
        .filter((id): id is string => Boolean(id))
        .map((id) => [getDisplayNameFromJid(id), user.name!])
    : [])
);

export const getMentionParts = (text: string, names: Record<string, string>) =>
  text.split(/(@\+?\d+)/g).filter(Boolean).map((text) => {
    const id = text.match(/^@(\+?\d+)$/)?.[1];
    if (!id) return { text };
    const name = names[id] ?? names[id.replace(/^\+/, "")];
    return { text: name ? `@${name}` : text, id: id.replace(/^\+/, ""), name };
  });
