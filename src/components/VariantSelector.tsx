"use client";

import { useState } from "react";
import { ORIGINS, productSku, type Product } from "@/data/catalog";

function Chip({
  active,
  accent,
  onClick,
  children,
}: {
  active: boolean;
  accent: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="mono rounded-lg border px-3 py-1.5 text-[11px] uppercase transition-colors"
      style={{
        borderColor: active ? accent : "rgba(90,94,83,0.25)",
        color: active ? accent : "#5A5E53",
        backgroundColor: active ? `${accent}14` : "transparent",
      }}
    >
      {children}
    </button>
  );
}

export function VariantSelector({ product }: { product: Product }) {
  const origins = product.originSlugs.map((s) => ORIGINS[s]);
  const [grade, setGrade] = useState(product.grades?.[0]);
  const [originSlug, setOriginSlug] = useState(origins[0].slug);
  const [form, setForm] = useState(product.forms[0]);

  const origin = ORIGINS[originSlug];
  const sku = productSku(product, { grade, origin, form });

  return (
    <div className="rounded-xl border border-stone/15 bg-white p-6">
      {product.grades && (
        <div className="mb-5">
          <p className="mono mb-2 text-[10px] uppercase tracking-wide text-stone/50">Grade</p>
          <div className="flex flex-wrap gap-2">
            {product.grades.map((g) => (
              <Chip key={g} active={grade === g} accent={product.accent} onClick={() => setGrade(g)}>{g}</Chip>
            ))}
          </div>
        </div>
      )}

      <div className="mb-5">
        <p className="mono mb-2 text-[10px] uppercase tracking-wide text-stone/50">Origin</p>
        <div className="flex flex-wrap gap-2">
          {origins.map((o) => (
            <Chip key={o.slug} active={originSlug === o.slug} accent={product.accent} onClick={() => setOriginSlug(o.slug)}>
              {o.name} · {o.countryCode}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="mono mb-2 text-[10px] uppercase tracking-wide text-stone/50">Certification</p>
        <div className="flex flex-wrap gap-2">
          {product.forms.map((f) => (
            <Chip key={f} active={form === f} accent={product.accent} onClick={() => setForm(f)}>{f}</Chip>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-stone/10 pt-4">
        <span className="mono text-[11px] uppercase text-stone/60">SKU</span>
        <span className="mono text-sm" style={{ color: product.accent }}>{sku}</span>
      </div>
      <p className="mono mt-2 text-[10px] uppercase text-stone/40">MOQ 25 kg → full container · {origin.coords}</p>
    </div>
  );
}
