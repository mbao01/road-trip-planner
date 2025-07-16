export type PageProps<T = never, G = never> = Readonly<{
  params: Promise<T>;
  searchParams?: G;
}>;
