/**
 * User-facing skill catalog for `@game-gpt/von-skills`.
 * Teaches agents how to help end users author `.von` configuration and metadata documents.
 */

export type SkillDelivery = "docs-only" | "cli-stub" | "tool-live";

export type VonSkillMeta = {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly skillMd: string;
    readonly delivery: SkillDelivery;
};

export const VON_SKILLS: readonly VonSkillMeta[] = [
    {
        id: "von-language",
        name: "von-language",
        description:
            "Help the user write or review VON (.von) documents — configuration, metadata, and versioned data with comments and bare keys.",
        skillMd: "skills/von-language/SKILL.md",
        delivery: "docs-only",
    },
] as const;

export function listVonSkills(): readonly VonSkillMeta[] {
    return VON_SKILLS;
}

export function getVonSkill(id: string): VonSkillMeta | undefined {
    return VON_SKILLS.find((s) => s.id === id);
}
