export type ModelId = "nirpesh" | "nirpesh-g" | "nirpesh-d";

export const MODELS: { id: ModelId; label: string; sub: string; gradient: string }[] = [
  { id: "nirpesh",   label: "Nirpesh",   sub: "Mistral Large · balanced",  gradient: "from-violet-500 to-pink-500" },
  { id: "nirpesh-g", label: "Nirpesh G", sub: "Gemini · faster, sharper",  gradient: "from-sky-500 to-emerald-500" },
  { id: "nirpesh-d", label: "Nirpesh D", sub: "DeepSeek · deep reasoning", gradient: "from-amber-500 to-orange-600" },
];

const KEY = "nirpesh.model.v1";

export function loadModel(): ModelId {
  if (typeof window === "undefined") return "nirpesh";
  return (localStorage.getItem(KEY) as ModelId) || "nirpesh";
}
export function saveModel(m: ModelId) {
  localStorage.setItem(KEY, m);
}
