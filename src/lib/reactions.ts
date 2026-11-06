export type ReactionSet = "classic" | "hype" | "travel" | "calm";
export const REACTION_SETS: Record<ReactionSet, string[]> = {
  classic: ["🔥", "😮", "😂", "👏", "😭"],
  hype: ["🚀", "💯", "⚡", "🤯", "🏆"],
  travel: ["🌍", "🗺️", "✈️", "📍", "🧭"],
  calm: ["👍", "🙂", "🤔", "😅", "🙏"],
};
export const REACTION_SET_IDS = Object.keys(REACTION_SETS) as ReactionSet[];
