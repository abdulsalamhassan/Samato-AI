export function SMSPreview() {
  return (
    <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
        SMS Preview
      </p>
      <h2 className="mt-2 text-2xl font-semibold">Somali-language alert</h2>
      <div className="mt-6 mx-auto max-w-sm rounded-[2rem] border-8 border-[#12343b] bg-[#efe3c5] p-5 shadow-inner">
        <div className="rounded-[1.2rem] bg-white p-4 text-sm leading-7 text-[#12343b]">
          Walaal, biyuhu waa dhamaaday. Fadlan u tag Ceel Dheer, 23km waqooyi,
          si aad u hesho caawimad. Degdeg.
        </div>
      </div>
    </section>
  );
}
