import type { Metadata, ResolvingMetadata } from "next";

export type GenerateMetadata = (args: any, parent: ResolvingMetadata) => Promise<Metadata>;
