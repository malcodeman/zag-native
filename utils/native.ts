export const nativeGetRootNode = (): Document =>
  ({ getElementById: (_id: string) => null }) as unknown as Document;
