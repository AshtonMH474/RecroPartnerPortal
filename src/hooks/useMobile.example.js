// ============================================
// HOW TO CHECK FOR MOBILE VIEW
// ============================================

// Import the hook
import { useMobile, useBreakpoints, useWindowWidth } from "@/hooks/useMobile";

// ============================================
// METHOD 1: Simple Mobile Detection
// ============================================
function MyComponent() {
  const isMobile = useMobile(); // Default breakpoint: 1024px (Tailwind lg)
  
  // Or specify custom breakpoint
  // const isMobile = useMobile(768); // 768px breakpoint
  
  return (
    <div>
      {isMobile ? (
        <div>Mobile View</div>
      ) : (
        <div>Desktop View</div>
      )}
    </div>
  );
}

// ============================================
// METHOD 2: Multiple Breakpoints
// ============================================
function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop } = useBreakpoints({
    isMobile: 640,   // Tailwind sm
    isTablet: 1024,  // Tailwind lg
    isDesktop: 1280  // Tailwind xl
  });
  
  return (
    <div>
      {isMobile && <div>Mobile</div>}
      {isTablet && !isMobile && <div>Tablet</div>}
      {isDesktop && <div>Desktop</div>}
    </div>
  );
}

// ============================================
// METHOD 3: Get Window Width
// ============================================
function WidthComponent() {
  const width = useWindowWidth();
  
  return (
    <div>
      Current width: {width}px
      {width < 768 && <div>Small screen</div>}
    </div>
  );
}

// ============================================
// METHOD 4: Conditional Rendering
// ============================================
function NavComponent() {
  const isMobile = useMobile();
  
  return (
    <>
      {isMobile ? (
        <MobileMenu />
      ) : (
        <DesktopMenu />
      )}
    </>
  );
}

// ============================================
// METHOD 5: Conditional Classes/Styles
// ============================================
function StyledComponent() {
  const isMobile = useMobile();
  
  return (
    <div className={isMobile ? "mobile-class" : "desktop-class"}>
      Content
    </div>
  );
}

// ============================================
// Tailwind Breakpoints Reference:
// ============================================
// sm:  640px
// md:  768px
// lg:  1024px
// xl:  1280px
// 2xl: 1536px

