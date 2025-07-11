export type LayoutProps<RouteParams = never, ParallelRoutes extends string = string> = Readonly<
  {
    children: React.ReactNode;
    params: RouteParams;
  } & Partial<{
    [K in ParallelRoutes]: React.ReactNode;
  }>
> &
  any;
