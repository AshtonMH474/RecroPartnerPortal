// import { useRef, useEffect } from "react";
// import GearIcon from "./GearIcon";
// import { useLoader } from "@/context/loader";

// function BG() {
//   // Reference to the container div (not strictly needed here but useful if you extend functionality)
//   const containerRef = useRef(null);
//   const {isLoaded} = useLoader()
//   // Array of references to each gear div so we can update their rotation directly
//   const gearsRef = useRef([]);
//   console.log("BG isLoaded:", isLoaded);
//   useEffect(() => {
//     // Guard clause: if the container hasn't mounted, do nothing
//     if (!containerRef.current) return;

//     // Pull the current list of gear elements
//     const gears = gearsRef.current;

//     // lastScrollY tracks the last scroll position
//     let lastScrollY = window.scrollY;

//     // ticking prevents multiple requestAnimationFrame calls from stacking
//     let ticking = false;

//     // The function that actually applies rotation to each gear
//     const update = () => {
//       const scrollY = lastScrollY;
//       const rotate = scrollY * 0.12; // rotation factor, controls speed of gear rotation

//       // Rotate each gear based on scroll position
//       gears.forEach((gear) => {
//         if (gear) gear.style.transform = `rotate(${rotate}deg)`;
//       });

//       // Reset ticking so another frame can be scheduled
//       ticking = false;
//     };

//     // Event listener for scroll events
//     const onScroll = () => {
//       lastScrollY = window.scrollY;

//       // Only schedule one animation frame at a time
//       if (!ticking) {
//         requestAnimationFrame(update);
//         ticking = true;
//       }
//     };

//     // Add scroll listener, passive:true for better scroll performance
//     window.addEventListener("scroll", onScroll, { passive: true });

//     // Cleanup function removes the scroll listener on unmount
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef} // container reference
//       style={{ height: "100dvh", minHeight: "100dvh" }} // make container full viewport height
//       className="background Home overflow-hidden bg-fixed bg-center bg-cover bg-contain flex flex-col items-end" // Tailwind classes
//     >
//       {[1, 2, 3, 4, 5].map((n, i) => (
//         <div
//           key={n} // key for React list rendering
//           ref={(el) => (gearsRef.current[i] = el)} // store reference to this gear div
//           className={`mr-10 gear${n} gears`} // margin-right and gear-specific class
//           style={{ transformOrigin: "center center" }} // rotate around the center
//         >
//           <GearIcon
//             className={
//               n === 1
//                 ? "h-80 w-80 text-black"
//                 : n === 2
//                 ? "h-50 w-50"
//                 : n === 3
//                 ? "h-65 w-65 text-black"
//                 : n === 4
//                 ? "h-80 w-80"
//                 : "h-105 w-105 text-black"
//             } // size & color for each gear
//           />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default BG;
import { useRef, useEffect } from "react";
import GearIcon from "./GearIcon";
import { useLoader } from "@/context/loader";

function BG() {
  const containerRef = useRef(null);
  const gearsRef = useRef([]);
  const { isLoaded } = useLoader();
  console.log("BG isLoaded:", isLoaded);

  useEffect(() => {
    if (!containerRef.current) return;
    const gears = gearsRef.current;

    let lastScrollY = window.scrollY;
    let ticking = false;
    let animationFrameId;

    // Function to handle scroll-based rotation
    const updateScrollRotation = () => {
      const rotate = lastScrollY * 0.12;
      gears.forEach((gear) => {
        if (gear) gear.style.transform = `rotate(${rotate}deg)`;
      });
      ticking = false;
    };

    const onScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(updateScrollRotation);
        ticking = true;
      }
    };

    // Fast spinning animation while loading
    const spinFast = () => {
      gears.forEach((gear, i) => {
        if (gear)
          gear.style.transform = `rotate(${(performance.now() / 4) * (i % 2 === 0 ? 1 : -1)}deg)`;
      });
      animationFrameId = requestAnimationFrame(spinFast);
    };

    if (!isLoaded) {
      spinFast(); // start fast spin
    } else {
      cancelAnimationFrame(animationFrameId); // stop fast spin
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Cleanup when component unmounts or dependency changes
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isLoaded]); // re-run when isLoaded changes

  return (
    <div
      ref={containerRef}
      style={{ height: "100dvh", minHeight: "100dvh" }}
      className="background Home overflow-hidden bg-fixed bg-center bg-cover bg-contain flex flex-col items-end"
    >
      {[1, 2, 3, 4, 5].map((n, i) => (
        <div
          key={n}
          ref={(el) => (gearsRef.current[i] = el)}
          className={`mr-10 gear${n} gears`}
          style={{ transformOrigin: "center center" }}
        >
          <GearIcon
            className={
              n === 1
                ? "h-80 w-80 text-black"
                : n === 2
                ? "h-50 w-50"
                : n === 3
                ? "h-65 w-65 text-black"
                : n === 4
                ? "h-80 w-80"
                : "h-105 w-105 text-black"
            }
          />
        </div>
      ))}
    </div>
  );
}

export default BG;
