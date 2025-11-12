import { memo } from "react";
import Card from "./Card";

function Cards({ cards }) {
  return (
    <div className="flex flex-col gap-y-4 pt-8 pb-10">
      {cards?.map((card) => (
        // ✅ Use unique ID instead of index (prevents unnecessary re-renders)
        <Card card={card} key={card._sys?.filename || card.id || card._id || card.title} />
      ))}
    </div>
  );
}

// ✅ Memoize to prevent re-renders when parent re-renders with same cards
export default memo(Cards);