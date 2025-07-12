export type PageProps<T = never, G = never> = Readonly<{
  params: T;
  searchParams?: G;
}>;
