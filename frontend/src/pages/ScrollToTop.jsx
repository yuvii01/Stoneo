import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // This resets the window to the very top (0,0)
    window.scrollTo(0, 0);
  }, [pathname, search]); // Runs whenever the URL path or search query changes

  return null;
}