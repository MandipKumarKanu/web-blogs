import { useEffect } from "react";

const useResetScrollPosition = (location) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
};

export default useResetScrollPosition;
