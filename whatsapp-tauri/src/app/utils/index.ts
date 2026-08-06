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
  pushName?: string;
  phoneNumber?: string;
  phoneJid?: string;
  lidJid?: string;
};

export const getMentionNames = (users: MentionableUser[]) => Object.fromEntries(
  users.flatMap((user) => user.name || user.pushName
    ? [user.id, user.phoneNumber, user.phoneJid, user.lidJid]
        .filter((id): id is string => Boolean(id))
        .map((id) => [getDisplayNameFromJid(id), user.name || user.pushName!])
    : [])
);

const getMentionId = (jid: string) => getDisplayNameFromJid(jid).split(":")[0].replace(/^\+/, "");

export const getMentionAliases = (users: MentionableUser[]) => Object.fromEntries(
  users.flatMap((user) => {
    const aliases = [user.id, user.phoneNumber, user.phoneJid, user.lidJid]
      .filter((id): id is string => Boolean(id))
      .map(getMentionId);
    return aliases.map((id) => [id, aliases]);
  })
);

export const getSelfMentionIds = (
  aliases: Record<string, string[]>,
  currentUserId: string
) => Object.entries(aliases)
  .filter(([, userAliases]) => userAliases.includes(getMentionId(currentUserId)))
  .map(([id]) => id);

export const getMentionParts = (text: string, names: Record<string, string>) =>
  text.split(/(@\+?\d+)/g).filter(Boolean).map((text) => {
    const id = text.match(/^@(\+?\d+)$/)?.[1];
    if (!id) return { text };
    const name = names[id] ?? names[id.replace(/^\+/, "")];
    return { text: name ?? text.slice(1), id: id.replace(/^\+/, ""), name };
  });
