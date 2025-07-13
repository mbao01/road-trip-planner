import type { Metadata, ResolvingMetadata } from "next";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenerateMetadata = (args: any, parent: ResolvingMetadata) => Promise<Metadata>;
