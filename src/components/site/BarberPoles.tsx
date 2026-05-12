export function BarberPoles() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-0 left-0 right-0 z-30 hidden md:block">
      <div className="barber-pole absolute left-0 top-0 h-full w-2" />
      <div className="barber-pole absolute right-0 top-0 h-full w-2" />
    </div>
  );
}
