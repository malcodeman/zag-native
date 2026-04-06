interface OpenChangeDetails {
  open: boolean;
}

export interface PopoverProps {
  closeOnEscape?: boolean;
  onOpenChange?: ((details: OpenChangeDetails) => void) | undefined;
  trigger: React.ReactNode;
  children: React.ReactNode;
}
