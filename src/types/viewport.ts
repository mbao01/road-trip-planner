import type { ResolvingViewport, Viewport } from "next";

export type ViewportArgs<T = never, G = never> = Readonly<{
  params: T;
  searchParams?: G;
}>;

export type GenerateViewport<T = never, G = never> = (
  { params, searchParams }: ViewportArgs<T, G>,
  parent: ResolvingViewport
) => Promise<Viewport>;
