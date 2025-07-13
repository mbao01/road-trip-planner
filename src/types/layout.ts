export type LayoutProps<RouteParams = never, ParallelRoutes extends string = string> = Readonly<
  {
    children: React.ReactNode;
    params: RouteParams;
  } & Partial<{
    [K in ParallelRoutes]: React.ReactNode;
  }>
> &
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any;
