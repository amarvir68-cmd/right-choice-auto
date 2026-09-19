'use client';

import { useEffect, useState } from 'react';

export default function PromoRotator({ promotions = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (promotions.length < 2) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promotions.length]);

  if (!promotions.length) return null;
  const promo = promotions[index];

  return (
    <section className="promoRotator" aria-label="Current promotions">
      <div className="promoInner">
        <div className="promoCopy" key={promo.id || index}>
          <strong>{promo.title}</strong>
          {promo.details && <span>{promo.details}</span>}
        </div>
        {promotions.length > 1 && (
          <div className="promoDots" aria-label="Promotion selector">
            {promotions.map((item, i) => (
              <button
                key={item.id || i}
                type="button"
                className={i === index ? 'active' : ''}
                aria-label={`Show promotion ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
