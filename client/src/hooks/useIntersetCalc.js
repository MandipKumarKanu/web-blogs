import { useEffect, useState } from "react";

function usePageStayTimer(tags) {
    // console.log(tags)
  const [hasSavedTags, setHasSavedTags] = useState(false);

  useEffect(() => {
    const saveTagsToLocalStorage = (newTags) => {
      const storedTags = JSON.parse(localStorage.getItem("interest")) || [];
      const uniqueTags = [...new Set([...storedTags, ...newTags])];
      const limitedTags = uniqueTags.slice(-3);
      localStorage.setItem("interest", JSON.stringify(limitedTags));
    };

    const timer = setTimeout(() => {
      if (!hasSavedTags) {
        console.log("tag saving");
        saveTagsToLocalStorage(tags);
        setHasSavedTags(true);
      } else {
        console.log("tag already"); 
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [tags, hasSavedTags]);

  return hasSavedTags;
}

export default usePageStayTimer;
