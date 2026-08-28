"use client";

import { useState } from "react";
import {
  BARBERS,
  SERVICES,
  TIME_SLOTS,
  findBarber,
  findService,
  formatTimeSlot,
} from "@/lib/booking-options";
import { submitBooking } from "@/lib/supabase/bookings";

type Step = "barber" | "cut" | "time" | "contact" | "confirm" | "done";

const STEP_ORDER: Step[] = ["barber", "cut", "time", "contact", "confirm"];

function todayISODate(): string {
  // Use local date parts, not toISOString() (which is UTC and can land on
  // the wrong day depending on the visitor's timezone and time of day).
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateStr: string): string {
  // Parse as local date, not UTC, so it doesn't shift a day off.
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const cardButtonClasses =
  "w-full rounded-lg border border-zinc-200 bg-white px-5 py-4 text-left transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:hover:bg-zinc-800";

export default function BookingFlow() {
  const [step, setStep] = useState<Step>("barber");
  const [barberId, setBarberId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<string>(todayISODate());
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const barber = barberId ? findBarber(barberId) : undefined;
  const service = serviceId ? findService(serviceId) : undefined;

  function goBack() {
    const index = STEP_ORDER.indexOf(step);
    if (index > 0) {
      setError(null);
      setStep(STEP_ORDER[index - 1]);
    }
  }

  function reset() {
    setStep("barber");
    setBarberId(null);
    setServiceId(null);
    setDate(todayISODate());
    setTime(null);
    setName("");
    setPhone("");
    setError(null);
  }

  async function handleConfirm() {
    if (!barberId || !serviceId || !time) return;
    setSubmitting(true);
    setError(null);
    const { error } = await submitBooking({
      barberId,
      serviceId,
      date,
      time,
      name: name.trim(),
      phone: phone.trim(),
    });
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    setStep("done");
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
      {step !== "barber" && step !== "done" && (
        <button
          type="button"
          onClick={goBack}
          className="mb-4 text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          &larr; Back
        </button>
      )}

      {step === "barber" && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Choose your barber
          </h2>
          {BARBERS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={cardButtonClasses}
              onClick={() => {
                setBarberId(b.id);
                setStep("cut");
              }}
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {b.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {step === "cut" && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Choose your cut
          </h2>
          {SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={cardButtonClasses}
              onClick={() => {
                setServiceId(s.id);
                setStep("time");
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {s.name}
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  ${s.price}
                </span>
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {s.durationMinutes} min
              </span>
            </button>
          ))}
        </div>
      )}

      {step === "time" && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Choose a date and time
          </h2>
          <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            Date
            <input
              type="date"
              value={date}
              min={todayISODate()}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Time (9am&ndash;5pm)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
                    time === slot
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                      : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-600"
                  }`}
                >
                  {formatTimeSlot(slot)}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            disabled={!date || !time}
            onClick={() => setStep("contact")}
            className="mt-2 rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Next
          </button>
        </div>
      )}

      {step === "contact" && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim() && phone.trim()) setStep("confirm");
          }}
        >
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Your details
          </h2>
          <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            Name
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              placeholder="Jane Smith"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            Phone
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              placeholder="(555) 123-4567"
            />
          </label>
          <button
            type="submit"
            disabled={!name.trim() || !phone.trim()}
            className="mt-2 rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Next
          </button>
        </form>
      )}

      {step === "confirm" && barber && service && time && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Confirm your booking
          </h2>
          <dl className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Barber</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {barber.name}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Service</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {service.name} &middot; ${service.price}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">When</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {formatDate(date)} at {formatTimeSlot(time)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Name</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {name}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Phone</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {phone}
              </dd>
            </div>
          </dl>
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              {error}
            </p>
          )}
          <button
            type="button"
            disabled={submitting}
            onClick={handleConfirm}
            className="rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {submitting ? "Booking..." : "Confirm booking"}
          </button>
        </div>
      )}

      {step === "done" && barber && service && time && (
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            You&apos;re booked!
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {service.name} with {barber.name} on {formatDate(date)} at{" "}
            {formatTimeSlot(time)}.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-zinc-200 px-5 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Book another appointment
          </button>
        </div>
      )}
    </div>
  );
}
