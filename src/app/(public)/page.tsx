import BookingFlow from "@/components/BookingFlow";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-6 py-16 text-center dark:bg-black">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Campus Cuts
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Book your next cut in a few taps.
        </p>
      </div>
      <BookingFlow />
    </main>
  );
}
